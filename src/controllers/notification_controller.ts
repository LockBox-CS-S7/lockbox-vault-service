import express from 'express';
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { notificationTable } from '../db/schema.ts';


const notificationController = express.Router();

notificationController.get('/user-notifications/:userId', async (req: express.Request, res: express.Response) => {
    const id = Number(req.params.userId);
    
    if (id) {
        const db = drizzle(Deno.env.get('DATABASE_URL')!);
        const notifications = await db.select()
            .from(notificationTable)
            .where(eq(notificationTable.userId, id));
        
        res.send(notifications);
            
    } else {
        res.send('No user id was given!').status(400);
    }
});


export default notificationController;