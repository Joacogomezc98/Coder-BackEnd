const mongoose = require('mongoose')
class UsersMongoDB {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema)
    }

    async saveUser(item) {
        try {
            const newItem = await this.collection.create(item)
            return newItem
        } catch (e) {
            throw new Error(`Error al registrar el usuario: ${e}`)
        }
    }

    async getUsers() {
        try {
            const items = await this.collection.find()
            return items
        } catch (e) {
            throw new Error(e)
        }
    }

    async getByName(nombre) {
        try{
            const item = await this.collection.findOne({'username': nombre})
            return item
        }catch(e){
            console.log(e)
            
        }
    }
}

module.exports.UsersMongoDB = UsersMongoDB