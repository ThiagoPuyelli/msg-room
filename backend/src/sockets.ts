import { Application } from 'express'
import { Server } from 'http'
import jwt from 'jsonwebtoken'
import User from './models/User'
import session from 'express-session'
import passport from 'passport'

export const setSockets = (app: Application) => {
  const server = new Server(app)

  const io = require('socket.io')(server)

  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

  io.use(wrap(session({
    secret: process.env.SESSION_PASS,
    resave: false,
    saveUninitialized: false
  })))
    .use(wrap(passport.initialize()))
    .use(wrap(passport.session()))
    .use(async (socket, next) => {
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

      return next(null, user)
    })

  io.on('connection', (socket) => {
    socket.emit('saludo', 'hola pibe')
  })

  return server
}
