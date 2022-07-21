const express = require('express');
const session = require("express-session")
const app = express()

app.use(session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true
}))

app.get('/con-session', (req, res) => {
    const nombre = req.query.nombre
    if(req.session.contador) {
        req.session.contador++;
        res.send(`${nombre} visitado el sitio ${req.session.contador} veces`)
    }
    else {
        req.session.contador = 1
        res.send(`Bienvenido ${nombre}!`)
    }
})

app.get("/olvidar", (req, res) => {
    req.session.destroy(err => {
        if(!err) {
            res.send("Hasta luego")
        }else {
            res.send({status: "logout failed", body: err})
        }
    });

})

app.get("/login", (req, res) => {
    const { username, password } = req.query
    if(username !== 'pepe' || password !== 'pepepass') {
        return res.send('Login failed')
    }
    req.session.user = username
    req.session.admin = true
    res.send('Login success!')
})

const auth = (req, res, next) => {
    if(req.session?.user === "pepe" && req.session?.admin) {
        return next()
    }
    return res.status(401).send("error de autorizacion!")
}

app.get("/privado", auth, (req, res) => {
    res.send("Si estas viendo esto es porque estas loggeado")
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
      }
      res.send('Logout ok!')
    })
   })
   

app.listen(3000)