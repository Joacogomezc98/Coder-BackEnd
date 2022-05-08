import mongoose from "mongoose";


export default class ContenedorMongo {
    constructor(collection, schema){
        this.collection = mongoose.model(collection, schema)
        this.mongoConnect()
    }

    async mongoConnect() {
        try{
            mongoose.connect("mongodb://localhost:27017/mibase",{
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log("conectado a MongoDB")
        }
        catch (error){
            console.log(error)
        }
    }
    

    async getAll() {
        const items = await this.collection.find()
        return items
    }

    async getById(id) {
        const item = await this.collection.find({'_id': id})
        return item
    }

    async deleteById(id) {
       const deletedItem = await this.collection.findOneAndDelete({"_id": id})
       return deletedItem
    }

    async create(item){
        const newItem = await this.collection.save(item)
        return newItem
    }

}