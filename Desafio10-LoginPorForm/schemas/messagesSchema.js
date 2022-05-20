const mongoose = require("mongoose")

const messagesSchema = new mongoose.Schema({
    author: {
        id: {type: String, required: true, max: 100},
        nombre: {type: String, required: true, max: 100},
        apellido: {type: String, required: true, max: 100},
        edad: {type: Number, required: true, max: 150},
        alias: {type: String, required: true, max: 20},
        avatar: {type: String, required: true}
    },
    timestamp: {type: Date, required: true},
    text: {type: String, required: true, max: 140}
})

module.exports.messagesSchema = messagesSchema
