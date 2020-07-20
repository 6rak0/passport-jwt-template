const express = require('express')
const passport = require('passport')

// configuración general

//acceso a variables de entorno
require('dotenv').config()
//crea el servidor express
const server = express()
//configura la base de datos y abre una conexión global que puede ser usada en cualquier modulo con 'mongoose.connection'
require('./config/database')
//carga de modelos
require('./models/user')
//pasa el objeto global 'passport' hacia la función de configuración
require('./config/passport')(passport)
//inicializa el objeto 'passport' en todas las peticiones
server.use(passport.initialize())
//uso de middlewares de express
server.use(express.json())
server.use(express.urlencoded({extended: true}))

//routes

//importa las rutas definidas en /routes/index.js
server.use(require('./routes'))

//servidor

//puerto del servidor
server.listen(3000, ()=>console.log('servidor listo en puerto 3000'))