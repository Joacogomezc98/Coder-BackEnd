const socket = io.connect()

socket.on("products", products => {productList(products)})

const productList = (products) => {
    products.render("main", {data: datos, products: noProducts})
}

const addProduct = (product) => {
   const newProd = {
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail
    }
    socket.emit('new-product', newProd);
    return false
}

const render = (data) => {
    const html = data.map((elem) => {
        return(`<div>
            <strong>${elem.author}</strong>
            <em>${elem.time} - </em>
            <em>${elem.text}</em>
        </div>`)
    }).join(" ");
    document.getElementById("messages").innerHTML = html
}

socket.on("messages", data => {render(data)})


const addMessage = () => {
    const mensaje = {
        author: document.getElementById("mail").value,
        text: document.getElementById("text").value
    }
    socket.emit('new-message', mensaje);
    return false
}