import express, {json, urlencoded } from 'express'

const app = express()
app.use(json())
app.use(urlencoded({extended: true}))

const PORT = 3001

const nombres = ['Jorge', 'Camila', 'Joaquin']
const apellidos = ['Rodriguez', 'Gomez', 'Herreros']
const colores = ['Azul', 'Amarillo', 'rojo', 'blanco']


app.get('/test', (req,res) => {
    const users = []
    for(let i=0; i < 10; i++){
        const user = {
            nombre: nombres[Math.round(Math.random()*(nombres.length-1))],
            apellido: apellidos[Math.round(Math.random()*(apellidos.length-1))],
            color: colores[Math.round(Math.random()*(colores.length-1))]
        }
        users.push(user)
    }
    res.status(200).json({usuarios:users})
})

const server = app.listen(PORT, () => {
    console.log("🔥 Servidor en LOCALHOST 3001")
})
server.on('error', (err) => console.log(err))
