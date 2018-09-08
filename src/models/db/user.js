'use strict'

import mongoose from 'mongoose'

const dataSchema = mongoose.Schema({
    chat_id: Number,
    user_id: Number,
    username: String,
    actionDate: String,
    actionType: String
})

export default mongoose.model('users', dataSchema)
