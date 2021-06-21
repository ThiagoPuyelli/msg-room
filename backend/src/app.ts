import express, { Application } from 'express'
import morgan from 'morgan'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import passportBasic from './auth/passport-basic'
import passportJwt from './auth/passport-jwt'

// Routes
import userRoutes from './routes/user.routes'

config()

export class App {
  public app: Application
  constructor () {
    this.app = express()

    // Connect database
    this.connectDatabase()

    // Passport
    passportBasic()
    passportJwt()

    this.setCors()
    this.setMiddlewares()
    this.setRoutes()
  }

  setMiddlewares () {
    this.app.use(morgan('dev'))
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
    this.app.use(session({
      secret: process.env.SESSION_PASS,
      resave: false,
      saveUninitialized: false
    }))
    this.app.use(passport.initialize())
    this.app.use(passport.session())
  }

  setCors () {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token')
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
      next()
    })
  }

  setRoutes () {
    this.app.use('/auth/', userRoutes)
  }

  connectDatabase () {
    try {
      connect(process.env.URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
      }, (err) => {
        if (!err) {
          console.log('database connected')
        } else {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
