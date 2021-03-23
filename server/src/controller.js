export default class Controller {

  #users = new Map()

  constructor({sockerServer}){
    this.sockerServer = sockerServer
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection stablished with', id)
    const useData = { id, socket}
    this.#updateGlobalUserData(id, useData)

    socket.on('data', this.#onSocketData(id))
    socket.on('end', this.#onSocketClose(id))
    socket.on('error', this.#onSocketClose(id))
  }

  #onSocketData(id){
    return data => {
        console.log('onSocketData', data.toString())
    }
  }

  #onSocketClose(id){
    return data => {
        console.log('onSocketClose', data.toString())
    }
  }

  #updateGlobalUserData(socketId, userData) {
    const users = this.#users
    const user = users.get(socketId) ?? {}

    const updateUserData = {
      ...user,
      ...userData
    }

    users.set(socketId, updateUserData)
    return users.get(socketId)
  }
}