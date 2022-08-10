// EJERCICIO 1

const randomPixel = () => {
   const px = Math.floor(Math.random()*256)
   return px
}

let randomColor = `rgb(${randomPixel()}, ${randomPixel()}, ${randomPixel()})`;

console.log(randomColor)