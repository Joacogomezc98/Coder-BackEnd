const express = require('express')
const Contenedor = require('./contenedor')

const app = express()

const file = new Contenedor.Contenedor("./productos.json")


const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

//TRAER TODOS LOS PRODUCTOS EN UN ARRAY
app.get('/productos', (solicitud, respuesta) => {
    file.getAll()
    .then((products) => respuesta.send(products))
    
})

// TRAER UN PRODUCTO RANDOM
app.get('/productoRandom', (solicitud, respuesta) => {
   file.getAll()
   .then((products) => (
    respuesta.send(products[Math.floor(Math.random()*products.length)])
   ))

})
