import { IRespuesta } from "./IRespuesta";
import { Perimetro } from "./Perimetro";
import { Superficie } from "./Superficie";

const express = require("express")

const app = express()

app.get('/perimetro/cuadrado', (req,res) => {
    const lado = req.query.lado;
    const respuesta: IRespuesta = {
        tipoDeCalculo: "Perimetro",
        resultado: Perimetro.cuadrado(lado),
        figura: "Cuadrado",
        parametros: [
            {
                lado: lado
            }
        ]
    }
    res.send(respuesta)
})

app.listen(8080, console.log("Server ON"))