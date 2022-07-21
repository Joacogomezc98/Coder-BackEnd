const express = require("express")
const {Server: HttpServer} = require("http")
const {Server: IOServer} = require("socket.io")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const mensajes = []

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname})
})


io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")
    
    socket.on('saveMessage', msj => {
        mensajes.push(msj)
        io.sockets.emit('msjList', mensajes)
    })
})

httpServer.listen(3000, () => console.log("Server ON"))