const fs = require('fs');

const express = require("express")

const app = express()

// defino el motor de plantilla
app.engine('cte', function (filePath, options, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) {
      return callback(new Error(err));
    }
    const rendered = content.toString()
                            .replace('^^titulo$$', ''+ options.titulo +'')
                            .replace('^^mensaje$$', ''+ options.mensaje +'')
                            .replace('^^autor$$', ''+ options.autor +'')
                            .replace('^^version$$', ''+ options.version +'')
                            .replace('^^nombre$$', ''+ options.nombre +'')
                            .replace('^^apellido$$', ''+ options.apellido +'')
                            .replace('^^date$$', ''+ options.date +'')
                            

    return callback(null, rendered);
  });
});
app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'cte'); // registra el motor de plantillas

app.get("/cte1", (req, res) => {
    const datos = {
        titulo: "Prueba plantilla",
        mensaje: "Este es un mensaje",
        autor: "Joaquin",
        version: "1.0"
    }

    res.render("plantilla1", datos);
})

app.get("/cte2", (req, res) => {
    const datos = {
       nombre: "Joaquin",
       apellido: "Gomez",
       date: "2022-03-14"
    }

    res.render("plantilla2", datos);
})

app.listen("8080", () => console.log("ready"))
