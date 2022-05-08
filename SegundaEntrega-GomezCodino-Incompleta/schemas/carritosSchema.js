import mongoose from "mongoose";


const CarritosSchema = new mongoose.Schema({
    timestamp: {type: Number, required: true, max: 100},
    products: {type: Object, required: false, max: 100}
})

export default CarritosSchema