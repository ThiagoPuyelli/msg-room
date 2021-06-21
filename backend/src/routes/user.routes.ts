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
  passport.authenticate('login'),
  async (req, res) => {
    const token = jwt.sign({ userID: req.user._id }, process.env.JWT_PASSWORD, {
      expiresIn: 24 * 24 * 60
    })

    return sendResponse(res, 200, { token })
  }
)

router.put('/request/:id', passport.authenticate('token'), async (req, res) => {
  try {
    if (req.user._id === req.params.id) {
      return sendResponse(res, 403, 'The user is you')
    }

    const friend = await User.findById(req.params.id)

    if (!friend) {
      return sendResponse(res, 404, 'The user doesn\'t exist')
    }

    const { friends, requests } = req.user

    const friendVerify = friends.find(frie => String(frie) === String(friend._id))
    console.log(String(friends[0]), String(friend._id))

    if (friendVerify) {
      return sendResponse(res, 403, 'The user is alredy your friend')
    }

    const requestVerify = await requests.find(frie => String(frie.user) === String(friend._id))

    if (requestVerify) {
      const { type } = requestVerify
      if (type === 'received') {
        return sendResponse(res, 402, 'You received request')
      } else if (type === 'envied') {
        return sendResponse(res, 402, 'The user envied request')
      }
    }

    requests.push({ user: friend._id, type: 'envied' })

    friend.requests.push({ user: req.user._id, type: 'received' })

    const newUser = await User.findByIdAndUpdate(req.user._id, { requests })

    if (!newUser) {
      return sendResponse(res, 500, 'Error to save request')
    }

    const newRequest = await friend.save()

    if (!newRequest) {
      return sendResponse(res, 500, 'Error to send Request')
    }
    return sendResponse(res, 200, 'Request sended')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/friend', passport.authenticate('token'), async (req, res) => {
  try {
    let { friends }: any = await User.findById(req.user._id)

    if (!friends || friends.length <= 0) {
      return sendResponse(res, 404, 'You don\'t have friends')
    }

    friends = (await User.populate(req.user, { path: 'friends' })).friends

    friends = friends.map(friend => {
      const { username, _id, image } = friend

      return {
        username,
        _id,
        image
      }
    })

    return sendResponse(res, 200, { friends })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/requests/:type', passport.authenticate('token'), async (req, res) => {
  try {
    const { type } = req.params

    if (!type || (type !== 'envied' && type !== 'received')) {
      return sendResponse(res, 500, 'The type is invalid')
    }

    let { requests } = await User.findById(req.user._id)

    if (!requests || requests.length <= 0) {
      return sendResponse(res, 404, 'You don\'t have requests')
    }

    requests = requests.filter(request => String(request.type) === type)

    if (!requests || requests.length <= 0) {
      return sendResponse(res, 404, 'You don\'t have requests')
    }

    return sendResponse(res, 200, { requests })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/friend/:id/:option', passport.authenticate('token'), async (req, res) => {
  try {
    const friend = await User.findById(req.params.id)

    if (!friend) {
      return sendResponse(res, 404, 'Your friend doesn\'t exist')
    }

    const request = req.user.requests.find(request => String(request.user) === String(friend._id))

    if (!request || request.type === 'envied') {
      return sendResponse(res, 404, 'The request doesn\'t exist')
    }

    if (req.params.option === 'accept') {
      friend.friends.push({ user: req.user._id })
      req.user.friends.push({ user: friend._id })
    } else if (req.params.option !== 'ignore') {
      return sendResponse(res, 402, 'The option is invalid')
    }

    friend.requests = friend.requests.filter(requ => String(requ.user) !== String(req.user._id))

    req.user.requests = req.user.requests.filter(requ => String(requ.user) !== String(friend._id))

    const newFriend = await friend.save()

    const newUser = await User.findByIdAndUpdate(req.user._id, req.user, { new: true })

    if (!newFriend || !newUser) {
      return sendResponse(res, 500, 'Error to save friend or user')
    }

    if (req.params.option === 'accept') {
      return sendResponse(res, 200, 'Friend added')
    } else if (req.params.option === 'ignore') {
      return sendResponse(res, 200, 'Friend ignored')
    }
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
