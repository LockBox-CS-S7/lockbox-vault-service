import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const notificationTable = mysqlTable('notifications_table', {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    body: varchar({ length: 255 }).notNull(),
    urgency: varchar({ length: 255 }).notNull(),
});
