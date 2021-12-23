const http = require('http')

const server = http.createServer((req, res) => {
  console.log('request event')
  res.end('Hello World')
})

// the server listening is again a async function!
server.listen(5000, () => {
  console.log('Server listening on port : 5000....')
})
