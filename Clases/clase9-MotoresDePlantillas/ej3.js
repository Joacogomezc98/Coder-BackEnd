const express = require("express")
const handlebars = require("express-handlebars")

const app = express()

app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")

app.get("/", (req, res) => {
    const datos = {
        titulo: "Prueba plantilla",
        mensaje: "Este es un mensaje",
        autor: "Joaquin",
        version: "1.0"
    }
    res.render("main", datos)
});

app.listen("8080", () => console.log("ready"))