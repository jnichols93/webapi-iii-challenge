// code away!
const server = require('./server')

const port = 5000

server.listen(port, () => {
    console.log(`=== Listening on localhost:${port} ===`)
})