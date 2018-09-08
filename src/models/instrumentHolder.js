'use strict'
import logger from './logger'
export default class {
    constructor() {

    }
    asyncAnswer(ctx, answerArray) {
        return new Promise(async (res, rej) => {
            const promiseArray = []
            answerArray.forEach((element, i) => {
                promiseArray.push(ctx.reply(element.text))
                if (i != answerArray.length - 1)
                    promiseArray.push(this.awaiter(element.time))
            })
            Promise.all(promiseArray)
                .then(data => res())
                .catch(err => rej(err))
        })
    }
    awaiter(time) {
        return new Promise((resolve) => {
            setTimeout(() => resolve('дождались😛'), time)
        })
    }
    walk() {
        logger.debug(`walk`)
    }
}
