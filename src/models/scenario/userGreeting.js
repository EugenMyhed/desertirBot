'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'

import Scenario from '../scenarioFather'

const userGreeting = new Scenario('userGreeting')
import view from './userGreetingL'

userGreeting.setSteps([{
    'reaction': reaction1,
    'dataChannel': ['start'],
    'interrupts': { 'all': interruption }
}])

async function reaction1(ctx) {
    await ctx.reply(view.greetingText, view.mainKeyboard)
}

async function interuption(ctx) {
    logger.error(`Interruption happened`)
}
export default userGreeting
