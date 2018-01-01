'use strict'
const moment = require('moment')
const fs = require('fs')

const mailService = require('./mail-service')()
const notification = require('./notification-service')

let receiver = 'codebugsolved@gmail.com'
const queue = []
const permanentStore = []

function init () {
  hydrate()
  listenOnNotificatioinEvents()
}

function processMailsFromTimeline (timeline) {
  timeline.forEach(mail => {
    mail.date = moment(mail.date).valueOf()
    mail.to = mail.to ? mail.to : receiver
    queue.push(mail)
    permanentStore.push(mail)
  })
  scheduleMails()
}

function scheduleMails () {
  while (queue.length) {
    const mail = queue.shift()
    const currentTime = Date.now()
    if (currentTime > mail.date) {
      mail.failReason = 'Time passed'
      notification.eventBus.fire('mailFailed', mail)
      continue
    }

    setTimeout(() => {
      mailService.send(mail)
    }, mail.date - currentTime)
  }
}

function setDefaultReciever (email) {
  receiver = email
}

function hydrate () {
  try {
    const mails = JSON.parse(fs.readFileSync('data.txt', 'utf8'))
    if (mails) {
      mails.forEach(mail => queue.push(mail))
      scheduleMails()
      console.log('data hydrated')
    }
  } catch (error) {}
}

function hibernate () {
  fs.writeFileSync('data.txt', JSON.stringify(permanentStore))
  console.log('data hibernated')
  process.exit(0)
}

function listenOnNotificatioinEvents () {
  notification.eventBus.on('mailSent', mail => {
    dequeue(mail)
  })
}

function dequeue (mail) {
  let index = permanentStore.indexOf(mail)
  if (index !== -1) {
    permanentStore.splice(index, 1)
  }
}

function getStore () {
  return permanentStore
}

function getReceiver () {
  return receiver
}

module.exports = () => {
  init()

  return {
    processMailsFromTimeline: processMailsFromTimeline,
    setDefaultReciever: setDefaultReciever,
    hibernate: hibernate,
    testObject: {
      getStore: getStore,
      getReceiver: getReceiver,
      processMailsFromTimeline: processMailsFromTimeline,
      sheduleMails: scheduleMails,
      setDefaultReciever: setDefaultReciever,
      dequeue: dequeue
    }
  }
}
