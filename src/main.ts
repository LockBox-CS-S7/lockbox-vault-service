import express from 'express';
import amqp from 'amqplib/callback_api.js';
import { handleIncomingMessage } from './message_handling.ts';
import vaultController from "./controllers/vault_controller.ts";
import { initializeRabbitMQ } from "./amqp_conn_management.ts";


const app = express();
const port = 3000;
const queueName = 'notifications-queue';

app.use(express.json())
app.use('/vaults', vaultController);

initializeRabbitMQ();

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
