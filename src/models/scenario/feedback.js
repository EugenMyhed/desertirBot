'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'
import Scenario from '../scenarioFather'

import { setUser } from '../db/dbController'

//class construction
const feedback = new Scenario('feedback')

feedback.setSteps([{
        'reaction': reaction1,
        'dataChannel': ['text'],
        'interrupts': { 'all': interuption }
    },
    {
        'reaction': reaction2,
        'dataChannel': ['text'],
        'interrupts': { 'all': interuption }
    }
])

//--------------------
//function declaration

async function reaction1(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.feedbackInstinctivization, keyboard.emptyKeyboard)
        res()
    })
}
async function reaction2(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.afterFeedback, keyboard.userKeyboard)
        if (ctx.session.feedback_id && ctx.message.chat.id != ctx.session.feedback_id) {
            ctx.telegram.sendMessage(
                ctx.session.feedback_id,
                `Wallpaper from: @${ctx.message.chat.username} \n=>${ctx.message.text}`
            )
        }
        res()
    })
}

async function interuption(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.noFeedback)
        res()
    })
}
export default feedback
