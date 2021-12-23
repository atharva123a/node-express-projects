// started operating system process
console.log('first')
setTimeout(() => {
  console.log('second')
}, 0)

// again this would be first since it is synchronous!
console.log('third')
// completed and exited operating system process
