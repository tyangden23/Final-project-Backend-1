import { Document, Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document
      userId?: string
    }
  }
}

export type CustomJwtPayload = {
  userId: string
  email: string
  role: string
}

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface IEvent extends Document {
  title: string
  description: string
  date: Date
  location: string
  userId: Types.ObjectId
}
