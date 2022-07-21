const express = require('express');
const app = express()
const cookieParser =  require('cookie-parser');

app.use(cookieParser('Hello'));

app.get('/set', (req, res) => {
    res.cookie('server', 'express').send('Cookie set');
});

app.get('/setEx', (req, res) =>{
    res.cookie('server2', 'express2',{maxAge: 20000 }).send('Cookie set EX')
})

app.get('/getCookies', (req,res) => {
    res.send(req.cookies)
})

app.get('/setSigned', (req, res) =>{
    res.cookie('server3', 'express3',{signed: true }).send('Signed cookie set')
})

app.get('/getSignedCookies', (req,res) => {
    res.send(req.signedCookies)
})

app.get('/deleteCookies', (req,res) => {
    res.clearCookie('server').send('Cookie Cleared')
})

app.listen(3000, () => console.log("Server Running"))