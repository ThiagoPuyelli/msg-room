import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import User from '../models/User'

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
  })

  passport.use('token', new BasicStrategy(
    async (username, password, done) => {
      try {
        let user: any = await User.findOne({ username })

        if (!user) {
          user = await User.findOne({ email: username })

          if (!user) {
            done(false)
          }
        }

        const verifyPassword: boolean = await user.validPassword(password)

        if (!verifyPassword) {
          done(false)
        }

        if (user.toObject) {
          user = user.toObject()
          console.log(user)
        }

        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  ))
}
