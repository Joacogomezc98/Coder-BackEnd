const express = require('express');
const app = express()
const cookieParser =  require('cookie-parser');

app.post('/cookies', (req, res) => {
    const cookieName = req.name;
    const cookieValue = req.value;
    const expiration = req.expiration;

    const faltantes = []

    if(!cookieName) faltantes.push("cookieName")
    if(!cookieValue) faltantes.push("cookieValue")

    if(faltantes.length > 0) res.send({error: `faltaron ${faltantes.join(', ')}`})


    res.cookie(cookieName, cookieValue,expiration ? {maxAge: expiration} : null).send("Cookie post successful")
})

app.get('/cookies', (req,res) => {
    res.send(req.cookies)
})

app.delete('/cookies/:name', (req, res) => {
    const cookieName = req.params.name
    res.clearCookie(cookieName).send("Cookie cleared")
})

app.listen(3000, () => console.log("Server Running"))