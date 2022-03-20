const express = require("express")

const app = express()

const productos = require("./productos")


const productList = new productos.Productos()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))


app.set("views", "./views");
app.set("view engine", "pug")

app.get("/productos", (req,res) => {
    const datos = productList.getAll()
    let noProducts = true
    if(datos.length != 0){
        noProducts= false
    }
    res.render("main", {datos: datos, noProducts: noProducts})
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/form.html')
})

app.post("/productos", (req, res) => {
    const newProd = req.body
    productList.saveProduct(newProd)
    res.redirect('/productos')
})


app.listen(8080, () => console.log("Ready!"))