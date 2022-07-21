const express = require('express')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en el servidor: ${error}`))

app.get("/sumar/:num1/:num2", (req, res) => {
    const num1 = req.params.num1
    const num2 = req.params.num2
    res.send(parseInt(num1)+parseInt(num2))
})

app.get("/sumar", (req, res) => {
    const num1 = req.query.num1
    const num2 = req.query.num2
    res.send(num1 + num2)
})

app.get("/operacion/:operacion", (req, res) => {
    const operacion = req.params.operacion

    let result
    switch (operacion.charAt(1)) {
        case "+": result = parseInt(operacion.charAt(0)) + parseInt(operacion.charAt(2))
            break;
        case "-": result = parseInt(operacion.charAt(0)) - parseInt(operacion.charAt(2))
            break
        case "*": result = parseInt(operacion.charAt(0)) * parseInt(operacion.charAt(2))
            break
        case "/": result = parseInt(operacion.charAt(0)) / parseInt(operacion.charAt(2))
        break
    }

    res.send(result)
})
// CON ERRORES, LLEGA COMO STRING TENGO QUE PASAR A NUMEROS