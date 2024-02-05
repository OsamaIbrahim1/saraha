import { Router } from 'express'
import * as uc from './user.controller.js'
import expressAsyncHandler from 'express-async-handler'

const router = Router()

router.post('/signUp', expressAsyncHandler(uc.signUp))

router.post('/signIn', expressAsyncHandler(uc.signIn))

router.put('/updateAccount', expressAsyncHandler(uc.updateAccount))

router.delete('/deleteAccount', expressAsyncHandler(uc.deleteAccount))

router.get('/getUserData', expressAsyncHandler(uc.getUserData))

export default router
