const http = require('http');
const moment = require('moment');

const server = http.createServer((peticion, respuesta) => {
    respuesta.end('hola mundo')
})

const connectedServer = server.listen (8080, () => {
    const horaActual = moment().format('HH');
    let message;
        if( horaActual >= 6 && horaActual <= 12){
            message = "Buenos Dias!"
        }else if( horaActual >= 13 && horaActual <= 19 ){
            message = "Buenas Tardes"
        }else
        message = "Buenas Noches"
    console.log(
        `${message} - Servidor Http escuchando en el puerto ${connectedServer.address().port}`
    )
})