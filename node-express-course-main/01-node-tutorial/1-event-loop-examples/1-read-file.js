// allows for async reading of files!
const { readFile, writeFile } = require('fs')

console.log('started a first task')
// CHECK FILE PATH!!!!
readFile('./content/first.txt', 'utf8', (err, result) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(result)
  console.log('completed first task')
})

// this code will be printed first since it is non-blocking!
console.log('starting next task')
