import express, {json, urlencoded } from 'express'
import {UserRoute} from './routes/user.route.js'

const app = express()

app.use(json())
app.use(urlencoded({extended: true}))

app.use('/api/usuarios', new UserRoute())

app.listen(3001, () => {
    console.log("🔥 Conectado")
})

