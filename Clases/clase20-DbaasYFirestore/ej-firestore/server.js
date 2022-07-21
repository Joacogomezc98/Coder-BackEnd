let admin = require("firebase-admin")

let serviceAccount = require("./clave.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://e-drink-backend.firebaseio.com"
})

console.log("base de datos conectada")


const CRUD = async() => {

    const db = admin.firestore()
    const query = db.collection("usuarios")

    try {
        // CREATE
        const usuariosData = {
            nombre: "Juan",
            apellido: "Perez",
            dni: "1111111"
        }
        let doc = query.doc();
        await doc.create(usuariosData)

        console.log("Usuario Creado")
    }catch (e){
        console.log(e)
    }

}

CRUD()
