import express from 'express';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { vaultTable } from '../db/schema.ts';
import { getChannel, QUEUE_NAME } from '../amqp_conn_management.ts';
import { Buffer } from 'node:buffer';
import { corsOptions } from '../cors_options.ts';
import cors from 'cors';``



const vaultController = express.Router();
vaultController.use(cors(corsOptions));
const db = drizzle(Deno.env.get('DATABASE_URL')!);


vaultController.get('/', async (_req: express.Request, res: express.Response) => {
    const vaults = await db.select().from(vaultTable);
    res.send(vaults);
});

vaultController.post('/', async (req: express.Request, res: express.Response) => {
    const newVault = await req.body;
    
    if (newVault.name && newVault.userId && newVault.passwordHash) {
        const queryRes = await db.insert(vaultTable).values(newVault);
        if (queryRes.length > 0) {
            // Get the newly created vault's id.
            const vaultId = queryRes[0].insertId;
            
            const channel = getChannel();
            if (channel) {
                const message = {
                    event: 'VAULT_CREATED',
                    data: {
                        ...newVault,
                        id: vaultId,
                    }
                };
                channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
            }
            
            res.send(`Successfully created new vault: ${newVault.name}`);
        } else {
            res.send('Failed to create database entry for new vault.');
        }
    } else {
        res.send('Didn\'t receive the required information to create a vault.').status(400);
    }
});


vaultController.delete('/:id', async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
        const queryRes = await db.delete(vaultTable)
            .where(eq(vaultTable.id, id));
            
        
        if (queryRes.length > 0) {
            const ch = getChannel();
            if (ch) {
                const message = {
                    event: 'VAULT_DELETED',
                    data: {
                        id: id,
                    }
                };
                ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
            }
        }
        
        res.send(`Successfully deleted vault with id: ${id}`);
    } else {
        res.send('Invalid vault id').status(400);
    }
});


vaultController.get('/user-vaults/:userId', async (req: express.Request, res: express.Response) => {
    const id = Number(req.params.userId);
    
    if (id) {
        const vaults = await db.select()
            .from(vaultTable)
            .where(eq(vaultTable.userId, id));
        
        res.send(vaults);
            
    } else {
        res.send('No user id was given!').status(400);
    }
});


export default vaultController;
