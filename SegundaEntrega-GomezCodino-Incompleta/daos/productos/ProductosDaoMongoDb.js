import ContenedorMongo from '../../contenedores/contenedorMongoDb.js'
import ProductosSchema from '../../schemas/productosSchema.js'

class ProductosMongo extends ContenedorMongo {
    constructor(){
        super('productos', ProductosSchema)
     }

     async modifyProduct(modProduct, id) {
         await super.collection.updateOne({"_id": id},{$set: {modProduct}})
     }

}

export default ProductosMongo
