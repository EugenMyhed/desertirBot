'use strict'

import logger from '../logger'

import keyboard from '../botLook/keyboard'
import Text from '../botLook/messageText'

import Scenario from '../scenarioFather'

import { setChannel } from '../db/dbController'
//class construction
class channelSet {
    async start(ctx, next) {
        const user_id = ctx.channelPost.text.split(Text.createChannelCommandIndexOf)[1]
        // logger.debug(user_id)
        const data = await setChannel(user_id, ctx.chat.id)
            .catch(err => errInRunway(ctx, err, res))
        logger.info(data)
        if (data && data != 1) {
            ctx.reply(Text.afterChannelSetChannel)
            ctx.telegram.sendMessage(data.chat_id, Text.afterChannelSetBot, keyboard.userKeyboard)
        } else ctx.reply(Text.createChannelInvalid)
    }
}

function errInRunway(ctx, err, res) {
    ctx.reply(Text.err)
    res()
    //log about user and err type
}
export default new channelSet()
