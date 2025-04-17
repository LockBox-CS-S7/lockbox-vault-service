import express from 'express';
import cors from 'cors';
import vaultController from "./controllers/vault_controller.ts";
import { initializeRabbitMQ } from "./amqp_conn_management.ts";


const app = express();
const port = 3000;
const corsOptions = {
    origin: 'http://gateway:8080/*',
    optionsSuccessStatus: 200
};
// Configure the application
app.use(express.json());
app.use(cors(corsOptions));

// Start listening for messages and http requests
app.use('/vaults', vaultController);

try {
    initializeRabbitMQ();
} catch (_error) {
    console.log('Failed to initialize RabbitMQ');
}

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
