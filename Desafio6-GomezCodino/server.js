const express = require("express")
const moment = require("moment")
const handlebars = require("express-handlebars")
const productos = require("./productos")

const app = express()
const productList = new productos.Productos()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")


const datos = productList.getAll()
let noProducts = true
if (datos.length != 0) {
    noProducts = false
}


app.get("/", (req, res) => {
    const datos = productList.getAll()
    let noProducts = true
    if(datos.length != 0){
        noProducts= false
    }

    res.render("main", {data: datos, products: noProducts})
});

// SOCKET
const messages = []

const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")

    let noProducts = true
        if(datos.length != 0){
            noProducts= false
        }

    socket.on('new-product', data => {
        productList.saveProduct(data)
        io.sockets.emit("products", productList)
    })

    //CHAT SECTION
    socket.emit('messages', messages)

    socket.on('new-message', data => {
        data.time = moment().format("DD/MM/YYYY HH:mm:ss")
        messages.push(data);
        io.sockets.emit("messages", messages)
    })
})

httpServer.listen(3000, () => console.log("Server ON"))