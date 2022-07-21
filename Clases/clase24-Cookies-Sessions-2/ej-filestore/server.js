const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStoreModule = require('session-file-store')

const FileStore = FileStoreModule(session)

const app = express()
app.use(cookieParser())
app.use(session({


    store: new FileStore({ path: './sesiones', ttl: 3, retries: 0 }),
    secret: 'shhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false

}))

app.get('/', (req, res) => {
    res.send({
        cookies: req.cookies,
        session: req.session
    })
})

app.get('/con-session', (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
        res.send(`Se visito ${req.session.contador} veces`)
    } else {
        req.session.contador = 1;
        res.send('Bienvenido!')
    }
})

app.listen(8080, console.log('Server listening'))