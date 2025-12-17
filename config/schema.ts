import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(1)
});
 
export const sessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  detail: text(),
  selectedDoctor: json(),
  conversation: json(),
  report: json(),
  createdBy: varchar().references(()=>usersTable.email),
  createdOn: varchar()
});