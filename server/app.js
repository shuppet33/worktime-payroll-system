import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.routes.js'

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

server.listen(PORT, () => console.log(`Сервер запущен. Порт: ${PORT}`))
