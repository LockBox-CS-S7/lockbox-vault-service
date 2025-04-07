import { int, mysqlTable as table, varchar, datetime } from 'drizzle-orm/mysql-core';

export const notificationTable = table('notifications_table', {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    body: varchar({ length: 255 }).notNull(),
    urgency: varchar({ length: 255 }).notNull(),
    timeReceived: datetime('time_received').notNull(),
    userId: int('user_id').notNull(),
});
