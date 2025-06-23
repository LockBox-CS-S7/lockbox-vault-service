import express from 'express';
import cors from 'cors';
import vaultController from './controllers/vault_controller.ts';
import { initializeRabbitMQ } from './amqp_conn_management.ts';
import { corsOptions } from './cors_options.ts';


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors(corsOptions));

app.use('/vaults', vaultController);

try {
    const brokerUri = Deno.env.get('RABBITMQ_URI')!;
    initializeRabbitMQ(brokerUri);
} catch (_error) {
    console.log('Failed to initialize RabbitMQ');
}

app.get('/', (_req: express.Request, res: express.Response) => {
    res.send('Welcome to LockBox vault service.');
});

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
