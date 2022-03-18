const express = require("express")
const handlebars = require("express-handlebars")
const productos = require("./productos")


const app = express()
const productList = new productos.Productos()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))


app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")

app.get("/productos", (req, res) => {
    const datos = productList.getAll()
    let noProducts = true
    if(datos.length != 0){
        noProducts= false
    }

    res.render("main", {data: datos, products: noProducts})

});

app.get("/", (req, res) => {
    res.render("form")
})

app.post("/productos", (req, res) => {
    const newProd = req.body
    productList.saveProduct(newProd)
    res.redirect('/productos')
})

app.listen("8080", () => console.log("ready"))