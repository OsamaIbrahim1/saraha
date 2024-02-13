import { Router } from "express";
import * as messageController from "./message.controller.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  deleteMessageSchema,
  getUserMessagesSchema,
  markMessageAsViewedSchema,
  sendMessageSchema,
} from "./message.validation-Schema.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/sendMessage/:sendTo",
  validationMiddleware(sendMessageSchema),
  expressAsyncHandler(messageController.sendMessage)
);

router.delete(
  "/deleteMessage",
  auth(),
  validationMiddleware(deleteMessageSchema),
  expressAsyncHandler(messageController.deleteMessage)
);

router.put(
  "/markMessageAsViewed",
  auth(),
  validationMiddleware(markMessageAsViewedSchema),
  expressAsyncHandler(messageController.markMessageAsViewed)
);

router.get(
  "/getUserMessages",
  auth(),
  validationMiddleware(getUserMessagesSchema),
  expressAsyncHandler(messageController.getUserMessages)
);

export default router;
