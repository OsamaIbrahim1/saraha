import { createDocument, findDocument } from '../../../DB/dbMethods.js'
import User from '../../../DB/models/user.model.js'
import bycrpt from 'bcryptjs'

//============================= Sign Up =============================//
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body
  // const isUserNameDuplicate = await User.findOne({ username })
  const isUserNameDuplicate = await findDocument(User, { username })
  if (isUserNameDuplicate.success) {
    return next(new Error('Duplicate username', { cause: 409 }))
  }

  // const isEmailDuplicate = await User.findOne({ email })
  const isEmailDuplicate = await findDocument(User, { email })
  if (isEmailDuplicate.success) {
    return next(new Error('Duplicate Email', { cause: 409 }))
  }

  const passwordHashed = bycrpt.hashSync(password, +process.env.SALTS_NUMPER)

  // const newUser = await User.create({
  const newUser = await createDocument(User, {
    username,
    email,
    password: passwordHashed
  })
  if (!newUser.success) {
    return next(new Error(newUser.mes, { cause: newUser.status }))
    // return res.status(newUser.status).json({ message: newUser.mes })
  }

  res.status(newUser.status).json({ message: newUser.mes, newUser })
}
//=============================Sign In ===========================//
export const signIn = async (req, res, next) => {
  const { username, email, password } = req.body
  const user = await findDocument(User, { $or: [{ username }, { email }] })
  if (!user.success) {
    return next(new Error(user.mes, { cause: user.status }))
  }

  const checkedPassword = bycrpt.compareSync(
    password,
    user.isDocumentExists.password
  )
  if (!checkedPassword) {
    return next(new Error('Enter Correct Password', { cause: 400 }))
  }
  return res.status(200).json({ message: user.mes, user })
}

//============================= Update Account ===========================//
export const updateAccount = async (req, res, next) => {
  const { _id, loggedInId } = req.query
  const { username, email } = req.body
  if (_id !== loggedInId) {
    return next(new Error('updated Failed Unauthorized', { cause: 401 }))
  }
  let updatedObject = {}
  if (username) {
    const isUserNameDuplicate = await findDocument(User, { username })
    if (isUserNameDuplicate.success) {
      return next(new Error('Duplicate username', { cause: 400 }))
    }
    updatedObject.username = username
  }
  if (email) {
    const isEmailDuplicate = await findDocument(User, { email })
    if (isEmailDuplicate.success) {
      return next(new Error('Duplicate Email', { cause: 400 }))
    }
    updatedObject.email = email
  }
  const updatedUser = await User.updateOne({ _id }, updatedObject)
  if (!updatedUser.modifiedCount) {
    return next(new Error('Not Updated', { cause: 400 }))
  }
  return res.json({ message: 'User Updated', status: 200, updatedUser })
}

//============================= Delete Account ===========================//
export const deleteAccount = async (req, res, next) => {
  const { _id, loggedInId } = req.query
  if (_id !== loggedInId) {
    return next(new Error('Deleted Failed Unauthorized', { cause: 401 }))
  }
  const deleteUser = await User.findOneAndDelete({ _id })
  if (!deleteUser) {
    return next(new Error('User Not Deleted', { cause: 400 }))
  }
  return res.json({ message: 'User Deleted', status: 200 })
}

//================================= get User Data============================//
export const getUserData = async (req, res, next) => {
  const { _id } = req.query
  const user = await User.findOne({ _id }, 'username email')
  if (!user) {
    return next(new Error('User Not Found', { cause: 404 }))
  }
  return res.json({ message: 'User Found', status: 200, user })
}
