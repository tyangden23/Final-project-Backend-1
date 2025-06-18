import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import eventRoutes from './routes/eventRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true,
  })
)

// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://localhost:3000',
//   'http://127.0.0.1:5500',
// ]

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// )

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/events', eventRoutes)

// 🏠 Root route
app.get('/', (req, res) => {
  res.send(`
    🚀 API is running...
    🌐 Status: Online
    
  `)
})

export default app
