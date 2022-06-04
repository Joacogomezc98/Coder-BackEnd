const mongoose = require('mongoose')
class MessagesMongoDb {
    constructor(collection, schema) {
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

    async getMessages() {
        try{
            const items = await this.collection.find()
            return items
        }catch(e){
            throw new Error(e)
        }
    }

    async saveMessage(item){
        try{
            const newItem = await this.collection.create(item)
            return newItem
        }catch(e){
            throw new Error(`Error al guardar: ${e}`)
        }
    }
}

module.exports.MessagesMongoDb = MessagesMongoDb