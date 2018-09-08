'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'
import Scenario from '../scenarioFather'

import { setUser } from '../db/dbController'

//class construction
const shareWall = new Scenario('shareWall')

shareWall.setSteps([{
    'reaction': reaction1,
    'dataChannel': ['text'],
    'interrupts': { 'all': interuption }
}])

//--------------------
//function declaration

async function reaction1(ctx) {
    return new Promise(async (res, rej) => {
        ctx.reply(Text.shareMyWall, keyboard.shareMyWall(ctx.session.options.user_id))
        res()
    })
}

async function interuption(ctx) {
    return new Promise(async (res, rej) => {
        // ctx.reply(Text.noshareWall)
        res()
    })
}
export default shareWall
