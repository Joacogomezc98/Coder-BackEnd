import { createTransport } from "nodemailer";

const TEST_MAIL = 'joacogomezc@gmail.com'

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'rmsafoezvdxwcher'
    },
});


const mailOptions = {
    from: TEST_MAIL,
    to: 'joacogomezc@gmail.com',
    subject: 'mail de prueba',
    html: '<h1>Contenido de prueba</h1>'
}

try {
    const info = await transporter.sendMail(mailOptions);
} catch(err) {
    console.log(err)
}