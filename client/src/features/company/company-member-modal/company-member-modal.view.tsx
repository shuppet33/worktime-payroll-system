import { Modal } from 'antd'

import type { CompanyMember } from '$shared/companies/companies.ts'

type Props = {
    member?: CompanyMember
    open: boolean
    onClose: () => void
}

export const CompanyMemberModal = ({ member, open, onClose }: Props) => {
    return (
        <Modal open={open} onCancel={onClose} footer={null} title="Сотрудник">
            <p>{member?.login}</p>

            <p>{member?.role}</p>
        </Modal>
    )
}
