'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'
import Scenario from '../scenarioFather'

import { setUser } from '../db/dbController'

//class construction
const wallCreation = new Scenario('wallCreation')

const lazyInterrupts = {
    'all': interuption
}
wallCreation.setSteps([{
        'reaction': reaction1,
        'dataChannel': ['callback_query'],
        'interrupts': lazyInterrupts
    },
    {
        'reaction': reaction2,
        'dataChannel': ['callback_query', 'text'],
        'interrupts': { 'all': interuption }
    }
])

//--------------------
//function declaration

function reaction1(ctx) {
    logger.debug('step 1')
    ctx.answerCbQuery()
    ctx.reply(Text.chooseUsername, keyboard.chooseUsername)
}
async function reaction2(ctx) {
    return new Promise(async (res, rej) => {
        logger.debug('step 2')
        // wallCreation.walk()
        if (ctx.callbackQuery) ctx.answerCbQuery()
        const { chat_id, user_id, username } = getDataByCtx(ctx)
        await setUser(ctx, chat_id, user_id, username)
        ctx.session.options = getDataByCtx(ctx)
        await wallCreation.asyncAnswer(ctx, Text.setChannelArray(username))
        ctx.reply('Канал', keyboard.chooseChannel(user_id))
        res()
    })
}

async function interuption(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.usernameWarning)
        res()
    })
}
//--------------

function errInRunway(ctx, err, res) {
    ctx.reply(Text.err)
    res()
    //log about user and err type
}

function getDataByCtx(ctx) {
    if (ctx.callbackQuery)
        return {
            chat_id: ctx.callbackQuery.message.chat.id,
            user_id: ctx.callbackQuery.message.from.id,
            username: ctx.from.username
        }
    else
        return {
            chat_id: ctx.message.chat.id,
            user_id: ctx.message.from.id,
            username: ctx.message.text
        }
}
export default wallCreation
