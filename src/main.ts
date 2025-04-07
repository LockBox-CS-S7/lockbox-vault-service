import express from 'express';
import amqp from 'amqplib/callback_api.js';
import { handleIncomingMessage } from './message_handling.ts';


const app = express();
const port = 3000;
const queueName = 'notifications-queue';


app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});

// Connect to the amqp message queue
amqp.connect('amqp://rabbit-mq', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        
        channel.assertQueue(queueName, {
            durable: true
        });
        channel.prefetch(1);
        
        console.log(` [*] Waiting for messages in ${queueName}`);
        channel.consume(queueName, (msg) => {
            if (msg) {
                handleIncomingMessage(msg);
            }
        }, {
            noAck: false
        });
    });
});
