'use strict'
const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const config = require('./config')
const notification = require('./notification-service')

const mailService = {
  init() {
    this.transporter = nodemailer.createTransport(mailgun({
      auth: {
        api_key: config.MAILGUN_SECRET,
        domain: config.MAILGUN_DOMAIN
      }
    }))
  },

  composeMailOption() {
    return {
      from: 'codebugsolved@gmail.com',
      to: '',
      subject: '',
      'h:Reply-To': 'codebugsolved@gmail.com',
      text: ''
    }
  },

  send(mail, subject = 'Mail Notification') {
    const mailOptions = this.composeMailOption()
    mailOptions.to = mail.to
    mailOptions.text = `${mail.content}`
    mailOptions.subject = subject
    this.transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return notification.eventBus.fire('mailError', {err, mail})
      }
      notification.eventBus.fire('mailSent', mail)
    })
  }
}

module.exports = () => {
  mailService.init()

  return {
    send: mailService.send.bind(mailService)
  }
}
