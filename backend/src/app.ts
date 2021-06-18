import express, { Application } from 'express'
import morgan from 'morgan'
import { connect } from 'mongoose'
import { config } from 'dotenv'
config()

export class App {
  public app: Application
  constructor () {
    this.app = express()

    // Connect database
    this.connectDatabase()

    this.setCors()
    this.setMiddlewares()
  }

  setMiddlewares () {
    this.app.use(morgan('dev'))
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())
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
