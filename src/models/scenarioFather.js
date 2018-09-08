'use strict'

import instrumentHolder from './instrumentHolder'
import logger from './logger';
class Scenarion extends instrumentHolder {
    constructor(name, ctx) {
        super()
        this.name = name
    }
    launchStep(ctx) {
        ctx.session[this.name] = ctx.session[this.name] || 0
        this.step = ctx.session[this.name]
    }
    setSteps(steps) {
        this.steps = steps
    }
    addStep(step) {
        this.steps.push(step)
    }
    //---
    makeStep(dataChannel, ctx, next, step) {
        this.step = step
        ctx.session[this.name] = step
        this.control(dataChannel, ctx, next)
    }
    nextStep(ctx) {
        this.step++;
        ctx.session[this.name] = this.step
        // logger.debug(`Session scenario: ${ctx.session[this.name]} and ${this.step}`)
        if (this.step == this.steps.length)
            this.killScenario(ctx)
    }
    killScenario(ctx) {
        ctx.session.scenario = null
    }
    start(dataChannel, ctx, next) {
        logger.info(`${this.name} started!!!!`)
        this.makeStep(dataChannel, ctx, next, 0)
    }
    async control(dataChannel, ctx, next) {
        return new Promise(async (res, rej) => {
            if (!dataChannel || !ctx || !next)
                logger.error(`Scenario Error: options do not complete`)
            ctx.session.scenario = this.name
            logger.debug(`Session scenario: ${ctx.session.scenario}`)
            //logger.debug(`${dataChannel}`)
            //logger.debug(`${this.name}`)
            let properReaction = null
            const current_step = this.steps[this.step]
            //logger.debug(`Current step: ${this.step}`)
            current_step.dataChannel.forEach(channel => {
                if (channel == dataChannel)
                    properReaction = current_step.reaction
            })
            // logger.debug(typeof properReaction)
            if (properReaction) {
                logger.debug(`Find reaction`)
                await properReaction(ctx, next)
                //logger.debug(`Reacted`)
                this.nextStep(ctx)
                //logger.debug(`stepted`)
            } else {
                logger.debug(`Find interruption`)
                let properInteruuption = null
                if (current_step.interrupts[dataChannel]) {
                    await current_step.interrupts[dataChannel](ctx, next)
                } else if (current_step.interrupts.all)
                    await current_step.interrupts.all(ctx, next)
            }
            res()
        })
    }
}
export default Scenarion
