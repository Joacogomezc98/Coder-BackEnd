import ContenedorFirebase from "../../contenedores/contenedorFirebase.js"

class ProductosFirebase extends ContenedorFirebase {
    constructor() {
        super('productos')
    }

    async modifyProduct(modProduct, id) {
        try {
            const doc = super.query.doc(id)
            let item = await doc.update(modProduct);
            console.log("se actualizo", item)
        }catch(e) {
            console.log(e)
        }
    } 
}

export default ProductosFirebase
