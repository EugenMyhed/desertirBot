'use strict'

import logger from './logger'

import componentList, { findComponent } from './scenario/scenarioList'

async function startAction(channel, ctx, next) {
    await findComponent('userGreeting')
        .control(channel, ctx, next)
}
async function noAction(ctx, next) {}
export default async function (channel, ctx, next) {
    logger.debug(`In launcher ${channel}`)
    switch (channel) {
    case 'channel_post':
        noAction(ctx, next)
        break;
    case 'start':
        await startAction(channel, ctx, next)
        break;
    case 'command':
        noAction(ctx, next)
        break;
    case 'callback_query':
        noAction(ctx, next)
        break;
    case 'text':
        noAction(ctx, next)
        break;
    case 'message':
        noAction(ctx, next)
        break;
    case 'inline_query':
        noAction(ctx, next)
        break;
    }

}
