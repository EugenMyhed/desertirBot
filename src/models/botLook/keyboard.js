'use strict'
import Markup from 'telegraf/markup'
import Extra from 'telegraf/extra'

import Text from './messageText'

class Keyboard {
    //#bottom
    get mainKeyboard() {
        return Markup.keyboard([
                [Text.mainKeyboard]
            ])
            .oneTime()
            .resize()
            .extra()
    }
    //#after message
    //#inline in query
}
export default new Keyboard()
