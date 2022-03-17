const express = require("express")
const { Router } = express
const productos = require("./productos")

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

const router = Router()

router.get('/static', (req,res) => {
    res.sendFile(__dirname + '/public/index.html')
})

const productList = new productos.Productos()


// DEVOLVER TODOS LOS PRODS
router.get('/', (req,res) => {

    res.send(productList.getAll())
    
})

// DEVOLVER PROD SEGUN ID
router.get('/:id', (req,res) => {
    // Verifico que ID sea un numero
    if (isNaN(req.params.id)) {
        res.send({ error: "El ID no es un numero" })
        return
    }
    const id = parseInt(req.params.id)

    const idProd = productList.getById(id)

    // Verifico que el producto exista
    if(!idProd){
        res.send({error: "Producto no encontrado"})
    }

    res.send(idProd)

})

// RECIBE Y AGREGA UN PRODUCTO, LO DEVUELVE CON SU ID ASIGNADO
router.post('/' ,(req, res) => {
    const newProduct = req.body

    const savedProduct = productList.saveProduct(newProduct)
    res.send(savedProduct)
})

// RECIBE Y ACTUALIZA UN PRODUCTO SEGUN SU ID
router.put('/:id', (req, res) => {

    const modProduct = req.body

    if (isNaN(req.params.id)) {
        res.send({ error: "El ID no es un numero" })
        return
    }
    const id = parseInt(req.params.id)

    productList.modifyProduct(modProduct, id)

    res.send("The product has been edited successfully")


})

// ELIMINA UN PRODUCTO SEGUN SU ID
router.delete('/:id', (req, res) => {
    
    if (isNaN(req.params.id)) {
        res.send({ error: "El ID no es un numero" })
        return
    }
    const id = parseInt(req.params.id)

    const deletedProd = productList.deleteProd(id)

    if(deletedProd){
        res.send("The product has been deleted")
    }else{
        res.send("Sorry, product was not found!")
    }

    
})





// VARIABLES SERVIDOR
app.use('/api/productos', router)

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))