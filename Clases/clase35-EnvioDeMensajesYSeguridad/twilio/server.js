const accountSid = 'AC80da446cc81a8c79a34de6fbb737444e'
const authToken = 'c8603ce3e361706042e1c09f00d03df1'
const client = require("twilio")(accountSid, authToken)

client.messages.create({
    body: 'HOLA!!!',
    from: "whatsapp:+14155238886",
    to: "whatsapp:+5491167357319"
})
.then((message) => console.log(message.sid))
.done()