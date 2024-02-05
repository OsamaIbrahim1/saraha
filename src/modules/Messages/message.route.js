import { Router } from 'express'
import * as mc from './message.controller.js'
import expressAsyncHandler from 'express-async-handler'

const router = Router()

router.post('/sendMessage/:sendTo', expressAsyncHandler(mc.sendMessage))
router.delete('/deleteMessage', expressAsyncHandler(mc.deleteMessage))
router.put('/markMessageAsViewed', expressAsyncHandler(mc.markMessageAsViewed))

router.get('/getUserMessages', expressAsyncHandler(mc.getUserMessages))

export default router
