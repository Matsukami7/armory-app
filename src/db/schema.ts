import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const firearms = sqliteTable('firearms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  caliber: text('caliber').notNull(),
  serial: text('serial'),
  generation: text('generation'),
  type: text('type').notNull(), // pistol, rifle, shotgun, revolver, other
  purchaseDate: text('purchase_date'),
  purchasePrice: real('purchase_price'),
  notes: text('notes'),
  photoPath: text('photo_path'),
  serviceIntervalRounds: integer('service_interval_rounds'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const accessories = sqliteTable('accessories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').references(() => firearms.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // optic, light, suppressor, grip, stock, trigger, other
  make: text('make'),
  model: text('model'),
  notes: text('notes'),
  purchaseDate: text('purchase_date'),
  purchasePrice: real('purchase_price'),
  lumens: integer('lumens'),
  powerType: text('power_type'),    // rechargeable | battery
  batteryType: text('battery_type'), // CR123A, 18650, AA, AAA, CR2, other
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const maintenanceLogs = sqliteTable('maintenance_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  type: text('type').notNull(), // cleaning, repair, inspection, modification
  notes: text('notes').notNull(),
  roundCount: integer('round_count'), // rounds on firearm at time of service
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const ammoInventory = sqliteTable('ammo_inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  caliber: text('caliber').notNull(),
  brand: text('brand').notNull(),
  grain: integer('grain'),
  type: text('type').notNull(), // FMJ, HP, SP, match, subsonic, other
  quantity: integer('quantity').notNull().default(0),
  costPerRound: real('cost_per_round'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const rangeSessions = sqliteTable('range_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  location: text('location'),
  durationMinutes: integer('duration_minutes'),
  weather: text('weather'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const sessionFirearms = sqliteTable('session_firearms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => rangeSessions.id, { onDelete: 'cascade' }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id),
  roundsFired: integer('rounds_fired').notNull().default(0),
  ammoId: integer('ammo_id').references(() => ammoInventory.id),
});

export const drills = sqliteTable('drills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => rangeSessions.id, { onDelete: 'cascade' }),
  firearmId: integer('firearm_id').references(() => firearms.id),
  name: text('name').notNull(),
  distance: text('distance'),
  score: text('score'),
  notes: text('notes'),
  targetPhotoPath: text('target_photo_path'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
