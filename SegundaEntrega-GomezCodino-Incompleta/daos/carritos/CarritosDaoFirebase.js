import ContenedorFirebase from  "../../contenedores/contenedorFirebase.js"

class CarritosFirebase extends ContenedorFirebase {
    constructor(){
       super('carritos')
    }

     async deleteProduct(cartID, prodID){
        try {
            const doc = super.query.doc(cartID)
            let item = await doc.update({
                products: super.query.doc(cartID).get().products.filter(products => products.id !== prodID)
            });
            console.log("se elimino el producto", item)
        }catch(e) {
            console.log(e)
        }
     }


    async addProduct(id, product) {
        try {
            const doc = super.query.doc(id)
            let item = await doc.update({
                products: FieldValue.arrayUnion(product)
            });
            console.log("se agrego el producto", item)
        }catch(e) {
            console.log(e)
        }
    } 
}

export default CarritosFirebase
