'use strict'

import logger from './logger'
class Scenarion {
    constructor(name, ctx) {
        // super()
        this.name = name
    }
    get getName() {
        return this.name
    }
    setSteps(steps) {
        this.steps = steps
    }
    launchSession(ctx) {
        ctx.session[this.name] = ctx.session[this.name] || 0
    }
    async control(dataChannel, ctx, next) {
        if (!dataChannel || !ctx || !next)
            throw new Error(`Scenario Error: options do not complete`)
        ctx.session.scenario = this.name
        logger.debug(`Session scenario: ${ctx.session.scenario}`)
        //logger.debug(`${dataChannel}`)
        //logger.debug(`${this.name}`)
        const current_step = this.steps[ctx.session[this.name]]
        logger.debug(`Current step: ${ctx.session[this.name]}`)
        let acceptedChannel = current_step.dataChannel.find(channel => { return channel == dataChannel })
        if (acceptedChannel) {
            await current_step.reaction(ctx, next)
            await this.nextStep(ctx)
            logger.debug(`Reaction Made`)
            return true
        } else {
            if (current_step.interrupts[dataChannel])
                await current_step.interrupts[dataChannel](ctx, next)
            else if (current_step.interrupts.all)
                await current_step.interrupts.all(ctx, next)
            logger.debug(`Interruption Made`)
            return true
        }
    }
    makeStep(dataChannel, ctx, next, step) {
        ctx.session[this.name] = step
        this.control(dataChannel, ctx, next)
    }
    async nextStep(ctx) {
        ctx.session[this.name] = ctx.session[this.name] + 1
        // logger.debug(`Step made`)
        // logger.debug(`${ctx.session[this.name]}`)
        if (ctx.session[this.name] == this.steps.length)
            await this.killScenario(ctx)
    }
    killScenario(ctx) {
        logger.debug(`Scenario killing`)
        ctx.session.scenario = 'empty'
        ctx.session[this.name] = 0
    }
    start(dataChannel, ctx, next) {
        this.makeStep(dataChannel, ctx, next, 0)
    }
}
export default Scenarion
