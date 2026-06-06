import { companyModel } from './companies.model.js'
import { nanoid } from 'nanoid'

export const companyController = {
    async create(req, res) {
        try {
            const { name } = req.body

            const normalizedName = typeof name === 'string' ? name.trim() : ''

            if (!normalizedName) {
                return res.status(400).json({
                    message: 'Название компании обязательно',
                })
            }

            const companyId = nanoid(8)

            const company = await companyModel.createWithOwner({
                companyId,
                name: normalizedName,
                ownerId: req.user.id,
            })

            return res.status(201).json({
                company,
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка создания компании',
            })
        }
    },

    async getAll(req, res) {
        try {
            const companies = await companyModel.getUserCompanies(req.user.id)

            return res.status(200).json(companies)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения компаний',
            })
        }
    },

    async getById(req, res) {
        try {
            const { companyId } = req.params

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId обязателен',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            return res.status(200).json(company)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка получения компании',
            })
        }
    },

    async update(req, res) {
        try {
            const { companyId } = req.params
            const { name } = req.body

            const normalizedName = typeof name === 'string' ? name.trim() : ''

            if (!normalizedName) {
                return res.status(400).json({
                    message: 'Название компании обязательно',
                })
            }

            const company = await companyModel.getCompanyById({
                companyId,
                userId: req.user.id,
            })

            if (!company) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            if (company.role !== 'OWNER') {
                return res.status(403).json({
                    message: 'Недостаточно прав',
                })
            }

            const updated = await companyModel.updateCompanyName({
                companyId,
                name: normalizedName,
            })

            return res.status(200).json(updated)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка обновления компании',
            })
        }
    },

    async delete(req, res) {
        try {
            const { companyId } = req.params

            if (!companyId) {
                return res.status(400).json({
                    message: 'companyId обязателен',
                })
            }

            const result = await companyModel.deleteCompany({
                companyId,
                userId: req.user.id,
            })

            if (!result) {
                return res.status(404).json({
                    message: 'Компания не найдена или нет доступа',
                })
            }

            return res.status(200).json({
                message: 'Компания удалена',
                companyId: result.companyId,
            })
        } catch (error) {
            console.error(error)

            if (error.message === 'FORBIDDEN') {
                return res.status(403).json({
                    message: 'Недостаточно прав (только OWNER)',
                })
            }

            return res.status(500).json({
                message: 'Ошибка удаления компании',
            })
        }
    },


}
