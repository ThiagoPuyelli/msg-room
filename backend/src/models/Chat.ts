import { Schema, Document, model } from 'mongoose'
import ChatInterface from '../interfaces/ChatInterface'

const chatSchema = new Schema<ChatInterface & Document>({
  members: {
    type: [Schema.Types.ObjectId],
    ref: 'Chat',
    minLength: 2
  },
  messages: {
    type: [{
      message: {
        type: String,
        required: true,
        maxLength: 1000
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }]
  }
})

export default model('Chat', chatSchema)
