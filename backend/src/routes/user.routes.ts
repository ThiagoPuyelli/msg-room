import User from '../models/User'
import { Router } from 'express'
import { registerJoi } from '../validators/users'
import validateReq from '../middlewares/validateReq'
import sendResponse from '../utils/sendResponse'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/sign-up', validateReq(registerJoi, 'body'), async (req, res) => {
  try {
    const { email, username } = req.body
    const verifyEmail = await User.findOne({ email })

    if (verifyEmail) {
      return sendResponse(res, 400, 'Your email is taken')
    }

    const verifyUsername = await User.findOne({ username })

    if (verifyUsername) {
      return sendResponse(res, 400, 'Your username is taken')
    }

    const user = await User.create({ ...req.body })

    if (!user) {
      return sendResponse(res, 500, 'Error to save new user')
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_PASSWORD, {
      expiresIn: 24 * 24 * 60
    })

    return sendResponse(res, 200, { token })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/sign-in',
  passport.authenticate('token'),
  async (req, res) => {
    const token = jwt.sign({ userID: req.user._id }, process.env.JWT_PASSWORD, {
      expiresIn: 24 * 24 * 60
    })

    return sendResponse(res, 200, { token })
  }
)

export default router
