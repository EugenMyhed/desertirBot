'use strict'

import Markup from 'telegraf/markup'
import Extra from 'telegraf/extra'

class View {
    get greetingText() {
        return 'Привет новый пользователь)'
    }
    get mainKeyboard() {
        return Markup.keyboard([
                ['Добавить канал']
            ])
            .oneTime()
            .resize()
            .extra()
    }
}
export default new View()
