import amqp from 'amqplib/callback_api.js';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { vaultTable } from './db/schema.ts';


export const QUEUE_NAME = 'vault-events';
export const ACCOUNT_QUEUE = 'account-queue';

interface AccountMessage {
    EventType: string;
    Timestamp: string;
    Source: string;
    UserId: string;
    Body: string;
}

let channel: amqp.Channel | null = null;

export function initializeRabbitMQ(brokerUri = 'amqp://rabbit-mq') {
    amqp.connect(brokerUri, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, ch) => {
            if (error1) {
                throw error1;
            }
            
            ch.assertQueue(QUEUE_NAME, {
                durable: true,
            });
            ch.assertQueue(ACCOUNT_QUEUE, {
                durable: true,
            });
            
            ch.consume(ACCOUNT_QUEUE, (msg) => {
                if (msg) {
                    handleAccountMessage(msg);
                } else {
                    console.error(`Received message from "${ACCOUNT_QUEUE}" was null`);
                }
            });
            
            ch.assertQueue()
            ch.prefetch(1);
            channel = ch;
        });
    });
};


async function handleAccountMessage(msg: amqp.Message) {
    try {
        const msgStr = msg.content.toString();
        const accountMsg: AccountMessage = JSON.parse(msgStr);
        
        if (accountMsg.EventType == 'ACCOUNT_DELETION_REQUESTED' && accountMsg.UserId) {
            // Connect to the database and delete all vaults from the removed account.
            const db = drizzle(Deno.env.get('DATABASE_URL')!);
            const queryRes = await db.delete(vaultTable)
                .where(eq(vaultTable.userId, accountMsg.UserId));
                
        }
    } catch (err) {
        console.error(`Failed to deserialize incoming message from ${ACCOUNT_QUEUE}: `, err);
    }
}

export const getChannel = () => channel;