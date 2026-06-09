import { connectDB } from '../../db/connect-db.js'
import { nanoid } from 'nanoid'

export const companyModel = {
    async createWithOwner({ companyId, name, ownerId }) {
        try {
            const { rows } = await connectDB.query(
                `
                    INSERT INTO companies
                    ( id, name )
                    VALUES ( $1, $2 ) RETURNING *
                `,
                [companyId, name],
            )

            const recordId = nanoid(8)

            await connectDB.query(
                `
                    INSERT INTO company_members
                    ( id, company_id, user_id, role )
                    VALUES ( $1, $2, $3, $4 )
                `,
                [recordId, companyId, ownerId, 'OWNER'],
            )

            return rows[0]
        } catch (error) {
            throw error
        }
    },

    async getUserCompanies(userId) {
        const { rows } = await connectDB.query(
            `
            SELECT 
                c.id as "companyId",
                c.name,
                cm.role
            FROM company_members cm
            JOIN companies c ON c.id = cm.company_id
            WHERE cm.user_id = $1
            ORDER BY c.name ASC
            `,
            [userId],
        )

        return rows
    },

    async getCompanyById({ companyId, userId }) {
        const { rows } = await connectDB.query(
            `
        SELECT 
            c.id as "companyId",
            c.name,
            cm.role
        FROM company_members cm
        JOIN companies c ON c.id = cm.company_id
        WHERE cm.user_id = $1 AND c.id = $2
        `,
            [userId, companyId],
        )

        return rows[0] || null
    },

    async updateCompanyName({ companyId, name }) {
        const { rows } = await connectDB.query(
            `
                UPDATE companies
                SET name = $1
                WHERE id = $2
                RETURNING id as "companyId", name
            `,
            [name, companyId],
        )

        return rows[0] || null
    },

    async deleteCompany({ companyId, userId }) {
        const { rows: memberRows } = await connectDB.query(
            `
        SELECT role
        FROM company_members
        WHERE company_id = $1 AND user_id = $2
        `,
            [companyId, userId],
        )

        const member = memberRows[0]

        if (!member) {
            return null
        }

        if (member.role !== 'OWNER') {
            throw new Error('FORBIDDEN')
        }

        await connectDB.query(
            `
        DELETE FROM company_members
        WHERE company_id = $1
        `,
            [companyId],
        )

        const { rows } = await connectDB.query(
            `
        DELETE FROM companies
        WHERE id = $1
        RETURNING id as "companyId"
        `,
            [companyId],
        )

        return rows[0] || null
    },

    async getCompanyMembers({ companyId, userId }) {
        const access = await this.getCompanyById({
            companyId,
            userId,
        })

        if (!access) {
            return null
        }

        const { rows } = await connectDB.query(
            `
                SELECT
                    u.id,
                    u.login,
                    cm.role
                FROM company_members cm
                         JOIN users u ON u.id = cm.user_id
                WHERE cm.company_id = $1
                  AND cm.role <> 'OWNER'
                ORDER BY
                    u.login
            `,
            [companyId],
        )

        return rows
    },

    async getCompanyAccessUsers({ companyId, userId }) {
        const access = await this.getCompanyById({
            companyId,
            userId,
        })

        if (!access) {
            return null
        }

        const { rows } = await connectDB.query(
            `
                SELECT
                    u.id,
                    u.login,
                    cm.role,
                    NULL as "invitationId",
                    'ALREADY_MEMBER' as status
                FROM company_members cm
                JOIN users u ON u.id = cm.user_id
                WHERE cm.company_id = $1
                  AND cm.role <> 'OWNER'

                UNION ALL

                SELECT
                    u.id,
                    u.login,
                    i.role,
                    i.id as "invitationId",
                    'INVITED' as status
                FROM invitations i
                JOIN users u ON u.id = i.user_id
                WHERE i.company_id = $1
                  AND i.status = 'PENDING'
                  AND i.expires_at > NOW()

                ORDER BY login
            `,
            [companyId],
        )

        return rows
    },

    async updateMemberRole({ companyId, memberId, role }) {
        const { rows } = await connectDB.query(
            `
                UPDATE company_members
                SET role = $1
                WHERE company_id = $2
                  AND user_id = $3
                RETURNING
                    user_id as "id",
                    role
            `,
            [role, companyId, memberId],
        )

        return rows[0] || null
    },

    async deleteMember({ companyId, memberId }) {
        const { rows } = await connectDB.query(
            `
                DELETE FROM company_members
                WHERE company_id = $1
                  AND user_id = $2
                RETURNING
                    user_id as "id",
                    role
            `,
            [companyId, memberId],
        )

        return rows[0] || null
    },

    async getMemberById({ companyId, memberId }) {
        const { rows } = await connectDB.query(
            `
        SELECT
            user_id as "id",
            role
        FROM company_members
        WHERE company_id = $1
          AND user_id = $2
        `,
            [companyId, memberId],
        )

        return rows[0] || null
    },

    async getEmployeeMonth({ companyId, userId, month, year }) {
        const { rows: employeeRows } = await connectDB.query(
            `
                SELECT
                    cm.role,
                    e.id,
                    e.first_name as "firstName",
                    e.last_name as "lastName",
                    e.middle_name as "middleName",
                    e.position,
                    e.payment_type as "paymentType",
                    e.fixed_salary as "fixedSalary",
                    e.hourly_rate as "hourlyRate",
                    e.hire_date as "hireDate",
                    e.is_active as "isActive"
                FROM company_members cm
                LEFT JOIN employees e ON e.company_member_id = cm.id
                WHERE cm.company_id = $1
                  AND cm.user_id = $2
            `,
            [companyId, userId],
        )

        const employee = employeeRows[0]

        if (!employee) {
            return null
        }

        if (!employee.id) {
            return {
                companyId,
                month,
                year,
                paymentType: 'HOURLY',
                profile: null,
                workDays: [],
            }
        }

        const { rows: workDays } = await connectDB.query(
            `
                SELECT
                    EXTRACT(DAY FROM work_date)::int as day,
                    work_date as "workDate",
                    hours_worked as "hoursWorked",
                    overtime_hours as "overtimeHours"
                FROM work_logs
                WHERE employee_id = $1
                  AND work_date >= make_date($2, $3, 1)
                  AND work_date < make_date($2, $3, 1) + INTERVAL '1 month'
                ORDER BY work_date ASC
            `,
            [employee.id, year, month],
        )

        return {
            companyId,
            month,
            year,
            paymentType: employee.paymentType,
            profile: {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                middleName: employee.middleName,
                position: employee.position,
                paymentType: employee.paymentType,
                fixedSalary: employee.fixedSalary,
                hourlyRate: employee.hourlyRate,
                hireDate: employee.hireDate,
                isActive: employee.isActive,
            },
            workDays,
        }
    },

    async getEmployeeAccess({ companyId, employeeId, userId }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    requester.role as "requesterRole",
                    owner_member.user_id as "employeeUserId",
                    e.id as "employeeId"
                FROM company_members requester
                JOIN employees e ON e.id = $2
                JOIN company_members owner_member
                  ON owner_member.id = e.company_member_id
                 AND owner_member.company_id = requester.company_id
                WHERE requester.company_id = $1
                  AND requester.user_id = $3
            `,
            [companyId, employeeId, userId],
        )

        return rows[0] || null
    },

    async getWorkLogs({ employeeId, month, year }) {
        const params = [employeeId]
        const periodFilter =
            Number.isInteger(month) && Number.isInteger(year)
                ? `AND work_date >= make_date($2, $3, 1)
                   AND work_date < make_date($2, $3, 1) + INTERVAL '1 month'`
                : ''

        if (periodFilter) {
            params.push(year, month)
        }

        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    employee_id as "employeeId",
                    work_date as "workDate",
                    hours_worked as "hoursWorked",
                    overtime_hours as "overtimeHours",
                    created_at as "createdAt"
                FROM work_logs
                WHERE employee_id = $1
                ${periodFilter}
                ORDER BY work_date ASC
            `,
            params,
        )

        return rows
    },

    async createWorkLog({ id, employeeId, workDate, hoursWorked, overtimeHours }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO work_logs
                    (id, employee_id, work_date, hours_worked, overtime_hours)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING
                    id,
                    employee_id as "employeeId",
                    work_date as "workDate",
                    hours_worked as "hoursWorked",
                    overtime_hours as "overtimeHours",
                    created_at as "createdAt"
            `,
            [id, employeeId, workDate, hoursWorked, overtimeHours],
        )

        return rows[0]
    },

    async deleteWorkLog({ companyId, workLogId }) {
        const { rows } = await connectDB.query(
            `
                DELETE FROM work_logs wl
                USING employees e
                JOIN company_members cm ON cm.id = e.company_member_id
                WHERE wl.id = $1
                  AND wl.employee_id = e.id
                  AND cm.company_id = $2
                RETURNING
                    wl.id,
                    wl.employee_id as "employeeId"
            `,
            [workLogId, companyId],
        )

        return rows[0] || null
    },

    async getBonuses({ employeeId }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    employee_id as "employeeId",
                    amount,
                    description,
                    created_at as "createdAt"
                FROM bonuses
                WHERE employee_id = $1
                ORDER BY created_at DESC
            `,
            [employeeId],
        )

        return rows
    },

    async createBonus({ id, employeeId, amount, description }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO bonuses
                    (id, employee_id, amount, description)
                VALUES ($1, $2, $3, $4)
                RETURNING
                    id,
                    employee_id as "employeeId",
                    amount,
                    description,
                    created_at as "createdAt"
            `,
            [id, employeeId, amount, description],
        )

        return rows[0]
    },

    async deleteBonus({ companyId, bonusId }) {
        const { rows } = await connectDB.query(
            `
                DELETE FROM bonuses b
                USING employees e
                JOIN company_members cm ON cm.id = e.company_member_id
                WHERE b.id = $1
                  AND b.employee_id = e.id
                  AND cm.company_id = $2
                RETURNING
                    b.id,
                    b.employee_id as "employeeId"
            `,
            [bonusId, companyId],
        )

        return rows[0] || null
    },

    async getEmployeePayrollInput({ companyId, employeeId, month, year }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    e.id,
                    e.payment_type as "paymentType",
                    COALESCE(e.fixed_salary, 0) as "fixedSalary",
                    COALESCE(e.hourly_rate, 0) as "hourlyRate",
                    COALESCE(SUM(wl.hours_worked), 0) as "hoursWorked",
                    COALESCE(SUM(wl.overtime_hours), 0) as "overtimeHours",
                    COALESCE((
                        SELECT SUM(b.amount)
                        FROM bonuses b
                        WHERE b.employee_id = e.id
                    ), 0) as "bonusPayment"
                FROM employees e
                JOIN company_members cm ON cm.id = e.company_member_id
                LEFT JOIN work_logs wl
                  ON wl.employee_id = e.id
                 AND wl.work_date >= make_date($3, $4, 1)
                 AND wl.work_date < make_date($3, $4, 1) + INTERVAL '1 month'
                WHERE e.id = $1
                  AND cm.company_id = $2
                GROUP BY e.id
            `,
            [employeeId, companyId, year, month],
        )

        return rows[0] || null
    },

    async createPayroll({
        id,
        employeeId,
        month,
        year,
        paymentType,
        baseSalary,
        overtimePayment,
        bonusPayment,
        ndflAmount,
        finalSalary,
    }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO payrolls
                    (
                        id,
                        employee_id,
                        period_month,
                        period_year,
                        payment_type,
                        base_salary,
                        overtime_payment,
                        bonus_payment,
                        ndfl_amount,
                        final_salary
                    )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING
                    id,
                    employee_id as "employeeId",
                    period_month as "month",
                    period_year as "year",
                    payment_type as "paymentType",
                    base_salary as "baseSalary",
                    overtime_payment as "overtimePayment",
                    bonus_payment as "bonusPayment",
                    ndfl_amount as "ndflAmount",
                    final_salary as "finalSalary",
                    created_at as "createdAt"
            `,
            [
                id,
                employeeId,
                month,
                year,
                paymentType,
                baseSalary,
                overtimePayment,
                bonusPayment,
                ndflAmount,
                finalSalary,
            ],
        )

        return rows[0]
    },

    async getCompanyPayrolls({ companyId }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    p.id,
                    p.employee_id as "employeeId",
                    p.period_month as "month",
                    p.period_year as "year",
                    p.payment_type as "paymentType",
                    p.base_salary as "baseSalary",
                    p.overtime_payment as "overtimePayment",
                    p.bonus_payment as "bonusPayment",
                    p.ndfl_amount as "ndflAmount",
                    p.final_salary as "finalSalary",
                    p.created_at as "createdAt"
                FROM payrolls p
                JOIN employees e ON e.id = p.employee_id
                JOIN company_members cm ON cm.id = e.company_member_id
                WHERE cm.company_id = $1
                ORDER BY p.period_year DESC, p.period_month DESC, p.created_at DESC
            `,
            [companyId],
        )

        return rows
    },

    async getEmployeePayrolls({ employeeId }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    employee_id as "employeeId",
                    period_month as "month",
                    period_year as "year",
                    payment_type as "paymentType",
                    base_salary as "baseSalary",
                    overtime_payment as "overtimePayment",
                    bonus_payment as "bonusPayment",
                    ndfl_amount as "ndflAmount",
                    final_salary as "finalSalary",
                    created_at as "createdAt"
                FROM payrolls
                WHERE employee_id = $1
                ORDER BY period_year DESC, period_month DESC, created_at DESC
            `,
            [employeeId],
        )

        return rows
    },

    async createInvitation({
        id,
        token,
        companyId,
        userId,
        role,
        createdBy,
        expiresAt,
    }) {
        const { rows } = await connectDB.query(
            `
                INSERT INTO invitations
                ( id, token, company_id, user_id, role, created_by, expires_at, status )
                VALUES ( $1, $2, $3, $4, $5, $6, $7, 'PENDING' )
                RETURNING
                    id,
                    token,
                    company_id as "companyId",
                    user_id as "userId",
                    role,
                    status,
                    expires_at as "expiresAt"
            `,
            [id, token, companyId, userId, role, createdBy, expiresAt],
        )

        return rows[0]
    },

    async searchUsersForInvite({ companyId, query }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    u.id,
                    u.login,
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM company_members cm
                            WHERE cm.company_id = $2
                              AND cm.user_id = u.id
                        ) THEN 'ALREADY_MEMBER'
                        WHEN EXISTS (
                            SELECT 1
                            FROM invitations i
                            WHERE i.company_id = $2
                              AND i.user_id = u.id
                              AND i.status = 'PENDING'
                              AND i.expires_at > NOW()
                        ) THEN 'INVITED'
                        ELSE 'CAN_INVITE'
                    END as status
                FROM users u
                WHERE u.login ILIKE $1
                ORDER BY u.login
                LIMIT 10
            `,
            [`%${query}%`, companyId],
        )

        return rows
    },

    async getInvitationById({ companyId, invitationId }) {
        const { rows } = await connectDB.query(
            `
                SELECT
                    id,
                    company_id as "companyId",
                    user_id as "userId",
                    role,
                    status,
                    expires_at as "expiresAt"
                FROM invitations
                WHERE id = $1
                  AND company_id = $2
            `,
            [invitationId, companyId],
        )

        return rows[0] || null
    },

    async revokeInvitation({ companyId, invitationId }) {
        const { rows } = await connectDB.query(
            `
                UPDATE invitations
                SET status = 'REVOKED'
                WHERE id = $1
                  AND company_id = $2
                  AND status = 'PENDING'
                RETURNING
                    id,
                    company_id as "companyId",
                    user_id as "userId",
                    role,
                    status,
                    expires_at as "expiresAt"
            `,
            [invitationId, companyId],
        )

        return rows[0] || null
    },

    async isMember(companyId, userId) {
        const { rows } = await connectDB.query(
            `
        SELECT 1
        FROM company_members
        WHERE company_id = $1
          AND user_id = $2
        `,
            [companyId, userId],
        )

        return rows.length > 0
    },
}
