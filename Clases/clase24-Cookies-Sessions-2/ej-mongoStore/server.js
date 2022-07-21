const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const MongoStore = require('connect-mongo')
// const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const app = express()
app.use(cookieParser())
app.use(session({

    // store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/sesiones', ttl: 60}), PARA MONGO LOCAL
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://joacogomezc-coder:cote1234@cluster0.7fsut.mongodb.net?retryWrites=true&w=majority',
        // mongoOptions: advancedOptions
    }),
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