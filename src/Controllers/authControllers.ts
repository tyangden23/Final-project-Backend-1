import { Request, Response } from 'express'
import User from '../models/userModel'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/authUtils'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields required' })
      return
    }

    const existing = await User.findOne({ email })
    if (existing) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      role,
      password: passwordHash,
    })
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res
      .status(201)
      .json({ data: { id: user._id, name, email, role: user.role }, token })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Registration failed', error: (error as Error).message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res.json({ message: 'Login successful', token })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Login failed', error: (error as Error).message })
  }
}

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const userObj = req.user.toObject?.() ?? req.user
    const { password, ...safeUser } = userObj

    res.status(200).json({
      data: safeUser,
      message: `Welcome back, ${safeUser.name}`,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)

    res.status(400).json({
      message: 'Something went wrong while fetching profile',
    })
  }
}
