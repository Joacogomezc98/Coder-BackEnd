const express = require("express")
const {Server: HttpServer} = require("http")
const {Server: IOServer} = require("socket.io")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname})
})


io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")

    socket.on('inputText', text => {
        io.sockets.emit('newText', text)
    })
   
})

httpServer.listen(3000, () => console.log("Server ON"))