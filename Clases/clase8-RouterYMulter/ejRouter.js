const express = requiere("express")
const { Router } = express

const app = express
const router = Router()

router.get('/recurso', (req,res) => {
    res.send('ok')
})

router.post('/recurso', (req, res) => {
    res.send('ok')
})

app.use('/api', router)

app.listen(8080)