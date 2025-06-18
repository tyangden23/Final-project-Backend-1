import { Schema, model } from 'mongoose'
import { IUser } from '../types/event'
import { UserRole } from '../utils/constant'

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
)

export default model<IUser>('User', UserSchema)
