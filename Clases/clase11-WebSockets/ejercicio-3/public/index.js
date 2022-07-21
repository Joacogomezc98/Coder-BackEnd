const socket = io()

const button = document.getElementById("btnSend")

const list = document.getElementById("msjList")


btnSend.addEventListener("click", () => {
  socket.emit("saveMessage", {
    socketID: socket.id, mensaje: inputText.value
  })
  inputText.value = ''
})


socket.on("msjList", data => {
  list. innerHTML = ''
  data.forEach( message => {
    list.innerHTML += `<p>SocketId: ${message.socketID} - ${message.mensaje}</p>`

  })
})

