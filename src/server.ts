import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

import mongoose from 'mongoose'
import app from './app'

const PORT = process.env.PORT || 6000

const mongoUri = process.env.MONGODB_URL
if (!mongoUri) {
  throw new Error('MONGODB_URL is not defined in environment variables')
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.error(err))
