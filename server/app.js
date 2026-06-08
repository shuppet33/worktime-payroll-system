import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.routes.js'
import { companiesRouter } from './routes/companies.routes.js'
import { invitationsRouter } from './routes/invitations.routes.js'

const server = express()
const PORT = 3000

dotenv.config()

server.use(
    cors({
        origin: '*',
    }),
)

server.use(express.json())

server.use('/auth', authRouter)
server.use('/companies', companiesRouter)
server.use('/invitations', invitationsRouter)

server.listen(PORT, () => console.log(`Сервер запущен. Порт: ${PORT}`))
