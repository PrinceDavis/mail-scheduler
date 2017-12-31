'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  MAILGUN_DOMAIN: joi.string().required(),
  MAILGUN_SECRET: joi.string().required()
}).unknown().required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  MAILGUN_DOMAIN: envVars.MAILGUN_DOMAIN,
  MAILGUN_SECRET: envVars.MAILGUN_SECRET
}
module.exports = config
