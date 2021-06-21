import { Schema, Document, model } from 'mongoose'
import { NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import UserInterface from '../interfaces/UserInterface'

const userSchema = new Schema<UserInterface & Document>({
  username: {
    type: String,
    required: true,
    maxLength: 30
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxLength: 300
  },
  password: {
    type: String,
    required: true,
    minLength: 4
  },
  image: String,
  friends: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  requests: {
    type: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      type: {
        type: String,
        enum: 'received' || 'envied',
        required: true
      },
      _id: false
    }],
    default: []
  },
  chats: {
    type: [Schema.Types.ObjectId],
    ref: 'Chat',
    default: []
  }
}, {
  versionKey: false
})

userSchema.methods.validPassword = async function (password: string) {
  try {
    const verify = await bcrypt.compare(password, this.password)

    return verify
  } catch (err) {
    return false
  }
}

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next()

  try {
    this.password = await bcrypt.hash(this.password, 10)

    return next()
  } catch (err) {
    next(err)
  }
})

export default model<UserInterface>('User', userSchema)
