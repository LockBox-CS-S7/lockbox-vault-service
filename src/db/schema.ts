import { int, mysqlTable as table, varchar } from 'drizzle-orm/mysql-core';

export const vaultTable = table('vault_table', {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    userId: int('user_id').notNull(),
});
