import { createDocument, findDocument } from "../../../DB/dbMethods.js";
import User from "../../../DB/models/user.model.js";
import bycrpt from "bcryptjs";
import generateUniqueString from "../../utils/generate-Unique-String.js";
import jwt from "jsonwebtoken";
import cloudinaryConnection from "../../utils/cloudinary.js";

//============================= Sign Up =============================//
/**
 * * destructure data from body
 * * check if username already exists
 * * check if email already exists
 * * hash password
 * * create new user and check if created
 * * response succesfully
 */
export const signUp = async (req, res, next) => {
  // * destructure data from body
  const { username, email, password } = req.body;

  // * check if username already exists
  const isUserNameDuplicate = await findDocument(User, { username });
  if (isUserNameDuplicate.success) {
    return next(new Error("Duplicate username", { cause: 409 }));
  }

  // * check if email already exists
  const isEmailDuplicate = await findDocument(User, { email });
  if (isEmailDuplicate.success) {
    return next(new Error("Duplicate Email", { cause: 409 }));
  }

  // * hash password
  const passwordHashed = bycrpt.hashSync(password, +process.env.SALTS_NUMPER);
  if (!passwordHashed) {
    return next(new Error(`password not hashed`, { cause: 404 }));
  }

  // * create new user and check if created
  const newUser = await createDocument(User, {
    username,
    email,
    password: passwordHashed,
  });

  req.savedDocuments = { model: User, _id: newUser._id };
  if (!newUser.success) {
    return next(new Error(newUser.mes, { cause: newUser.status }));
  }

  // * response succesfully
  res.status(newUser.status).json({ message: newUser.mes, newUser });
};

//============================= Uploade Image =============================//
/**
 * * destructure data from req.authUser
 * * check if image not sent
 * * generate folderId
 * * upload Image Profile
 * * rollback if event any error
 * * save image in database
 * * response succesfully
 */
export const uploadImage = async (req, res, next) => {
  // * destructure data from req.authUser
  const { _id } = req.authUser;

  // * check if image not sent
  if (!req.file) {
    return next(new Error("Upload image please", { cause: 400 }));
  }

  // * generate folderId
  const folderId = generateUniqueString(5);

  // * upload Image Profile
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/User/${folderId}`,
    });

  // * rollback if event any error
  req.folder = `${process.env.MAIN_FOLDER}/User/${folderId}`;

  // * save image in database
  const uploadedImage = await User.findByIdAndUpdate(
    _id,
    {
      Image: { secure_url, public_id },
      folderId,
    },
    { new: true }
  );
  req.savedDocuments = { model: User, _id };

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "uploaded successfully", uploadedImage });
};

//============================= Sign In ===========================//
/**
 * * destructure data from request body
 * * check if user already exists
 * * check match password
 * * generate token for user
 * * response successfully
 */
export const signIn = async (req, res, next) => {
  // * destructure data from request body
  const { username, email, password } = req.body;

  // * check if user already exists
  const user = await findDocument(User, { $or: [{ username }, { email }] });
  if (!user.success) {
    return next(new Error(user.mes, { cause: user.status }));
  }

  // * check match password
  const checkedPassword = bycrpt.compareSync(
    password,
    user.isDocumentExists.password
  );
  if (!checkedPassword) {
    return next(new Error("Enter Correct Password", { cause: 400 }));
  }

  // * generate token for user
  const token = jwt.sign(
    {
      email: user.isDocumentExists.email,
      username: user.isDocumentExists.username,
      id: user.isDocumentExists._id,
    },
    process.env.JWT_SECRET_LOGIN,
    { expiresIn: "1d" }
  );

  // * response successfully
  return res.status(200).json({ message: user.mes, data: token });
};

//============================= Update Account ===========================//
/**
 * * destructure data from authUser and body
 * * check user already exists
 * * check if userName is already existing
 * * check if email is already existing
 * * save changes
 * * response successfully
 */
export const updateAccount = async (req, res, next) => {
  // * destructure data from authUser and body
  const { _id } = req.authUser;
  const { username, email } = req.body;

  // * check user already exists
  const user = await User.findById(_id);
  if (!user) return next(new Error("user not found", { cause: 404 }));

  // * check if userName is already existing
  if (username) {
    const isUserNameDuplicate = await User.findOne({ username });
    if (isUserNameDuplicate) {
      return next(new Error("Duplicate username", { cause: 400 }));
    }
    user.username = username;
  }

  // * check if email is already existing
  if (email) {
    const isEmailDuplicate = await User.findOne({ email });
    if (isEmailDuplicate) {
      return next(new Error("Duplicate Email", { cause: 400 }));
    }
    user.email = email;
  }

  // * save changes
  const updatedUser = await user.save();
  if (!updatedUser) {
    return next(new Error("Not Updated User", { cause: 400 }));
  }

  // * response successfully
  return res.status(200).json({
    success: true,
    message: "User Updated",
    data: updatedUser,
  });
};

//============================= Delete Account ===========================//
/**
 * * destructure data from authUser
 * * check if user is already existing
 * * delete image user
 * * delete user
 * * response successfully
 */
export const deleteAccount = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  // * check if user is already existing
  const user = await User.findById(_id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // * delete image user
  await cloudinaryConnection().api.delete_resources_by_prefix(
    user.Image.public_id
  );

  await cloudinaryConnection().api.delete_folder(
    user.Image.public_id.split(`${user.folderId}/`)[0] + user.folderId
  );

  // * delete user
  const deleteUser = await User.findByIdAndDelete(_id);
  if (!deleteUser) {
    return next(new Error("User Not Deleted", { cause: 400 }));
  }

  // * response successfully
  return res.status(200).json({ success: true, message: "User Deleted" });
};

//================================= get User Data ============================//
/**
 * * destructure data from authUser
 * * get user data
 * * response successfully
 */
export const getUserData = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  // * get user data
  const user = await User.findOne({ _id }, "username email -_id");
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }

  // * response successfully
  return res.status(200).json({ success: true, message: "User Found", user });
};
