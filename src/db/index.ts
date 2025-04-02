import { drizzle } from 'drizzle-orm/mysql2';

const dbUrl = Deno.env.get('DATABASE_URL');
if (dbUrl) {
    const db = drizzle(dbUrl);
} else {
    console.error('Could not get the database url from environment variables.');
}
