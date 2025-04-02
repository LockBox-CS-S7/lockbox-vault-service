import amqp from 'amqplib/callback_api.js';

/**
 * Handles all incoming amqp messages.
 * @param msg - The received amqp message.
 */
export function handleIncomingMessage(msg: amqp.Message) {
    const msgStr = msg.content.toString();
    const id = msg.properties.messageId;
    console.log(' [x] Received message: ', {id: id, message: msgStr});
}
