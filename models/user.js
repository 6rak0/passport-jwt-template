const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
  isAdmin: Boolean
})

model('User', userSchema)