'use strict'


import keyboard from './botLook/keyboard'
import Text from './botLook/messageText'

//-------------
//Scenario zone
import userGreeting_SC from './scenario/userGreeting'
import wallCreation_SC from './scenario/wallCreation'
import startAbout_SC from './scenario/startAbout'
import channelSet_SC from './scenario/channelSet'
import postCreation_SC from './scenario/postCreation'
import feedback_SC from './scenario/feedback'
import shareWall_SC from './scenario/shareWall'

import logger from './logger'

import { getUser, setUser, setChannel } from './db/dbController'

export default function (bot) {
    bot.start(async (ctx, next) => {
        if (await destributeScenario('start', ctx, next)) {
            //logger.debug(1)
        } else {
            startHandler(ctx, next)
        }
    })
    // bot.use(ctx => {
    //     logger.debug(`${JSON.stringify(ctx.message)}`)
    // })
    bot.on('callback_query', async function (ctx, next) {
        if (!await destributeScenario('callback_query', ctx, next)) {
            // ctx.session.mes_1 = 'hui'
            callback_queryHandler(ctx, next)
        }
    })
    bot.on('text', async (ctx, next) => {
        logger.debug(`${JSON.stringify(ctx.message)}`)
        if (!await destributeScenario('text', ctx, next)) {
            if (ctx.message.text == Text.createPost_key) {
                // logger.debug(`In text channel`)
                await postCreation_SC.start('text', ctx, next)
            } else if (ctx.message.text == Text.mainKeyboard) {
                await feedback_SC.start('text', ctx, next)
            } else if (ctx.message.text == Text.share_key) {
                await shareWall_SC.start('text', ctx, next)
            }
        }
    })
    bot.on('message', async (ctx, next) => {
        await destributeScenario('message', ctx, next)
        // logger.debug(`${JSON.stringify(ctx.message)}`)
    })

    bot.on('channel_post', async (ctx, next) => {
        const post = ctx.channelPost
        if (post.text.split(Text.createChannelCommandIndexOf)[1]) {
            //logger.debug(`User id: ${post.text.split(Text.createChannelCommandIndexOf)[1]}`)
            channelSet_SC.start(ctx, next)
        }
    })
    bot.on('inline_query', async (ctx, next) => {
        const { inlineQuery, answerInlineQuery } = ctx
        // logger.debug(JSON.stringify(inlineQuery))
        if (!await destributeScenario('inline_query', ctx, next)) {
            if (inlineQuery.query.indexOf(Text.shareMyWall_c) != -1) {
                return answerInlineQuery([{
                    type: 'article',
                    id: 0,
                    title: 'Поделиться',
                    description: '',
                    input_message_content: {
                        message_text: 'Всем привет, вот моя стена, подпишитесь что бы ничего не пропустить',
                        parse_mode: 'HTML',
                        disable_web_page_preview: false
                    },
                    reply_markup: keyboard.inlineShareKeyboard(inlineQuery.query.split(Text.shareMyWall_c)[1])
                }])
            }
        }
    })
}

//-------------------
//dataChannel handler
async function callback_queryHandler(ctx, next) {
    //logger.debug(`inCallbackData`)
    const query = ctx.callbackQuery
    switch (query.data) {
    case 'createWall':
        ctx.session.message = 'huy'
        wallCreation_SC.start('callback_query', ctx, next)
        break
    case 'sendMore':
        postCreation_SC.start('callback_query', ctx, next)
        break
    default:
        ctx.answerCbQuery(Text.nowCallbackData)
    }
}

function preSession(ctx) {
    return new Promise(async (res, rej) => {
        if (ctx.session) {
            const wall = await getUser(ctx.chat ? ctx.chat.id : ctx.inlineQuery.from.id)
                .catch(err => errInRunway(ctx, err)) || {}
            // logger.debug(`${wall}`)
            setOptions(ctx, wall)
            // logger.debug(`${JSON.stringify(ctx.session.options)}`)
            ctx.session.scenario = ctx.session.scenario || 'empty'
            ctx.session.options = ctx.session.options || {}
            ctx.session.feedback_id = ctx.session.feedback_id || '-1001253958588'
            //scenario launch sessopn object
            userGreeting_SC.launchStep(ctx)
            wallCreation_SC.launchStep(ctx)
            startAbout_SC.launchStep(ctx)
            postCreation_SC.launchStep(ctx)
            feedback_SC.launchStep(ctx)
            shareWall_SC.launchStep(ctx)
            ctx.session.preSession = true
        }
        res()
    })
}
async function startHandler(ctx, next) {
    logger.debug(`inStart ${ctx.session.scenario}`)
    const mes = ctx.message
    //session evaluation
    const wall = await getUser(mes.chat.id)
        .catch(err => errInRunway(ctx, err)) || {}
    setOptions(ctx, wall)
    //------------------
    // logger.debug(`Option fullness ${getOptionFullness(wall)} !`)
    switch (getOptionFullness(wall)) {
    case 0:
        await userGreeting_SC.start('start', ctx, next)
        break
    case 1:
        await wallCreation_SC.start('start', ctx, next)
        break
    case 2:
        await ctx.reply('Пожалуйста выберите канал который станет вашей стеной', keyboard.chooseChannel(wall.user_id))
        break
    case 3:
        ctx.reply(Text.greetingFullness3, keyboard.userKeyboard)
        break
    default:
        next()
        break
    }
}
//----------------
async function destributeScenario(dataChannel, ctx, next) {
    return new Promise(async (res, rej) => {
        if (!ctx.session.preSession) await preSession(ctx)
        logger.debug(`inDistributer ${ctx.session.scenario}`)
        switch (ctx.session.scenario) {
        case 'userGreeting':
            await userGreeting_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'wallCreation':
            await wallCreation_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'postCreation':
            await postCreation_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'userFeedback':
            await userFeedback_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'shareRobot':
            await shareRobot_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'wallSet':
            await wallSet_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'feedback':
            await feedback_SC.control(dataChannel, ctx, next)
            res(true)
            break
        case 'shareWall':
            await shareWall_SC.control(dataChannel, ctx, next)
            res(true)
            break
        default:
            res(false)
        }
    })
}
//helping functions

//this function handle all scenario

function errInRunway(ctx, err) {
    ctx.reply(Text.err)
    //log about user and err type
}

function getOptionFullness(options) {
    // logger.debug(options)
    if (options.chat_id && options.user_id && options.username && options.channel_id) return 3
    else if (options.chat_id && options.user_id && options.username) return 2
    else if (options.chat_id && options.user_id) return 1
    else return 0
}

function setOptions(ctx, wall) {
    //wall.id = ''
    ctx.session.options = wall
}
