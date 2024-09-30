'use strict'

const amqp = require('amqplib')

async function consumerOrderMessage() {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const queueName = 'order-queued-message'
    await channel.assertQueue(queueName, {durable: true})

    channel.prefetch(1) // <=> transaction : 1 thời điểm chỉ xử lí 1 'job' -> đảm bảo thứ tự xử  lí

    channel.consume(queueName, msg => {
        const message = msg.content.toString()

        // Case : nhận message 'không theo thứ tự' - vì time-random
        setTimeout(() => {
            console.log('processed : ', message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })
}

consumerOrderMessage().catch(err => console.error(err))