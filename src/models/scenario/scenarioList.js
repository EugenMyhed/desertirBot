'use strict'

import userGreeting from "./userGreeting"

const componentList = [
    userGreeting
]
export function findComponent(name) {
    return componentList.find(i => { return name === i.getName })
}
export default componentList
