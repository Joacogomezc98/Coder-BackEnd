const express = require("express")
const moment = require("moment")
const handlebars = require("express-handlebars")
const productosDB = require("./containers/productosDB")
const { mariaDB } = require("./options/mariaDB");
const messagesMongoDb = require("./containers/messagesMongoDb");
const messagesSchema = require("./schemas/messagesSchema");
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { Strategy } = require('passport-local')
const usersMongoDB = require('./containers/usersMongoDB')
const userSchema = require('./schemas/userSchema')

const LocalStrategy = Strategy

const app = express()

const usuariosDB = new usersMongoDB.UsersMongoDB("users", userSchema.userSchema)

//MIDDLEWARES ----------------------------------------------------------------------
passport.use(new LocalStrategy(
    async (username, password, done) => {
        //Logica para validar si un usuario existe
        const existeUsuario = await usuariosDB.getByName(username)
            .then((data) => { return data })

        if (!existeUsuario) {
            console.log('Usuario no encontrado')
            return done(null, false);
        } else if (!(await verifyPass(existeUsuario, password))) {
            console.log('Contraseña invalida')
            console.log(await verifyPass(existeUsuario, password))
            return done(null, false);
        } else {
            return done(null, existeUsuario);
        }

    }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario.username);
})

passport.deserializeUser((nombre, done) => {
    usuariosDB.getByName(nombre)
        .then((data) => done(null, data));

    // done(null, usuario);
});

// -----------------------------------------------------------------------------


const productList = new productosDB.ProductosDB(mariaDB, "productos")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// SESSION CONFIG ----------------------------------------

app.use(cookieParser())
app.use(session({

    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://joacogomezc-coder:cote1234@cluster0.7fsut.mongodb.net?retryWrites=true&w=majority',
        ttl: 600
    }),
    secret: 'shhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }

}))

app.use(passport.initialize())
app.use(passport.session())

// AUTH METHODS ---------------------------------------------------------

// const auth = (req, res, next) => {
//     if (req.session.user) {
//         return next()
//     }
//     res.redirect('http://localhost:3000/login')

// }

const createHash = async (password) => {
    const saltRouds = 10

    try {
        const salt = await bcrypt.genSalt(saltRouds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (err) {
        console.log(err)
    }
}

const verifyPass = async (usuario, password) => {

    const match = await bcrypt.compare(password, usuario.password)
    return match

}

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

// ROUTES --------------------------------------------------------------------------

app.get("/login", (req, res) => {
    res.render('login')
})

// app.post('/login', (req, res) => {
//     const username = req.body.user
//     req.session.user = username
//     res.redirect('http://localhost:3000')
// })

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login-error'
    })
)

app.get('/login-error', (req, res) => {
    res.render('login-error');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { nombre, password } = req.body;
    console.log(nombre, password)

    const newUsuario = await usuariosDB.getByName(nombre)
        .then((data) => { return data });
    console.log(newUsuario)
    if (newUsuario) {
        res.render('register-error')
    } else {
        await usuariosDB.saveUser({ username: nombre, password: await createHash(password) })
        res.redirect('/login')
    }
});



app.get('/logout', (req, res) => {
    res.render('logout', { user: req.user.username })
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err })
        }
    })
}
)


// ----------------------------------------------------------


app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")


productList.createDB()
    .then(() => productList.insertProducts())

app.get("/", isAuth, (req, res) => {
    const productos = productList.getAll()
    productos.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts, user: req.user.username })
    })


});

// DATOS DEMO DESDE FAKER
app.get('/api/productos-test', (req, res) => {
    const sampleProducts = productList.getSample()
    sampleProducts.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts })
    })
})

app.get("/:id", (req, res) => {

    const id = req.params.id

    const productos = productList.getById(id)
    productos.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts })
    })

});

// SOCKET
const messages = new messagesMongoDb.MessagesMongoDb("messages", messagesSchema.messagesSchema)


const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io");
const { emitWarning } = require("process");

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")

    socket.on('new-product', data => {
        productList.saveProduct(data)
        io.sockets.emit("products", productList)
    })

    //CHAT SECTION

    messages.getMessages()
        .then((mensajes) => socket.emit('messages', mensajes))


    socket.on('new-message', data => {
        data.timestamp = moment().format("DD/MM/YYYY HH:mm:ss")
        messages.saveMessage(data)
            .then(() => {
                messages.getMessages()
                    .then((mensajes) => {
                        io.sockets.emit('messages', mensajes)
                    })
            })
    })
})

httpServer.listen(3000, () => console.log("Server ON"))