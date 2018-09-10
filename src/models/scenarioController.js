'use strict'

import logger from './logger'

import componentList, { findComponent } from './scenario/scenarioList'
import launcher from './launcher'

export default function (bot) {
    bot.start(async (ctx, next) => {
        switchAction('start', ctx, next)
    })
    bot.command(async (ctx, next) => {
        switchAction('command', ctx, next)
    })
    bot.on('callback_query', async function (ctx, next) {
        switchAction('callback_query', ctx, next)
    })
    bot.on('text', async (ctx, next) => {
        switchAction('text', ctx, next)
    })
    bot.on('message', async (ctx, next) => {
        switchAction('message', ctx, next)
    })

    bot.on('channel_post', async (ctx, next) => {
        switchAction('channel_post', ctx, next)
    })
    bot.on('inline_query', async (ctx, next) => {
        switchAction('inline_query', ctx, next)
    })
}
async function switchAction(channel, ctx, next) {
    if (!preSession) await makePreSession(ctx)
    if (!await distributeScenario(channel, ctx, next)) {
        await launcher(channel, ctx, next)
        logger.info(`launcher`)
    }
}

function distributeScenario(channel, ctx, next) {
    // logger.info(`d->${ctx.session.scenario}`)
    const component = componentList.find(component => {
        // logger.info(`${component.getName == ctx.session.scenario}`)
        return (component.getName === ctx.session.scenario)
    })
    // logger.info(`n-> ${component.name}`)
    return component ? component.control(channel, ctx, next) : component
}

function makePreSession(ctx) {
    logger.info(ctx.session.scenario)
    preSession = true
    ctx.session.scenario = ctx.session.scenario || 'empty'
    componentList.forEach(component => {
        component.launchSession(ctx)
    })
    logger.info(ctx.session.scenario)
    logger.debug(`Pre session made`)
}

let preSession = false
