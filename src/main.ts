import express from 'express';
import vaultController from "./controllers/vault_controller.ts";
import { initializeRabbitMQ } from "./amqp_conn_management.ts";


const app = express();
const port = 3000;

app.use(express.json());
app.use('/vaults', vaultController);

initializeRabbitMQ();

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
