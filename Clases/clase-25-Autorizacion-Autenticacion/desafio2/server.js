/*============================[Modulos]============================*/
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import path from "path";
import bcrypt from 'bcrypt'

import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;

const app = express();

/*============================[Middlewares]============================*/

/*----------- Passport -----------*/
passport.use(new LocalStrategy(
    async (username, password, done)=>{
        //Logica para validar si un usuario existe
        const existeUsuario = usuariosDB.find(usuario => {
            return usuario.nombre == username;
        });

        console.log(existeUsuario)

        if (!existeUsuario) {
            console.log('Usuario no encontrado')
            return done(null, false);
        }

        if(await verificaPass(existeUsuario, password)){
            console.log('Contrase;a invalida')
            return done(null, false);
        }

        return done(null, existeUsuario);
    }
))

passport.serializeUser((usuario, done)=>{
    done(null, usuario.nombre);
})

passport.deserializeUser((nombre, done)=>{
    const usuario = usuariosDB.find(usuario => usuario.nombre == nombre);
    done(null, usuario);
});

/*----------- Session -----------*/
app.use(cookieParser());
app.use(session({
    secret: '1234567890!@#$%^&*()',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 20000 //20 seg
    }
}))

app.use(passport.initialize());
app.use(passport.session());

/*----------- Motor de plantillas -----------*/
app.set('views', path.join(path.dirname(''), './src/views') )
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

/* functions */
function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

/*----------- Autenticacion Metodos -----------*/
async function createHash(password) {
    const saltRounds = 10;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log(error)
    }
}

async function verificaPass(usuario, password) {
    const saltRounds = 10;
    console.log('old pass hash: ', usuario.password);
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        
        console.log('new pass hash: ',hash);
        bcrypt.compare(usuario.password, hash, function(err, result) {  // Compare
            // if passwords match
            if (result) {
                console.log("It matches!")
                return true;
            }
            // if passwords do not match
            else {
                console.log("Invalid password!");
                return false;
            }
        });

    } catch (error) {
        console.log(error)
    }
}

/*============================[Base de Datos]============================*/
const usuariosDB = [];

/*============================[Rutas]============================*/
app.get('/', (req, res)=>{
    if (req.session.nombre) {
        res.redirect('/datos')
    } else {
        res.redirect('/login')
    }
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/datos',
        failureRedirect: '/login-error'
    }
))

app.get('/login-error', (req, res)=>{
    res.render('login-error');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

app.post('/register', async (req, res)=>{
    const {nombre, password, direccion } = req.body;
    
    const newUsuario = usuariosDB.find(usuario => usuario.nombre == nombre);
    if (newUsuario) {
        res.render('register-error')
    } else {
        usuariosDB.push({nombre, password: await createHash(password), direccion});
        res.redirect('/login')
    }
});

app.get('/datos', isAuth, (req, res)=>{
    console.log('datos req.user: ', req.user);
    console.log('datos req.user: ', req.session.passport.user);

    if(!req.user.contador){
        req.user.contador = 1
    } else {
        req.user.contador++
    }
    const datosUsuario = {
        nombre: req.user.nombre,
        direccion: req.user.direccion
    }
    res.render('datos', {contador: req.user.contador, datos: datosUsuario});
});

app.get('/logout', (req, res)=>{
    req.user.contador = 0;
    req.logOut();
    res.redirect('/');
});

/*============================[Servidor]============================*/
const PORT = 4242;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});