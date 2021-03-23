export default class SocketClient {
  #serverConnection = {}

  constructor({host, port, protocol}){
    this.host = host
    this.port = port
    this.protocol = protocol
  }

  async createConnection(){
    const options = {
      port: 9898,
      host: 'localhost',
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket'
      }
    }
  
    const http = await import(this.protocol)
    const req = http.request(options)
    req.end()

    return new Promise(resolve => {
      req.once('upgrade', (res, socket) => resolve(socket))
    })
  }

  async initialize () {
    this.#serverConnection = await this.createConnection()
    console.log("I've connected to the server")
  }
}

  
// req.on('upgrade', (req, socket) => {
//   socket.on('data', data => {
//     console.log('client received', data.toString())
//   })

//   setInterval(() => {
//     socket.write('Hello!')
//   }, 500)
// })