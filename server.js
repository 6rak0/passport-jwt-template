const express = require('express')
const passport = require('passport')
const path = require('path')
//const cors = require('cors')

// configuración general

//puerto
const PORT = process.env.PORT || 3000
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

//server.use(cors())

//routes

//importa las rutas definidas en /routes/index.js
server.use('/api', require('./routes'))

//configura la ruta para que el servidor despliegue el contenido estático (frontend)
if (process.env.NODE_ENV === 'production'){
  server.use(express.static('client/build'))
  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

//servidor

//puerto del servidor
server.listen(PORT, () => console.log(`servidor listo en puerto ${PORT}`))