const fs = require('fs');

class Productos {
  constructor(file) {
    this.productos = file
  }

  async createIfNotExists() {
    let file;
    try {
      // Leo si el archivo existe
      file = await fs.promises.readFile(this.productos, 'utf-8');
      // Si existe, lo devuelvo
      return file;
    } catch (error) {
      // Si hay algun error, verifico que sea porque el archivo no existe y creo uno con un array vacio
      if (error.code == 'ENOENT') {
        await fs.promises.writeFile(this.productos, '[]');
        // Luego de crearlo, leo su valor para que la funcion devuelva un valor al ser llamada
        file = await fs.promises.readFile(this.productos, 'utf-8');
      } else {
        // Si el error es por otra cosa, lo muestro por consola
        console.log(error);
      }
    }
    // Devuelvo el resultado
    return file;
  }

  async getAll() {
    // Devuelve un array con todos los objetos presentes en el archivo
    try {
      const productos = await fs.promises.readFile(this.productos, 'utf-8');
      return JSON.parse(productos)
    } catch (error) {
      throw new Error(`Couldn't get products: ${error}`)
    }
  }

  async getById(id) {
    //Recibe un id y debe devolver el objeto con ese id o null si no existe.
    let productList;
    try {
      const productos = await fs.promises.readFile(this.productos, 'utf-8');
      productList = JSON.parse(productos);
    } catch (error) {
      throw new Error(`Couldn't get products: ${error}`)
    }
    // El metodo va a devolver el primer indice del nuevo array creado con filter
    return productList.filter(products => products.id === id);
  }

  async saveProduct(newProduct) {
    // Guarda el objeto que recibe en file y devolver el producto

    // Guardo el valor del metodo auxiliar
    let product = await this.createIfNotExists();
    // Lo transformo a un objeto de javascript (actualmente es un archivo de texto plano, o sea, un string)
    let productList = JSON.parse(product);

    if (!productList.length) {
      newProduct.id = 1;
    } else {
      newProduct.id = productList[productList.length - 1].id + 1;
    }

    //Agrego timestamp
    newProduct.timestamp = Date.now()

    productList.push(newProduct)

    try {
      await fs.promises.writeFile(this.productos, JSON.stringify(productList, null, 2))
      return newProduct;
    } catch (error) {
      throw new Error(`no se pudo guardar su producto: ${error}`)
    }

  }

  async modifyProduct(modProduct, id) {
    // modProduct.timestamp = Date.now()
    // const index = this.productos.findIndex(products => products.id === id)

    // this.productos[index] = modProduct

    let file;
    try {
      file = await fs.promises.readFile(this.productos, 'utf-8')
    } catch (error) {
      throw new Error(`no se pudo leer el archivo: ${err.message}`)
    }

    const productList = JSON.parse(file);

    const index = productList.findIndex(products => products.id === id)
    console.log(index)

    modProduct.timestamp = Date.now()

    productList[index - 1] = modProduct

    try {
      fs.promises.writeFile(this.productos, JSON.stringify(productList, null, 2))
    } catch (error) {
      throw new Error(`The product couldn't be modified: ${error}`)
    }

  }

  async deleteProd(id) {

    let file;
    try {
      file = await fs.promises.readFile(this.productos, 'utf-8')
    } catch (error) {
      throw new Error(`no se pudo leer el archivo: ${err.message}`)
    }

    const productList = JSON.parse(file);

    let deletedProd = false
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].id == id) {
        productList.splice(i, 1);
        deletedProd = true
        break;
      }
    }

    try {
      fs.promises.writeFile(this.productos, JSON.stringify(productList, null, 2))
      return deletedProd
    } catch (error) {
      throw new Error(`The product couldn't be deleted: ${err.message}`)
    }

  }

}

module.exports.Productos = Productos
