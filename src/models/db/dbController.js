'use strict'

import mongoose from 'mongoose'
import { databaseURl } from '../../config/config'

import User from './user'
import logger from '../logger'

mongoose.connect(databaseURl, {
    useNewUrlParser: true
})

const db = mongoose.connection

export async function setUser(ctx, chat_id, user_id, username) {
    return new Promise((res, rej) => {
        const insertionData = {
            chat_id: chat_id,
            user_id: user_id,
            username: username,
            creationDate: new Date()
        }
        User.collection.insertOne(insertionData)
            .then(data => {
                res(data)
            })
            .catch(err => {
                rej(err)
            })
    })
}

export async function getUser(chat_id) {
    return new Promise((res, rej) => {
        User.findOne({
                'chat_id': chat_id
            })
            .then(data => res(data))
            .catch(err => {
                rej(err)
            })
    })
}

export async function setChannel(user_id, channel_id) {
    return new Promise((res, rej) => {
        User.findOne({
                'user_id': user_id
            })
            .then(data => {
                //console.log(data)
                if (!data) res(false)
                else if (data.channel_id) res(1)
                else {
                    data.channel_id = channel_id
                    data.save()
                        .then(status => {
                            res(status)
                        })
                        .catch(err => {
                            rej(err)
                        })
                }
            })
    })
}
