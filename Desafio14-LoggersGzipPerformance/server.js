const express = require("express")
const moment = require("moment")
const handlebars = require("express-handlebars")
const productosDB = require("./containers/productosDB")
const { mariaDB } = require("./options/mariaDB");
const messagesMongoDb = require("./containers/messagesMongoDb");
const messagesSchema = require("./schemas/messagesSchema");
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { Strategy } = require('passport-local')
const usersMongoDB = require('./containers/usersMongoDB')
const userSchema = require('./schemas/userSchema')
const parseArgs = require('minimist')
const dotenv = require('dotenv').config()
const { fork } = require('child_process')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length
const http = require('http')
const compression = require('compression')
const log4js = require('log4js')


const LocalStrategy = Strategy

const app = express()

const usuariosDB = new usersMongoDB.UsersMongoDB("users", userSchema.userSchema)

let minimistOptions = { alias: { p: 'port', m: 'mode' } }

//MIDDLEWARES ----------------------------------------------------------------------
passport.use(new LocalStrategy(
    async (username, password, done) => {
        //Logica para validar si un usuario existe
        const existeUsuario = await usuariosDB.getByName(username)
            .then((data) => { return data })

        if (!existeUsuario) {
            loggerFile.error('Usuario no encontrado')
            return done(null, false);
        } else if (!(await verifyPass(existeUsuario, password))) {
            console.log('Contraseña invalida')
            console.log(await verifyPass(existeUsuario, password))
            return done(null, false);
        } else {
            return done(null, existeUsuario);
        }

    }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario.username);
})

passport.deserializeUser((nombre, done) => {
    usuariosDB.getByName(nombre)
        .then((data) => done(null, data));

});

// -----------------------------------------------------------------------------


const productList = new productosDB.ProductosDB(mariaDB, "productos")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// LOG CONFIGURATION---------------------------------------------------------

log4js.configure({
    appenders: {
        // defino dos soportes de salida de datos
        consola: { type: "console" },
        archivo: { type: "file", filename: "error.log" },
        archivo2: { type: 'file', filename: 'warn.log' },
        // defino sus niveles de logueo
        loggerConsola: {
            type: "logLevelFilter",
            appender: "consola",
            level: "info",
        },
        loggerArchivo: {
            type: "logLevelFilter",
            appender: "archivo",
            level: "error",
        },
        loggerArchivo2: {
            type: 'logLevelFilter',
            appender: 'archivo2',
            level: 'warn'
        }
    },
    categories: {
        default: {
            appenders: ["loggerConsola"],
            level: "all",
        },
        file: {
            appenders: ["loggerArchivo", 'loggerArchivo2'],
            level: "all",
        },
    },
});


const logger = log4js.getLogger();
const loggerFile = log4js.getLogger("file");

const myLogger = (req, res, next) => {
    logger.warn('Recurso inexistente');
    loggerFile.warn('Recurso inexistente');
    next();

}

app.use(myLogger)

// SESSION CONFIG ----------------------------------------

app.use(cookieParser())
app.use(compression())
app.use(session({

    store: MongoStore.create({
        mongoUrl: process.env.MONGO_CREDENTIALS,
        ttl: 600
    }),
    secret: 'shhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }

}))

app.use(passport.initialize())
app.use(passport.session())

// AUTH METHODS ---------------------------------------------------------


const createHash = async (password) => {
    const saltRouds = 10

    try {
        const salt = await bcrypt.genSalt(saltRouds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (err) {
        console.log(err)
    }
}

const verifyPass = async (usuario, password) => {

    const match = await bcrypt.compare(password, usuario.password)
    return match

}

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

// ROUTES --------------------------------------------------------------------------

app.get("/login", (req, res) => {
    res.render('login')
})


app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login-error'
    }), () => {
        logger.info("Success!");
    }
)

app.get('/login-error', (req, res) => {
    loggerFile.error("Login error!");
    logger.error("Login error!");
    res.render('login-error');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { nombre, password } = req.body;

    const newUsuario = await usuariosDB.getByName(nombre)
        .then((data) => { return data });
    logger.info(newUsuario);
    if (newUsuario) {
        res.render('register-error')
        loggerFile.error("register error!");
        logger.error("register error error!");
    } else {
        await usuariosDB.saveUser({ username: nombre, password: await createHash(password) })
        logger.info("success!");
        res.redirect('/login')
    }
});



