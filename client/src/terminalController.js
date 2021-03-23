import ComponentesBuilder from "./components.js"
import {constants} from "./constants.js"

export default class TerminalController {
  #userCollors = new Map();

  constructor () {}

  #pickCollor(){
    return `#${((1<<24)*Math.random() | 0).toString(16)}-fg`
  }

  #getUserCollor(userName) {
    if(this.#userCollors.has(userName)){
      return this.#userCollors.get(userName)
    }

    const collor = this.#pickCollor()
    this.#userCollors.set(userName, collor)

    return collor
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  #onMessageReceived({screen, chat}){
    return msg => {
      const {username, message}= msg
      const collor = this.#getUserCollor(username)
      chat.addItem(`{${collor}}{bold}${username}{/}{/}: ${message}`)
      screen.render()
    }
  }

  #onLogChange({screen, activityLog}){
    return msg => {

      const [userName] = msg.split(/\s/)
      const collor = this.#getUserCollor(userName)
      activityLog.addItem(`{${collor}}{bold}${msg}{/}{/}`)

      screen.render()
    }
  }

  #onStatusChange({screen, status}){
    return users => {
      const { content } = status.items.shift()
      status.clearItems()
      status.addItem(content)

      users.forEach(userName => {
        const collor = this.#getUserCollor(userName)
        status.addItem(`{${collor}}{bold}${userName}{/}{/}`)
      })

      screen.render()
    }
  }

  #registerEvents(eventEmitter, components){
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
    eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChange(components))
    eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChange(components))

  }

  async initializeTable(eventEmitter){
    console.log('init')
    const components = new ComponentesBuilder()
      .setScreen({title: 'HackerChat - Arthur Santos'})
      .seyLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponents()
      .setStatusComponents()
      .setActivityLogComponents()
      .build()

    this.#registerEvents(eventEmitter, components)
    components.input.focus()
    components.screen.render()

    setInterval(() => {
      const users = [];
      eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, "tester1 join")
      users.push("tester1")
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, "tester2 join")
      users.push("tester2")
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, "tester3 join")
      users.push("tester3")
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {username:"tester1", message:"hello world!!"})
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {username:"tester2", message:"hello world!!"})
      eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, "tester1 left")
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {username:"tester3", message:"hello world!!"})
    }, 1000)
  }
}