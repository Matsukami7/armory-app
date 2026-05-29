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
  currentValue: real('current_value'),
  notes: text('notes'),
  photoPath: text('photo_path'),
  serviceIntervalRounds: integer('service_interval_rounds'),
  tags: text('tags'), // comma-separated tag list
  status: text('status').notNull().default('active'), // active | sold | transferred
  transferDate: text('transfer_date'),
  transferTo: text('transfer_to'),
  transferPrice: real('transfer_price'),
  transferNotes: text('transfer_notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const firearmPhotos = sqliteTable('firearm_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  caption: text('caption'),
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
  photoPath: text('photo_path'),
  zeroData: text('zero_data'),       // optic zero info (distance, clicks, etc.)
  batteryChangedDate: text('battery_changed_date'),
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
  lowStockThreshold: integer('low_stock_threshold').notNull().default(0),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const ammoPurchases = sqliteTable('ammo_purchases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ammoId: integer('ammo_id').notNull().references(() => ammoInventory.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  quantity: integer('quantity').notNull(),
  totalCost: real('total_cost'),
  source: text('source'),
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
  tags: text('tags'), // comma-separated tag list
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const gear = sqliteTable('gear', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(), // cleaning, targets, batteries, tools, safety, other
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit').notNull().default('pcs'),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(0),
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

export const magazines = sqliteTable('magazines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  capacity: integer('capacity'),
  roundCount: integer('round_count').notNull().default(0),
  springIntervalRounds: integer('spring_interval_rounds'),
  springReplacedDate: text('spring_replaced_date'),
  purchasedDate: text('purchased_date'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const footage = sqliteTable('footage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  date: text('date').notNull(),
  path: text('path'),          // upload path (null if external)
  externalUrl: text('external_url'), // YouTube/Vimeo/etc URL (null if uploaded)
  sessionId: integer('session_id').references(() => rangeSessions.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const firearmDocuments = sqliteTable('firearm_documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  path: text('path').notNull(),
  label: text('label'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const drills = sqliteTable('drills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').notNull().references(() => rangeSessions.id, { onDelete: 'cascade' }),
  firearmId: integer('firearm_id').references(() => firearms.id),
  name: text('name').notNull(),
  distance: text('distance'),
  score: text('score'),
  parTime: real('par_time'), // seconds
  notes: text('notes'),
  targetPhotoPath: text('target_photo_path'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const sessionTemplates = sqliteTable('session_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  location: text('location'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const sessionTemplateFirearms = sqliteTable('session_template_firearms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateId: integer('template_id').notNull().references(() => sessionTemplates.id, { onDelete: 'cascade' }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  ammoId: integer('ammo_id').references(() => ammoInventory.id, { onDelete: 'set null' }),
});
