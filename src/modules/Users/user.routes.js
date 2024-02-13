import { Router } from "express";
import * as userController from "./user.controller.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  deleteAccountSchema,
  getUserDataSchema,
  signInSchema,
  signUpSchema,
  uploadImageSchema,
} from "./user.Validation-Schema.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtentions.js";

const router = Router();

router.post(
  "/signUp",
  validationMiddleware(signUpSchema),
  expressAsyncHandler(userController.signUp)
);

router.post(
  "/signIn",
  validationMiddleware(signInSchema),
  expressAsyncHandler(userController.signIn)
);

router.post(
  "/uploadImage",
  auth(),
  validationMiddleware(uploadImageSchema),
  multerMiddleHost({ extintions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(userController.uploadImage)
);

router.put(
  "/updateAccount",
  auth(),
  validationMiddleware(uploadImageSchema),
  multerMiddleHost({ extintions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(userController.updateAccount)
);

router.delete(
  "/deleteAccount",
  auth(),
  validationMiddleware(deleteAccountSchema),
  expressAsyncHandler(userController.deleteAccount)
);

router.get(
  "/getUserData",
  auth(),
  validationMiddleware(getUserDataSchema),
  expressAsyncHandler(userController.getUserData)
);

export default router;
