'use strict'
require('dotenv').config()
const readline = require('readline2')
const mailer = require('./mailer')()
const notification = require('./notification-service')

// create stream from stdin
const stream = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

// get mails and settings from user
stream.on('line', function (line) {
  try {
    const input = JSON.parse(line)
    if (Array.isArray(input)) {
      mailer.processMailsFromTimeline(input)
      console.log('Mail scheduling complete')
    }else if (input.hasOwnProperty('to')) {
      mailer.setDefaultReciever(input.to)
      console.log(`default receiver set to: ${input.to}`)
    }else {
      throw new Error('Wrong format')
    }
  } catch (err) {
    console.log(err.message)
    console.log('input not of the right format, see right format below:')
    console.log('To set default receiver: {"to": "email"}')
    console.log('To send timeline example: [{"content": "hello Joshua", "date": "2017-12-31T14:11:01.264Z", "to": "josh@generationenterprise.org"}, {"content": "hello tg", "date": "2018-01-01T02:17:29.254Z", "to": "codebugsolved@gmail.com"}]')
  }
})

// process failed mails due time elapsing
notification.eventBus.on('mailFailed', mail => {
  console.log(`Sending ${mail.content} to ${mail.to} failed: ${mail.failReason}`)
})

// process failed mails due to error 
notification.eventBus.on('mailError', data => {
  console.log(`Sending ${data.mail.content} to ${data.mail.to} failed: ${mail.err.message}`)
})

// process sent mails
notification.eventBus.on('mailSent', mail => {
  console.log(`${mail.content} successfully sent to ${mail.to}`)
})

// save mails on accidental shutdown
process.on('SIGINT', mailer.hibernate)
