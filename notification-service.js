'use strict'

const util = require('util')
const eventEmitter = require('events').EventEmitter

function Event () {
  eventEmitter.call(this)
}

util.inherits(Event, eventEmitter)

Event.prototype.fire = function (type, data) {
  this.emit(type, data)
}
const eventBus = new Event()
module.exports = {
  emitter: Event,
  eventBus: eventBus
}
