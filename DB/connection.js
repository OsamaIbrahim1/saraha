import mongoose from 'mongoose'

const db_connection = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL_LOCAL)
    .then(() => {
      console.log('Database Connection Established')
    })
    .catch(err => {
      console.log('Database Not Connection', err)
    })
}

export default db_connection
