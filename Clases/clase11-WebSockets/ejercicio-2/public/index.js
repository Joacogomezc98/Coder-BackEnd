const socket = io()

const inputText = document.getElementById("inputText")

const paragraph = document.getElementById("socketText")

inputText.addEventListener('keyup', e=> {
    socket.emit('inputText', e.target.value)
})

socket.on("newText", texto => {
  paragraph.innerText = texto
})

