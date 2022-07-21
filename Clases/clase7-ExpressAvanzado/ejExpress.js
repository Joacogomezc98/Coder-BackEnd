const express = require('express')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en el servidor: ${error}`))

const frase = "Hola mundo como estan?"

app.get("/api/frase", (req, res) => {
    res.send(frase)
})

app.get("/api/letras/:num", (req, res) => {
    if (isNaN(req.params.num)) {
        res.send({ error: "El parametro no es un numero" })
        return
    }
    const numero = parseInt(req.params.num)

    if(numero > frase.length){
        res.send({ error: "El parametro esta fuera de rango" })
        return
    }

    const noSpaces = frase.replace(/ /g, "")

    res.send(noSpaces.charAt(numero - 1))
})

app.get("/api/palabra/:num", (req, res) => {

    if (isNaN(req.params.num)) {
        res.send({ error: "El parametro no es un numero" })
        return
    }
    
    const numero = parseInt(req.params.num)

    if(numero> frase.split(" ").length){
        res.send({ error: "El parametro esta fuera de rango" })
        return
    }

    res.send(frase.split(" ")[numero - 1])
})