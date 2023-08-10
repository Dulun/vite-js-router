class EventEmitter {
  constructor() {
    this.list = {}
  }
  on(name, cb) {
    if (this.list[name]) {
      this.list[name].push(cb)
    } else {
      this.list[name] = [cb]
    }
  }
  emit(name, ...args) {
    let _this = this
    if (!this.list[name]) return false
    this.list[name].forEach((fn) => {
      fn.apply(_this, args)
    })

    return true
  }
  off(name, fn) {
    if (!this.list[name]) return false
    for (let i = 0; i < this.list[name].length; i++) {
      if (this.list[name][i] == fn) {
        this.list[name].splice(i, 1)
      }
    }
    return true
  }
}
const EventEmitterInstance = new EventEmitter()

export { EventEmitterInstance }
export default EventEmitterInstance
