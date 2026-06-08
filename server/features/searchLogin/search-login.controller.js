import { searchLoginModel } from './search-login.model.js'

export const searchLoginController = {
    async searchLogin(req, res) {
        try {
            const { login } = req.query
            console.log(login)

            if (!login?.trim()) {
                return res.status(400).json({
                    message: 'Логин обязателен',
                })
            }

            const users = await searchLoginModel.searchByLogin(login)

            return res.status(200).json(users)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Ошибка поиска',
            })
        }
    },
}
