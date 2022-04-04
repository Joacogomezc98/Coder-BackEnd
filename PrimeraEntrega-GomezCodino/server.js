const express = require("express")
const { Router } = express
const productos = require("./productos")
const carrito = require("./carrito")


const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/static', express.static(__dirname + '/public'))

const productRouter = Router()

const cartRouter = Router()


productRouter.get('/static', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


// PRODUCTS -------------------------------------------------------------------------------------------------------
const productList = new productos.Productos("./files/productos.json")

// DEVOLVER TODOS LOS PRODS
productRouter.get('/', (req, res) => {

    productList.getAll()
        .then(data => res.send(data))

})

// DEVOLVER PROD SEGUN ID
productRouter.get('/:id', (req, res) => {
    // Verifico que ID sea un numero
    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }
    const id = parseInt(req.params.id)

    productList.getById(id)
        .then(idProd => {
            // Verifico que el producto exista
            console.log(idProd)
            if (idProd.length === 0) {
                res.send({ error: "Product not found" })
            }
            res.send(idProd)
        })

})

// RECIBE Y AGREGA UN PRODUCTO, LO DEVUELVE CON SU ID ASIGNADO
productRouter.post('/', (req, res) => {
    const newProduct = req.body

    const administrador = newProduct.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })
    }

    productList.saveProduct(newProduct)
        .then(saveProduct => res.send(saveProduct))

})

// RECIBE Y ACTUALIZA UN PRODUCTO SEGUN SU ID
productRouter.put('/:id', (req, res) => {

    const modProduct = req.body

    const administrador = modProduct.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })
    }

    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }
    const id = parseInt(req.params.id)

    productList.modifyProduct(modProduct, id)
        .then(data => res.send("The product has been edited successfully"))



})

// ELIMINA UN PRODUCTO SEGUN SU ID
productRouter.delete('/:id', (req, res) => {

    const administrador = req.body.admin

    if (!administrador) {
        res.send({ error: "Request not authorized" })
    }

    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }
    const id = parseInt(req.params.id)

    productList.deleteProd(id)
        .then(deletedProd => {
            if (deletedProd) {
                res.send("The product has been deleted")
            } else {
                res.send("Sorry, product was not found!")
            }

        })

})

// CART --------------------------------------------------------------------------------------------------------------------

const carritos = new carrito.Carrito("./files/carritos.json")

// CREA UN CARRITO Y DEVUELVE EL ID
cartRouter.post('/', (req, res) => {
    const newCart = {
        timestamp: Date.now(),
        productos: []
    }

    carritos.createCart(newCart)
        .then(savedCart => res.send(`Your cart ID: ${savedCart.id}`))


})

//VACIA UN CARRITO Y LO ELIMINA
cartRouter.delete('/:id', (req, res) => {

    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }
    const id = parseInt(req.params.id)

    carritos.deleteCart(id)
        .then(deletedCart => {
            if (deletedCart) {
                res.send("The cart has been deleted")
            } else {
                res.send({ error: "Cart was not found!" })
            }
        })

})

// LISTAR TODOS LOS PRODUCTOS GUARDADOS EN EL CARRITO
cartRouter.get("/:id/productos", (req, res) => {

    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }

    const id = parseInt(req.params.id)

    carritos.getProducts(id)
        .then(cartSearch => {
            if (cartSearch.cart) {
                if (cartSearch.products.length !== 0) {
                    res.send(cartSearch.products)
                } else {
                    res.send("No products where found in this cart :(")
                }
            } else {
                res.send({ error: "The cart ID is incorrect" })
            }
        })


})

//AGREGAR UN PRODUCTO AL CARRITO POR SU ID

cartRouter.post("/:id/productos", (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({ error: "ID is not a number" })
        return
    }
    const id = parseInt(req.params.id)

    const prodID = req.body.id

    productList.getById(prodID)
        .then(product => {

            // Verifico que el producto exista
            if (!product) {
                res.send({ error: "Producto no encontrado" })
            } else {
                carritos.addProduct(id, product)
                    .then(cart => {
                        if (cart) {
                            res.send("Your product has been added to the cart!")
                        } else {
                            res.send({ error: "The cart ID is incorrect" })
                        }
                    })

            }
        })


})

// ELIMINAR UN PRODUCTO DEL CARRITO POR SU ID DE CARRITO Y DE PRODUCTO

cartRouter.delete("/:id/productos/:id_prod", (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({ error: "Cart ID is not a number" })
        return
    }

    if (isNaN(req.params.id_prod)) {
        res.send({ error: "Product ID is not a number" })
        return
    }

    const cartID = parseInt(req.params.id)
    const prodID = parseInt(req.params.id_prod)

    carritos.deleteProduct(cartID, prodID)
        .then(deleteProd => {
            if (deleteProd.cart) {
                if (deleteProd.product) {
                    res.send("Product deleted")
                } else {
                    res.send({ error: "Product not found" })
                }
            } else {
                res.send({ error: "Cart not found" })
            }
        })

})




//--------------------------------------------------------------------------------------------------------------------

// VARIABLES SERVIDOR
app.use('/api/productos', productRouter)

app.use('/api/carrito', cartRouter)

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))