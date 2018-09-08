'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'
import Scenario from '../scenarioFather'

import { setUser } from '../db/dbController'

//class construction
const postCreation = new Scenario('postCreation')

postCreation.setSteps([{
        'reaction': reaction1,
        'dataChannel': ['text', 'callback_query'],
        'interrupts': { 'all': interuption1 }
    },
    {
        'reaction': reaction2,
        'dataChannel': ['message', 'text'],
        'interrupts': { 'all': interuption2 }
    }
])

//--------------------
//function declaration

async function reaction1(ctx) {
    return new Promise(async (res, rej) => {
        logger.debug(`Inside r1`)
        if (ctx.callbackQuery) ctx.answerCbQuery()
        ctx.reply(Text._createPost)
        res()
    })
}
async function reaction2(ctx) {
    return new Promise(async (res, rej) => {
        logger.debug(`Inside r2`)
        let top = Object.assign(ctx.message)
        if (top.reply_to_message) {
            top = top.reply_to_message
        }
        if (top.photo) {
            await postPhoto(ctx)
            //ctx.reply('Its photo')
        } else if (top.voice) {
            await ctx.reply(Text.createPost_forbid) //ctx.reply('its voice')
        } else if (top.video_note) {
            await ctx.reply(Text.createPost_forbid) //ctx.reply('Its video note')
        } else if (top.document) {
            await ctx.reply(Text.createPost_forbid) //ctx.reply('its document')
        } else if (top.text) {
            // logger.debug(`its text`)
            await postText(ctx)
            //ctx.reply('its text')
        } else next()
        res()
    })
}

async function interuption1(ctx) {
    return new Promise(async (res, rej) => {
        debug.error('WTF!?!??!??!')
        res()
    })
}
async function interuption2(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.createPost_forbid)
        res()
    })
}

function errInRunway(ctx, err, res) {
    ctx.reply(Text.err)
    res()
    //log about user and err type
}

export default postCreation

async function postPhoto(ctx) {
    //photo caption
    logger.debug(`${JSON.stringify(ctx.message)}`)
    const photo = (ctx.message.reply_to_message ? ctx.message.reply_to_message.photo : ctx.message.photo)
        .slice(-1)
        .pop()
    const caption = (ctx.message.reply_to_message || ctx.message.forward_from) ? ctx.message.text : ctx.message.caption || ''
    logger.debug(JSON.stringify(ctx.message))
    await ctx.telegram.sendPhoto(ctx.session.options.channel_id, photo.file_id, {
        caption: caption,
        reply_markup: keyboard.inline_post_key
    })
    afterPost(ctx)
}
async function postText(ctx) {
    // logger.debug(`${ctx.session.options.channel_id}`)
    await ctx.telegram.sendMessage(ctx.session.options.channel_id, ctx.message.text, keyboard.post_key)
    afterPost(ctx)
}
async function afterPost(ctx) {
    ctx.reply(Text.afterSend, keyboard.afterSend)
}
