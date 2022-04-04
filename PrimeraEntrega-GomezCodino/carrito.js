const fs = require('fs');

class Carrito {
    constructor(file) {
        this.cart = file
    }

    async createIfNotExists() {
        let file;
        try {
            // Leo si el archivo existe
            file = await fs.promises.readFile(this.cart, 'utf-8');
            // Si existe, lo devuelvo
            return file;
        } catch (error) {
            // Si hay algun error, verifico que sea porque el archivo no existe y creo uno con un array vacio
            if (error.code == 'ENOENT') {
                await fs.promises.writeFile(this.cart, '[]');
                // Luego de crearlo, leo su valor para que la funcion devuelva un valor al ser llamada
                file = await fs.promises.readFile(this.cart, 'utf-8');
            } else {
                // Si el error es por otra cosa, lo muestro por consola
                console.log(error);
            }
        }
        // Devuelvo el resultado
        return file;
    }

    async createCart(newCart) {

        // Guardo el valor del metodo auxiliar
        let cart = await this.createIfNotExists();
        // Lo transformo a un objeto de javascript (actualmente es un archivo de texto plano, o sea, un string)
        let cartList = JSON.parse(cart);

        if (!cartList.length) {
            newCart.id = 1;
        } else {
            newCart.id = cartList[cartList.length - 1].id + 1;
        }

        //Agrego timestamp
        newCart.timestamp = Date.now()

        cartList.push(newCart)

        try {
            await fs.promises.writeFile(this.cart, JSON.stringify(cartList, null, 2))
            return newCart;
        } catch (error) {
            throw new Error(`Your cart couldn't be created: ${error}`)
        }

    }

    async deleteCart(id) {

        let file;
        try {
            file = await fs.promises.readFile(this.cart, 'utf-8')
        } catch (error) {
            throw new Error(`no se pudo leer el archivo: ${error}`)
        }

        const cartList = JSON.parse(file);

        let deletedCart = false
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].id == id) {
                cartList.splice(i, 1);
                deletedCart = true
                break;
            }
        }

        try {
            fs.promises.writeFile(this.cart, JSON.stringify(cartList, null, 2))
            return deletedCart
        } catch (error) {
            throw new Error(`The cart couldn't be deleted: ${error}`)
        }

    }

    async getProducts(id) {

        try {
            const cart = await fs.promises.readFile(this.cart, 'utf-8');
            const cartList = JSON.parse(cart)

            let isCart = false
            let cartProducts
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i].id == id) {
                    isCart = true
                    cartProducts = cartList[i].productos
                    break;
                }
            }
            return { cart: cartList, products: cartProducts }


        } catch (error) {
            throw new Error(`Couldn't get products: ${error}`)
        }

    }

    async addProduct(id, product) {

        try {
            const cart = await fs.promises.readFile(this.cart, 'utf-8');
            const cartList = JSON.parse(cart)

            let isCart = false

            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i].id == id) {
                    isCart = true
                    cartList[i].productos.push(product[0])
                    break;
                }
            }
            fs.promises.writeFile(this.cart, JSON.stringify(cartList, null, 2))
            return isCart
        } catch (error) {
            throw new Error(`Couldn't add product: ${error}`)
        }


    }

    async deleteProduct(cartID, productID) {

        try {
            const cart = await fs.promises.readFile(this.cart, 'utf-8');
            const cartList = JSON.parse(cart)

            let cartExists = false
            let productExists = false

            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i].id == cartID) {
                    cartExists = true
                    for (let j = 0; j < cartList[i].productos.length; j++) {
                        if (cartList[i].productos[j].id === productID) {
                            productExists = true;
                            cartList[i].productos.splice(i, 1)
                        }
                        break
                    }
                    break;
                }
            }
            fs.promises.writeFile(this.cart, JSON.stringify(cartList, null, 2))
            return { cart: cartExists, product: productExists }
        } catch (error) {
            throw new Error(`Couldn't add product: ${error}`)
        }


    }

}

module.exports.Carrito = Carrito
