'use strict'

import logger from '../logger'

import Scenario from '../scenarioFather'

import view from './userGreetingL'
const userGreeting = new Scenario('userGreeting')

userGreeting.setSteps([{
    'reaction': reaction,
    'dataChannel': ['start'],
    'interrupts': { 'all': interruption }
}])

async function reaction(ctx) {
    await ctx.reply(view.greetingText, view.mainKeyboard)
}

async function interruption(ctx) {
    logger.error(`Interruption happened`)
}

export default userGreeting
