import { Modal } from 'antd'

import { reatomComponent } from '@reatom/npm-react'

import { membersResource } from '$features/company/company.service.ts'

import { selectedCompanyIdAtom } from '$shared/companies/selected-company.ts'

import {
    memberModalOpenAtom,
    selectedMemberIdAtom,
} from './company-member-modal.reatom.ts'

export const CompanyMemberModal = reatomComponent(({ ctx }) => {
    const open = ctx.spy(memberModalOpenAtom)
    const selectedCompanyId = ctx.spy(selectedCompanyIdAtom)
    const selectedMemberId = ctx.spy(selectedMemberIdAtom)
    const membersData = ctx.spy(membersResource.dataAtom)
    const members =
        membersData.companyId === selectedCompanyId ? membersData.members : []
    const member = members.find((member) => member.id === selectedMemberId)

    return (
        <Modal
            open={open}
            footer={null}
            title="Сотрудник"
            onCancel={() => memberModalOpenAtom(ctx, false)}
        >
            <p>{member?.login}</p>

            <p>{member?.role}</p>
        </Modal>
    )
})
