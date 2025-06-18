import { Request, Response } from 'express'
import { SortOrder } from 'mongoose'
import Event from '../models/eventModel'
import { isValidObjectId } from '../utils/validators'
import { UserRole } from '../utils/constant'

export const getEvents = async (req: Request, res: Response) => {
  const user = (req as any).user

  // Extract query parameters
  const {
    title,
    date,
    location,
    sort = 'createdAt:desc',
    page = '1',
    limit = '10',
  } = req.query as {
    title?: string
    date?: string
    location?: string
    sort?: string
    page?: string
    limit?: string
  }

  // Build base filter
  const filter: Record<string, any> =
    user.role === UserRole.ADMIN ? {} : { userId: user._id }
  if (title?.trim()) {
    const escaped = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex
    const flexibleRegex = escaped.replace(/[\/\-\s]+/g, '.*')
    filter.title = { $regex: flexibleRegex, $options: 'i' }
  }
  if (date) filter.date = date
  if (location) filter.location = { $regex: location, $options: 'i' }

  // Parse sorting
  const [sortField, sortOrder] = sort.split(':')
  const sortObj: Record<string, SortOrder> = {
    [sortField]: sortOrder === 'desc' ? -1 : 1,
  }

  // Parse pagination
  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.max(1, parseInt(limit, 10))
  const skip = (pageNum - 1) * limitNum

  try {
    const [events, total] = await Promise.all([
      Event.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Event.countDocuments(filter),
    ])

    res.json({
      message: 'Events info list',
      data: events,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error fetching events', error: (err as Error).message })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  const user = (req as any).user

  const { title, description, date, location } = req.body
  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      userId: user._id,
    })

    res.status(201).json({
      message: ' Events added',
      data: event,
    })
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error Create events', error: (err as Error).message })
  }
}

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user
  const { id } = req.params

  try {
    if (!isValidObjectId(id, res)) return

    const event = await Event.findById(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    // Only admin or event owner can update
    if (
      user.role !== UserRole.ADMIN &&
      event.userId.toString() !== user._id.toString()
    ) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const updated = await Event.findByIdAndUpdate(id, req.body, { new: true })
    res.json({
      message: '  Events info updated',
      data: updated,
    })
  } catch (err) {
    res.status(400).json({
      message: 'Error Updating events',
      error: (err as Error).message,
    })
  }
}

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user
  const { id } = req.params

  try {
    const event = await Event.findById(id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }

    if (
      user.role !== UserRole.ADMIN &&
      event.userId.toString() !== user._id.toString()
    ) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    await event.deleteOne()
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(400).json({
      message: 'Error Deleting events',
      error: (err as Error).message,
    })
  }
}
