const fs = require('fs');

class Contenedor {
    constructor(file) {
        this.file = file
    }

    // Metodo auxiliar para verificar si el archivo existe
    async createIfNotExists() {
        let file;
        try {
            // Leo si el archivo existe
            file = await fs.promises.readFile(this.file, 'utf-8');
            // Si existe, lo devuelvo
            return file;
        } catch (error) {
            // Si hay algun error, verifico que sea porque el archivo no existe y creo uno con un array vacio
            if (error.code == 'ENOENT') {
                await fs.promises.writeFile(this.file, '[]');
                // Luego de crearlo, leo su valor para que la funcion devuelva un valor al ser llamada
                file = await fs.promises.readFile(this.file, 'utf-8');
            } else {
                // Si el error es por otra cosa, lo muestro por consola
                console.log(error);
            }
        }
        // Devuelvo el resultado
        return file;
    }

    async save(obj) {
        // Guarda el objeto que recibe en file y devolver el ID que se le asigna

        // Guardo el valor del metodo auxiliar
        let file = await this.createIfNotExists();
        // Lo transformo a un objeto de javascript (actualmente es un archivo de texto plano, o sea, un string)
        let productList = JSON.parse(file);

        if (!productList.length) {
            obj.id = 1;
        } else {
            obj.id = productList[productList.length - 1].id + 1;
        }

        productList.push(obj)

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(productList, null, 2))
            return obj.id;
        } catch (error) {
            throw new Error(`no se pudo guardar su producto: ${err.message}`)
        }

    }

    async getById(id) {
          //Recibe un id y debe devolver el objeto con ese id o null si no existe.
        let productList;
        try {
            const file = await fs.promises.readFile(this.file, 'utf-8');
            productList = JSON.parse(file);
        } catch (error) {
            throw new Error(`no se pudo leer el archivo: ${err.message}`)
        }
        // El metodo va a devolver el primer indice del nuevo array creado con filter
        return productList.filter(products => products.id === id)[0];
    }

    async getAll() {
        // Devuelve un array con todos los objetos presentes en el archivo (file)
        try {
            const file = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(file)
        } catch (error) {
            throw new Error(`no se pudo leer el archivo: ${error}`)
        }
    }

    async deleteById(id) {
        // Elimina del archivo el objeto con el id buscado

        let file;
        try {
            file = await fs.promises.readFile(this.file, 'utf-8')
        } catch (error) {
            throw new Error(`no se pudo leer el archivo: ${err.message}`)
        }
        const productList = JSON.parse(file);


        for (let i = 0; i < productList.length; i++) {
            if (productList[i].id == id) {
                productList.splice(i, 1);
                break;
            }
        }


        try {
            fs.promises.writeFile(this.file, JSON.stringify(productList, null, 2))
            console.log("El producto ha sido eliminado!")
        } catch (error) {
            throw new Error(`no se pudo eliminar el producto: ${err.message}`)
        }

    }

    async deleteAll() {
        //Elimina todos los objetos presentes en el archivo

        try {
            await fs.promises.writeFile(this.file, '[]')
            console.log("Los productos han sido eliminados!")
        } catch (error) {
            throw new Error(`no se pudieron eliminar los productos: ${err.message}`)
        }
    }

}


module.exports.Contenedor = Contenedor
