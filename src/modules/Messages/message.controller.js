import { createDocument, findDocument } from "../../../DB/dbMethods.js";
import Message from "../../../DB/models/message.model.js";
import User from "../../../DB/models/user.model.js";

//================================ Send Message ============================//
/**
 * * destructure data from params and body
 * * check if user is already existing
 * * create new message
 * * response successfully
 */
export const sendMessage = async (req, res, next) => {
  // * destructure data from params and body
  const { sendTo } = req.params;
  const { content } = req.body;

  // * check if user is already existing
  const isUserExists = await findDocument(User, { _id: sendTo });
  if (!isUserExists.success) {
    return next(new Error(isUserExists.mes, { cause: isUserExists.status }));
  }

  // * create new message
  const createMessage = await createDocument(Message, { content, sendTo });
  if (!createMessage.success) {
    return next(new Error(createMessage.mes, { cause: createMessage.status }));
  }

  // * response successfully
  return res.status(201).json({ message: "Massge Created", createMessage });
};

//================================= Delete Messages =================================//
/**
 * * destructure data from query and authUser
 * * check if message exists and delete by id user and id message
 * * response successfully
 */
export const deleteMessage = async (req, res, next) => {
  // * destructure data from query and authUser
  const { _id } = req.authUser;
  const { messageId } = req.query;

  // * check if message exists and delete by id user and id message
  const deletedMessage = await Message.findOneAndDelete({
    _id: messageId,
    sendTo: _id,
  });
  if (!deletedMessage) {
    return next(new Error("can not delete message", { cause: 400 }));
  }

  // * response successfully
  res.status(200).json({ message: "delete message" });
};

// ============================ Mark Message as Viewed ===============================//
/**
 * * destructure data from authUser and query
 * * find message and update
 * * response successfully
 */
export const markMessageAsViewed = async (req, res, next) => {
  // * destructure data from authUser and query
  const { _id } = req.authUser;
  const { messageId } = req.query;

  // * find message and update
  const updatedMessage = await Message.findOneAndUpdate(
    {
      _id: messageId,
      sendTo: _id,
    },
    { isViewed: true, $inc: { __v: 1 } },
    { new: true }
  );
  if (!updatedMessage) {
    return next(new Error("not found", { cause: 404 }));
  }

  // * response successfully
  return res
    .status(200)
    .json({ success: true, message: "Message Updated", updatedMessage });
};

//============================= List User Messages ==================================//
/**
 * * destructure data from query ane authUser
 * * find all message is view and sort it
 * * response successfully
 */
export const getUserMessages = async (req, res, next) => {
  // * destructure data from query ane authUser
  const { isViewed } = req.query;
  const { _id } = req.authUser;

  // * find all message is view and sort it
  const userMessages = await Message.find({
    sendTo: _id,
    isViewed,
  }).sort({ createdAt: -1 });
  if (!userMessages.length) {
    return next(new Error("Not Found Message", { cause: 400 }));
  }

  // * response successfully
  return res
    .status(200)
    .json({ success: true, message: "Found Messages", userMessages });
};
