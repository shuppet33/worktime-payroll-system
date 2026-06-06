import { atom } from '@reatom/framework'

export type User = {
    user: {
        id: string
        login: string
        companies?: {
            id: string
            role: string
            company_id: string
            company_name: string
        }[]
    }
}

export const tokenAtom = atom<string | null>(null)
export const userAtom = atom<User | null>(null)