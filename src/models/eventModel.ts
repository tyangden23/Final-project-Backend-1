import { Schema, model } from 'mongoose'
import { IEvent } from '../types/event'

const EventSchema = new Schema<IEvent>(
  {
    title: String,
    description: String,
    date: Date,
    location: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default model<IEvent>('Event', EventSchema)
