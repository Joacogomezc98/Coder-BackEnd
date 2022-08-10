import mongoose from "mongoose";
import {Usuario} from "./models/usuario.js";

CRUD()

async function CRUD() {
    try{
        mongoose.connect("mongodb://localhost:27017/mibase",{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("conectado a MongoDB")

        // CREATE
        console.log("CREATE")
        const usuariosData = {
            nombre: "Juan",
            apellido: "Perez",
            email: "jp@g.com",
            password: "123456"
        }

        const usuarioNuevo = new Usuario(usuariosData);
        await usuarioNuevo.save()
        console.log(usuarioNuevo)
        console.log("Usuario creado")
    }
    catch (error){
        console.log(error)
    }
}