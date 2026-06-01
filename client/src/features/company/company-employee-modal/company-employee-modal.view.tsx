import { Modal } from 'antd';

import type { Employee } from '$entities/employee';

type Props = {
    employee?: Employee;
    open: boolean;
    onClose: () => void;
}

export const CompanyEmployeeModal = ({
    employee,
    open,
    onClose,
}: Props) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Сотрудник"
        >
            <p>
                {employee?.lastName}{' '}
                {employee?.firstName}
            </p>

            <p>
                {employee?.position}
            </p>

            <p>
                {employee?.paymentType}
            </p>
        </Modal>
    );
};
