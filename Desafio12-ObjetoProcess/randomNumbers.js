let randomArray = []
let countNumbers = {}
process.on('message', (cant) => {
    let max = 1000;
    let min = 1;
    for(let i=0; i<cant; i++){
        randomArray.push(Math.floor(Math.random() * (max - min + 1) + min))
    }
    countNumbers = randomArray.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {})
    process.send(countNumbers)
})