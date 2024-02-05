import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isViewed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const Message = model('Message', messageSchema)

export default Message
