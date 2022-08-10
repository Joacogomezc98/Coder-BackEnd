import express, {json, urlencoded } from 'express'
import fs from 'fs'
import {faker} from '@faker-js/faker';

const app = express()
app.use(json())
app.use(urlencoded({extended: true}))

const PORT = 3001

app.get('/test', (req,res) => {
    const users = []
    let qty = parseInt(req.query.count)

    if(!qty){
        qty = 10
    }

    for(let i=0; i < qty; i++){
        const user = {
            nombre: faker.name.firstName(),
            apellido: faker.name.lastName(),
            color: faker.commerce.color()
        }
        users.push(user)
    }
    res.status(200).json({usuarios:users})
})

const server = app.listen(PORT, () => {
    console.log("🔥 Servidor en LOCALHOST 3001")
})
server.on('error', (err) => console.log(err))
