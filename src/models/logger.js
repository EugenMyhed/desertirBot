'use strict'

import winston, { createLogger, format, transports } from 'winston'

const { combine, timestamp, label, printf } = format

const myFormat = printf(info => {
  return `${info.level}: ${info.message} ${info.timestamp}`
})

const logger = createLogger({
  format: combine(
    label({
      label: 'my Label'
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug'
    })
  ]
})

export default logger
