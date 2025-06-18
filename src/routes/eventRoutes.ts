import express from 'express'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../Controllers/eventController'
import { authenticate } from '../middleware/auth'
import {
  createEventValidator,
  updateEventValidator,
  validate,
} from '../utils/validators'

const router = express.Router()

// api/events?title=meeting&location=ny&sort=createdAt:asc&page=2&limit=5

router.get('/', authenticate, getEvents)
router.post('/', authenticate, validate(createEventValidator), createEvent)
router.put('/:id', authenticate, validate(updateEventValidator), updateEvent)
router.delete('/:id', authenticate, deleteEvent)

export default router
