export type InviteUser = {
    color: string
    email: string
    id: string
    invitationId?: string
    login: string
    name: string
    status?: 'ALREADY_MEMBER' | 'CAN_INVITE' | 'INVITED'
}

export type CompanyInviteModalResultProps = {
    user: InviteUser
}

export type SelectedInviteUserProps = {
    user: InviteUser
}
