const express = require("express")

const app = express()

app.use('/static', express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mascotas = [
    {
        nombre: "Thor",
        edad: 2,
        raza: "Golden"
    },
    {
        nombre: "Charly",
        edad: 1,
        raza: "Labrador"
    }
]

const personas = [
    {
        nombre: "Juan",
        apellido: "Perez",
        edad: 30
    },
    {
        nombre: "Mateo",
        apellido: "Gomez",
        edad: 22
    }
]

app.route('/mascotas')
    .get((req, res) => {
        res.send(mascotas)
    })
    .post((req, res) => {
        const nuevaMascota = req.body
        mascotas.push(nuevaMascota)
        res.send('post ok')
    })

app.route('/personas')
    .get((req, res) => {
        res.send(personas)
    })
    .post((req, res) => {
        const nuevaPersona = req.body
        personas.push(nuevaPersona)
        res.send('post ok')
    })

app.listen(8080)