import { createDocument, findDocument } from '../../../DB/dbMethods.js'
import Message from '../../../DB/models/message.model.js'
import User from '../../../DB/models/user.model.js'

//================================ Send Message ============================//
export const sendMessage = async (req, res, next) => {
  const { sendTo } = req.params
  const { content } = req.body

  const isUserExists = await findDocument(User, { _id: sendTo })
  if (!isUserExists.success) {
    return next(new Error(isUserExists.mes, { cause: isUserExists.status }))
  }
  const createMessage = await createDocument(Message, { content, sendTo })
  if (!createMessage.success) {
    return next(new Error(createMessage.mes, { cause: createMessage.status }))
  }
  return res.status(201).json({ message: 'Massge Created', createMessage })
}

//================================= Delete Messages =================================//
export const deleteMessage = async (req, res, next) => {
  const { loggedInUserId, messageId } = req.query
  const deletedMessage = await Message.findOneAndDelete({
    _id: messageId,
    sendTo: loggedInUserId
  })
  if (!deletedMessage) {
    return next(new Error('can not delete message', { cause: 400 }))
  }
  res.status(200).json({ message: 'delete message' })
}

// ============================ Mark Message as Viewed ===============================//
export const markMessageAsViewed = async (req, res, next) => {
  const { messageId, loggedInUserId } = req.query
  const updatedMessage = await Message.findOneAndUpdate(
    {
      _id: messageId,
      sendTo: loggedInUserId
    },
    { isViewed: true, $inc: { __v: 1 } },
    { new: true }
  )
  if (!updatedMessage) {
    return next(new Error('not found', { cause: 404 }))
  }
  return res.status(200).json({ message: 'Message Updated', updatedMessage })
}

//============================= List User Messages ==================================//

export const getUserMessages = async (req, res, next) => {
  const { loggedInUserId, isViewed } = req.query
  const userMessages = await Message.find({
    sendTo: loggedInUserId,
    isViewed
  }).sort({ createdAt: -1 })
  if (!userMessages.length) {
    return next(new Error('Not Found Message', { cause: 400 }))
  }
  return res.status(200).json({ message: 'Found Messages', userMessages })
}
