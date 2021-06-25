import { Application } from 'express'
import { Server } from 'http'
import jwt from 'jsonwebtoken'
import User from './models/User'

export const setSockets = (app: Application) => {
  const server = new Server(app)

  const io = require('socket.io')(server)

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token || token === '') {
        return next(new Error('Unauthorized'))
      }

      const payload = jwt.verify(token, process.env.JWT_PASSWORD)
      if (!payload) {
        return next(new Error('The token is invalid'))
      }

      const user = await User.findById(payload.userID)
      if (!user) {
        return next(new Error('The user is doesn\'t exist'))
      }

      socket.data.user = user
      return next(null, user)
    } catch (err) {
      next(new Error(err.message || 'Server error'))
    }
  })
    .on('connection', (socket) => {
      socket.on('join-friend', async (chat) => {
        try {
          const friend = socket.data.user.friends.find(friend => String(friend.user) === String(chat))
          if (friend) {
            socket.join(String(friend.user))
            socket.emit('message', 'Joined')
          }
        } catch (err) {
          console.log(err)
        }
      })

      socket.on('send-message', (message, room) => {
        console.log(socket.rooms)
        socket.to(room).emit('receive-messages', message)
      })
    })

  return server
}
