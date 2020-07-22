const { model } = require('mongoose')
const router = require('express').Router()
const User = model('User')
const passport = require('passport')
const utils = require('../lib/utils')

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.status(200).json({ success: true, msg: 'usuario autorizado' })
})

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
  .then(user => {
    if(!user) {
      res.status(401).json({ success: false, msg: "usuario no encontrado"})
    }
    const isValid = utils.validatePassword(req.body.password, user.hash, user.salt)
    if(isValid){
      const tokenObject = utils.issueJWT(user)
      res.status(200).json({ 
        success: true, 
        user: {
          username : user.username, 
          id : user._id
        }, 
        token: tokenObject.token, 
        expiresIn: tokenObject.expiresIn 
      })
    } else {
      res.status(401).json({ success: false, msg: "usuario o contraseña incorrectos" })
    }
  })
  .catch(err => console.log(err))
})

router.post('/registro', (req, res) => {
  const saltHash = utils.genPassword(req.body.password)
  const salt = saltHash.salt
  const hash = saltHash.hash

  const newUser = new User({
    username : req.body.username,
    hash: hash,
    salt: salt
  })

  newUser.save()
  .then(user => {
    const jwt = utils.issueJWT(user)
    res.status(200).json({ 
      success: true, 
      user: {
        username : user.username, 
        id : user._id
      }, 
      token: jwt.token, 
      expiresIn: jwt.expiresIn 
    })
  })
  .catch(err => console.log(err))
})

module.exports = router