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



const app = express()
const productList = new productosDB.ProductosDB(mariaDB, "productos")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// SESSION CONFIG

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

const auth = (req, res, next) => {
    if (req.session.user) {
        return next()
    }
    return res.status(401).send("error de loggeo!")
}

app.get("/login", (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const username = req.body.user
    req.session.user = username
    res.redirect('http://localhost:3000')
})

app.get('/logout', (req, res) => {
    res.render('logout', { user: req.session.user })
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

app.get("/", auth, (req, res) => {
    const productos = productList.getAll()
    productos.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts, user: req.session.user })
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
const { Server: IOServer } = require("socket.io")

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