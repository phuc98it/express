'use strict'

const amqp = require('amqplib')

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx'                   // khai bao notifEX direct -> Exchange success  (1)
        const notifQueue = 'notificationQueueProcess'                   // Queue - handle success                       (1)
        const notificationExchangeDLX = 'notificationExDLX'             // Exchange Fail                                (2)
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'   // assert -> to routing DLX                     (2)

        // direct : truyền tải 'message' dựa trên kết quả khớp chính xác nhất của 'khóa định tuyến'.

        // 1 - Create Exchange
        await channel.assertExchange(
            notificationExchange, 
            'direct', 
            { durable: true }
        )

        // 2 - Create Queue
        const queueResult = await channel.assertQueue(notifQueue, {
            exclusive: false,   // cho phép các kết nối truy cập đồng thời vào cùng 1 hàng đợi.
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3 - Binding Queue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4 - Send Message (notifEx -> notifQueue)
        const msg = 'a new product'
        console.log('producer msg :: ', msg)

        await channel.sendToQueue(
            queueResult.queue,
            Buffer.from(msg),
            {expiration: '10000'}       // msg het han trong 10s
        )

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error('error :: ', error)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)