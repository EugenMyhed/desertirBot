'use strict'
import Telegraf from 'telegraf'

import LocalSession from 'telegraf-session-local'
import session from 'telegraf/session'
import logger from './models/logger'
import { TOKEN } from './config/config'

import scenarioController from './models/scenarioController'

require('babel-core/register')
require('babel-polyfill')

const bot = new Telegraf(TOKEN, { channelMode: true })

bot.use((new LocalSession({
        database: 'session.json',
        storage: LocalSession.storageFileAsync
    }))
    .middleware())

bot.telegram.getMe()
    .then(botInformation => {
        bot.options.botUsername = botInformation.username
        logger.debug('Server has initialized bot. Nick: ' + botInformation.username)
    })

bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    logger.info('Response time %sms', ms)
})

scenarioController(bot)

bot.catch(err => {
    logger.error(`Error in bot Middleware: ${err}`)
})

bot.startPolling()
