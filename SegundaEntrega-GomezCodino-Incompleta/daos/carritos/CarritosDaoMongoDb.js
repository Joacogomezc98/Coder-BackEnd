import ContenedorMongo from "../../contenedores/contenedorMongoDb.js"
import CarritosSchema from "../../schemas/carritosSchema.js"

class CarritosMongo extends ContenedorMongo {
    constructor(){
        super("carritos", CarritosSchema)
     }

     async addProduct(id, product){
        const updatedCart =  await this.collection.findOneAndUpdate({"_id": id},{$push: {"products": product}})
        return updatedCart
     }

     async deleteProduct(cartID, prodID){
         const deletedCart = await this.collection.findOneAndUpdate({"_id": cartID},{$pull: {"products":{"_id": prodID}}})
         return deletedCart
     }

}

export default CarritosMongo