app.get('/logout', (req, res) => {
    res.render('logout', { user: req.user.username })
    logger.info("Success!");
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: 'Logout ERROR', body: err })
        }
    })
}
)


// ----------------------------------------------------------


app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "views/partials"
}))

app.set("view engine", "hbs")
app.set("views", "./views")

// TODO: Descomentar para proximos desafios, se comenta para impedir multiples creaciones de db en clusters
productList.createDB()
    .then(() => productList.insertProducts())

app.get("/", isAuth, (req, res) => {
    const productos = productList.getAll()
    productos.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts, user: req.user.username })
    })
    logger.info("Success!");


});

// // DATOS DEMO DESDE FAKER
app.get('/api/productos-test', (req, res) => {
    const sampleProducts = productList.getSample()
    sampleProducts.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts })
        logger.info("Success!");
    })
        .catch(() => {
            loggerFile.error('Oops, that did not work!');
            logger.error('Oops, that did not work!')
        })

})

app.get("/:id", (req, res) => {

    const id = req.params.id

    const productos = productList.getById(id)
    productos.then(data => {
        let noProducts = true
        if (data.length != 0) {
            noProducts = false
        }
        res.render("main", { data: data, products: noProducts })
        logger.info("Success!");
    })
        .catch(() => {
            loggerFile.error('Oops, that did not work!');
            logger.error('Oops, that did not work!')
        })

});
// PROCESS AND CHILD ----------------------------------------------------------------------
app.get('/api/info', (req, res) => {
    let entryArgs = process.argv.join(',')
    let processId = process.pid;
    let nodeVersion = process.version;
    let platformName = process.platform;
    let memory = JSON.stringify(process.memoryUsage())
    let execPath = process.execPath
    let proyectFolder = process.cwd()
    let CPUs = numCPUs

    console.log({ args: entryArgs, name: platformName, node: nodeVersion, memory: memory, path: execPath, processId: processId, folder: proyectFolder, cpus: CPUs })

    res.render('info', { args: entryArgs, name: platformName, node: nodeVersion, memory: memory, path: execPath, processId: processId, folder: proyectFolder, cpus: CPUs })
    logger.info("Success!");

})

app.get('/api/randoms', (req, res) => {
    const child = fork('./randomNumbers.js')
    const cant = req.query.cant || 100000000

    child.send(cant)

    child.on('message', (numbers) => {
        res.send(numbers)
    })
    logger.info("Success!");


})

// SOCKET
const messages = new messagesMongoDb.MessagesMongoDb("messages", messagesSchema.messagesSchema)


const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io");

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado")

    socket.on('new-product', data => {
        productList.saveProduct(data)
        io.sockets.emit("products", productList)
    })

    //CHAT SECTION

    messages.getMessages()
        .then((mensajes) => socket.emit('messages', mensajes))
        .catch(() => {
            loggerFile.error('Oops, that did not work!');
            logger.error('Oops, that did not work!')
        })


    socket.on('new-message', data => {
        data.timestamp = moment().format("DD/MM/YYYY HH:mm:ss")
        messages.saveMessage(data)
            .then(() => {
                messages.getMessages()
                    .then((mensajes) => {
                        io.sockets.emit('messages', mensajes)
                    })
            })
            .catch(() => {
                loggerFile.error('Oops, that did not work!');
                logger.error('Oops, that did not work!')
            })
    })
})

const PORT = parseArgs(process.argv.slice(2), minimistOptions).port || 8080

const MODE = parseArgs(process.argv.slice(2), minimistOptions).mode || 'FORK'

if (MODE === 'CLUSTER' && cluster.isMaster) {

    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('listening', (worker, address) => {
        console.log(
            `Worker ${worker.process.pid} is listening in port ${address.port}`
        );
    });

} else {
    httpServer.listen(PORT, console.log(`Server listenting on PORT: ${PORT}`))
}

