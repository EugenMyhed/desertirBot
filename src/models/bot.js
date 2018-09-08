'use strict'

import {
    Session
} from 'inspector'

import Stage from 'telegraf/stage'
import Scene from 'telegraf/scenes/base'
const {
    leave
} = Stage

import MessageText from './botLook/messageText'
import Keyboard from './botLook/keyboard'
import {
    getChatId
} from './feedback'
import logger from './logger'
import {
    getUser,
    setUser,
    setChannel
} from './db/dbController'
import {
    asyncAnswer
} from './instrumentHolder'
import user from './db/user';

const Text = new MessageText()
const keyboard = new Keyboard()

let fireCount = 0
export default function (bot) {

    bot.start(async (ctx, next) => {

        const top = ctx.message
        if (ctx.session.state) next() //Контроллер состояний
        const wall = await getUser(top.chat.id)
        if (wall.channel_id) {
            ctx.session.options = wall
            ctx.reply(Text.greetingUser(top.from.username), keyboard.mainKeyboard)
        } else {
            ctx.reply(Text.startInstruction, keyboard.createWall)
        }
    })

    bot.on('callback_query', async (ctx, next) => {
        const top = ctx.callbackQuery
        //logger.debug(JSON.stringify(top.message))
        if (top.data == 'createWall' && !ctx.session.state) {
            ctx.session.state = 'chooseUsername'
            ctx.answerCbQuery()
            ctx.reply(Text.chooseUsername, keyboard.chooseUsername)
        } else if (top.data == 'nextUsername' && ctx.session.state == 'chooseUsername') {
            await setUsernameInterface(ctx, top.message.chat.id, top.message.from.id, top.from.username)
            ctx.answerCbQuery()
        } else if (top.data == 'postIt') {
            if (ctx.session.state == 'createPost') {}
        } else {
            ctx.answerCbQuery()
            next()
        }
    })
    bot.on('message', (ctx, next) => {
        if (ctx.session.state == 'createPost')
            contentRecognition(ctx, next)
        else next()

    })
    bot.on('text', async (ctx, next) => {
        const top = ctx.message
        if (ctx.session.state == 'chooseUsername') {
            await setUsernameInterface(ctx, top.chat.id, top.from.id, top.text)
        } else if (top.text == Text.createPost_key) {
            ctx.session.state = 'createPost'
            ctx.reply(Text._createPost)
        } else next()

        logger.info(JSON.stringify(top))
    })
    bot.on('channel_post', async (ctx, next) => {
        if (ctx.channelPost) {
            await createChannelInterface(ctx)
        } else next() //you are doing some sheet
    })

}
async function setUsernameInterface(ctx, chat_id, user_id, username) {
    return new Promise(async (res, rej) => {
        await setUser(ctx, chat_id, user_id, username)
            .catch(err => rej(err))
        ctx.session.options = {}
        ctx.session.options.username = username
        ctx.session.options.chat = chat_id
        ctx.session.options.user = user_id
        await asyncAnswer(ctx, Text.setChannelArray(username))
            .catch(err => rej(err))
        ctx.session.state = ''
        ctx.reply('text', keyboard.chooseChannel(user_id))
        res()
    })
}

async function createChannelInterface(ctx) {
    logger.info('here')
    const top = ctx.channelPost
    if (top.text.split(Text.createChannelCommandIndexOf)[1]) {
        const user_id = top.text.split(Text.createChannelCommandIndexOf)[1]
        logger.debug(user_id)
        const data = await setChannel(user_id, ctx.chat.id)
        logger.info(data)
        if (data && data != 1) {
            ctx.reply(Text.afterChannelSetChannel)
            ctx.telegram.sendMessage(data.chat_id, Text.afterChannelSetBot)
        } else ctx.reply(Text.createChannelInvalid)
    } else {
        ctx.reply(Text.missunderstanding)
    }
}

function contentRecognition(ctx, next) {
    const top = ctx.message
    if (top.photo) { //caption
        postPhoto(ctx)
        //ctx.reply('Its photo')
    } else if (top.text) {
        ctx.reply('its text')
    } else if (top.voice) {
        ctx.reply(Text.createPost_forbid) //ctx.reply('its voice')
    } else if (top.video_note) {
        ctx.reply(Text.createPost_forbid) //ctx.reply('Its video note')
    } else if (top.document) {
        ctx.reply(Text.createPost_forbid) //ctx.reply('its document')
    } else next()
}

function postPhoto(ctx) {
    ctx.reply('готовы запостить?', keyboard._readyToPost)
}
