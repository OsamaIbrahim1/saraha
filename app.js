import express from 'express'
import { config } from 'dotenv'
import db_connection from './DB/connection.js'
import userRouter from './src/modules/Users/user.route.js'
import messageRouter from './src/modules/Messages/message.route.js'
import { globalResponse } from './src/middlewares/globalResponse.js'

config({path:'./config/dev.config.env'})

const app = express()

app.use(express.json())
app.use('/user', userRouter)
app.use('/message', messageRouter)

app.use(globalResponse)

db_connection()
app.listen(process.env.PORT, () => {
  console.log('listening on port ' + process.env.PORT)
})
