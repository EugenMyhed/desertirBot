'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'

import Scenario from '../scenarioFather'
//class construction
const userGreeting = new Scenario('userGreeting')

const lazyInterrupts = {
    'all': interuption
}

userGreeting.setSteps([{
    'reaction': reaction1,
    'dataChannel': ['start'],
    'interrupts': lazyInterrupts
}])
//--------------------
//function declaration

async function reaction1(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.greetingInstruction1, keyboard.createWall)
        //ctx.reply(Text.greetingInstruction2, keyboard.about)
        res()
    })
}

async function interuption(ctx) {
    return new Promise(async (res, rej) => {
        res()
    })
}
export default userGreeting
