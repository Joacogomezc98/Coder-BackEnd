class Productos {
    constructor(){
        this.productos = [
            {
                "id": 1,
                "title": "SMIRNOFF ICE 473ml",
                "price": 180,
                "thumbnail": "http://www.puroescabio.com.ar/web/image/product.template/74947/image_256/%5B4860%5D%20SMIRNOFF%20ICE%20473ml?unique=1e17d14",
              },
              {
                "id": 2,
                "title": "SMIRNOFF 750ml",
                "price": 790,
                "thumbnail": "http://www.puroescabio.com.ar/web/image/product.template/52280/image_256/%5B2169%5D%20SMIRNOFF%20750ml?unique=1e17d14",
              },
              {
                "id": 3,
                "title": "SMIRNOFF WATERMELON 750ml",
                "price": 890,
                "thumbnail": "http://www.puroescabio.com.ar/web/image/product.template/52617/image_256/%5B2469%5D%20SMIRNOFF%20WATERMELON%20750ml%20?unique=1e17d14",
              },
              {
                "id": 4,
                "title": "SMIRNOFF ICE GREENAPPLE 473ml",
                "price": 180,
                "thumbnail": "http://www.puroescabio.com.ar/web/image/product.template/74948/image_256/%5B4859%5D%20SMIRNOFF%20ICE%20GREENAPPLE%20473ml?unique=1e17d14",
              }
        ]
    }

    getAll() {
        // Devuelve un array con todos los objetos presentes en el archivo
        return this.productos
    }

    getById(id) {
        //Recibe un id y debe devolver el objeto con ese id o null si no existe.
          return this.productos.filter(products => products.id === id)[0];
  }
  saveProduct(newProduct){

    if (!this.productos.length) {
        newProduct.id = 1;
    } else {
        newProduct.id = this.productos[this.productos.length - 1].id + 1;
    }
    this.productos.push(newProduct)
    return newProduct
  }

  modifyProduct(modProduct,id){
    const index = this.productos.findIndex(products => products.id === id)

    this.productos[index] = modProduct
    // TODO validar los campos del producto editado
  }

  deleteProd(id){
    let deletedProd = false
    for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].id == id) {
            this.productos.splice(i, 1);
            deletedProd = true
            break;
        }
    }
    return deletedProd
  }
    
}

module.exports.Productos = Productos
