'use strict'

const amqp = require('amqplib')

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(
            queueName,
            { durable: true }
        )

        // Send messages to consumer channel
        channel.consume(queueName, (messages) => {
            console.log(`Received ${messages.content.toString()}`)
        }, {
            noAck: true
        })

    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch(console.error)