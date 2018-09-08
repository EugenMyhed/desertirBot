'use strict'

import logger from './logger'

//-------------
//Scenario zone
import userGreeting_SC from './scenario/userGreeting'

import { getUser, setUser, setChannel } from './db/dbController'

export default function (bot) {
    bot.start(async (ctx, next) => {
        await distributeScenario('start', ctx, next)
    })

    bot.on('callback_query', async function (ctx, next) {
        await distributeScenario('callback_query', ctx, next)
    })
    bot.on('text', async (ctx, next) => {
        await distributeScenario('text', ctx, next)
    })
    bot.on('message', async (ctx, next) => {
        await distributeScenario('message', ctx, next)
    })

    bot.on('channel_post', async (ctx, next) => {
        await distributeScenario('message', ctx, next)
    })
    bot.on('inline_query', async (ctx, next) => {
        await distributeScenario('message', ctx, next)
    })
}
async function distributeScenario(dataChannel, ctx, next) {
    return new Promise(async (res, rej) => {
        if (!ctx.session.preSession) await preSession(ctx)
        logger.debug(`inDistributer ${ctx.session.scenario}`)
        switch (ctx.session.scenario) {
        case 'userGreeting':
            await userGreeting_SC.control(dataChannel, ctx, next)
            res(true)
            break
        }
    })
}
