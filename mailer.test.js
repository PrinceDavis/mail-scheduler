'use strict'

require('dotenv').config()

const mailer = require('./mailer')().testObject

describe('processMailsFromTimeline', () => {
  test('It populate queue', () => {
    mailer.processMailsFromTimeline(
      [{content: 'hello Joshua', date: '2017-12-31T14:11:01.264Z', to: 'josh@generationenterprise.org'}, {content: 'hello tg', date: '2017-12-31T14:12:01.264Z', to: 'codebugsolved@gmail.com'}]
    )
    expect(mailer.getStore().length).toBe(2)
  })
})

describe('scheduleMails', () => {
  test('it calls setTimeOut When given future date', () => {
    jest.useFakeTimers()

    mailer.processMailsFromTimeline(
      [{content: 'hello Joshua', date: '2018-01-01T01:56:53.250Z', to: 'josh@generationenterprise.org'}, {content: 'hello tg', date: '2018-01-01T01:57:53.250Z', to: 'codebugsolved@gmail.com'}]
    )
    expect(setTimeout).toHaveBeenCalledTimes(2)
  })

  test('it Does not calls setTimeOut When given a past date', () => {
    jest.useFakeTimers()

    mailer.processMailsFromTimeline(
      [{content: 'hello Joshua', date: '2017-12-31T14:11:01.264Z', to: 'josh@generationenterprise.org'}, {content: 'hello tg', date: '2017-12-31T14:12:01.264Z', to: 'codebugsolved@gmail.com'}]
    )
    expect(setTimeout).toHaveBeenCalledTimes(0)
  })
})

describe('setDefaultReciever', () => {
  test('It updates receiver mail address', () => {
    mailer.setDefaultReciever('pam@gmail.com')
    expect(mailer.getReceiver()).toBe('pam@gmail.com')
  })
})

describe('dequeue', () => {
  test('It updates receiver mail address', () => {
    mailer.processMailsFromTimeline(
      [{content: 'hello Joshua', date: '2017-12-31T14:11:01.264Z', to: 'josh@generationenterprise.org'}, {content: 'hello tg', date: '2017-12-31T14:12:01.264Z', to: 'codebugsolved@gmail.com'}]
    )
    mailer.dequeue(mailer.getStore()[0])

    expect(mailer.getStore().length).toBe(5)
  })
})
