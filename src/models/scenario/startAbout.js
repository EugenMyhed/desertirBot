'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'

import Scenario from '../scenarioFather'
//class construction
const startAbout = new Scenario('startAbout')

const lazyInterrupts = {
    'all': interuption
}

startAbout.setSteps([{
    'reaction': reaction1,
    'dataChannel': ['callback_query'],
    'interrupts': lazyInterrupts
}])

//--------------------
//function declaration

async function reaction1(ctx) {
    return new Promise(async (res, rej) => {
        ctx.answerCbQuery()
        //await startAbout.asyncAnswer(ctx, Text.startAbout)
        ctx.reply('about')
        res()
    })
}

async function interuption(ctx) {
    return new Promise(async (res, rej) => {
        res()
    })
}
export default startAbout
