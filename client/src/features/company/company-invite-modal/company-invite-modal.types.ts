export type InviteUser = {
    color: string
    email: string
    id: string
    login: string
    name: string
}

export type CompanyInviteModalResultProps = {
    user: InviteUser
}

export type SelectedInviteUserProps = {
    user: InviteUser
}
