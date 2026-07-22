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
  cleanIntervalDays: integer('clean_interval_days'),
  barrelRoundCount: integer('barrel_round_count').notNull().default(0),
  barrelRatedRounds: integer('barrel_rated_rounds'),
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
  lotNumber: text('lot_number'),
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

export const uspsaMatches = sqliteTable('uspsa_matches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  date: text('date').notNull(),
  location: text('location'),
  division: text('division'), // Open, Limited, Limited 10, PCC, Carry Optics, Production, Single Stack, Revolver, Limited Optics
  matchLevel: text('match_level'), // club, area, state, national
  overallPlace: integer('overall_place'),
  overallPercent: real('overall_percent'),
  pointsLost: real('points_lost'),        // PL
  avgPointsLost: real('avg_points_lost'), // APL
  pointsPercent: real('points_percent'),  // Pts %
  totalTime: real('total_time'),
  countA: integer('count_a'),
  countC: integer('count_c'),
  countD: integer('count_d'),
  countM: integer('count_m'),
  countNs: integer('count_ns'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const uspsaStages = sqliteTable('uspsa_stages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  matchId: integer('match_id').notNull().references(() => uspsaMatches.id, { onDelete: 'cascade' }),
  stageNumber: integer('stage_number').notNull(),
  stageName: text('stage_name'),
  place: integer('place'),
  percent: real('percent'),
  pointsLost: real('points_lost'),
  pointsPercent: real('points_percent'),
  hitFactor: real('hit_factor'),
  time: real('time'),
  countA: integer('count_a'),
  countC: integer('count_c'),
  countD: integer('count_d'),
  countM: integer('count_m'),
  countNs: integer('count_ns'),
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
  uspsaMatchId: integer('uspsa_match_id').references(() => uspsaMatches.id, { onDelete: 'set null' }),
  uspsaStageId: integer('uspsa_stage_id').references(() => uspsaStages.id, { onDelete: 'set null' }),
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

export const trainingPlans = sqliteTable('training_plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const trainingPlanDrills = sqliteTable('training_plan_drills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  planId: integer('plan_id').notNull().references(() => trainingPlans.id, { onDelete: 'cascade' }),
  drillName: text('drill_name').notNull(),
  targetScore: text('target_score'),
  reps: integer('reps').notNull().default(1),
  distance: text('distance'),
  notes: text('notes'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const trainingPlanSessions = sqliteTable('training_plan_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  planId: integer('plan_id').notNull().references(() => trainingPlans.id, { onDelete: 'cascade' }),
  sessionId: integer('session_id').references(() => rangeSessions.id, { onDelete: 'set null' }),
  completedAt: text('completed_at').notNull(),
  notes: text('notes'),
});

export const shotGroups = sqliteTable('shot_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: integer('session_id').references(() => rangeSessions.id, { onDelete: 'set null' }),
  firearmId: integer('firearm_id').references(() => firearms.id, { onDelete: 'set null' }),
  ammoId: integer('ammo_id').references(() => ammoInventory.id, { onDelete: 'set null' }),
  date: text('date').notNull(),
  distance: integer('distance'),           // yards
  distanceUnit: text('distance_unit').notNull().default('yards'),
  groupSize: real('group_size').notNull(), // inches or MOA depending on unit
  groupUnit: text('group_unit').notNull().default('inches'), // inches | moa | mm
  shotCount: integer('shot_count'),
  notes: text('notes'),
  photoPath: text('photo_path'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const wishList = sqliteTable('wish_list', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull().default('firearm'), // firearm | ammo | gear | accessory | other
  make: text('make'),
  model: text('model'),
  estimatedPrice: real('estimated_price'),
  priority: text('priority').notNull().default('medium'), // high | medium | low
  url: text('url'),
  notes: text('notes'),
  acquired: integer('acquired', { mode: 'boolean' }).notNull().default(false),
  acquiredDate: text('acquired_date'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const dopeCards = sqliteTable('dope_cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firearmId: integer('firearm_id').notNull().references(() => firearms.id, { onDelete: 'cascade' }),
  ammoId: integer('ammo_id').references(() => ammoInventory.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  zeroDistance: integer('zero_distance'),
  zeroUnit: text('zero_unit').notNull().default('yards'), // yards | meters
  muzzleVelocity: integer('muzzle_velocity'),             // fps
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const dopeEntries = sqliteTable('dope_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cardId: integer('card_id').notNull().references(() => dopeCards.id, { onDelete: 'cascade' }),
  distance: integer('distance').notNull(),
  distanceUnit: text('distance_unit').notNull().default('yards'), // yards | meters
  elevationMoa: real('elevation_moa'),
  elevationMrad: real('elevation_mrad'),
  windMoa: real('wind_moa'),   // full value 10mph
  windMrad: real('wind_mrad'),
  notes: text('notes'),
});

export const rangeMemberships = sqliteTable('range_memberships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  locationMatch: text('location_match'),   // substring matched against range_sessions.location
  monthlyFee: real('monthly_fee'),
  hourlyRate: real('hourly_rate'),
  dayRate: real('day_rate'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),               // null = still active
  status: text('status').notNull().default('active'), // active | inactive
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const arBuilds = sqliteTable('ar_builds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  caliber: text('caliber'),
  gasSystem: text('gas_system'), // pistol | carbine | mid | rifle
  barrelLength: real('barrel_length'), // inches
  budget: real('budget'),
  status: text('status').notNull().default('planning'), // planning | in_progress | complete
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const receipts = sqliteTable('receipts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  vendor: text('vendor'),
  total: real('total').notNull(),
  category: text('category').notNull().default('other'), // ammo | range_fee | gear | firearm | accessory | other
  photoPath: text('photo_path'),
  notes: text('notes'),
  sessionId: integer('session_id').references(() => rangeSessions.id, { onDelete: 'set null' }),
  ammoPurchaseId: integer('ammo_purchase_id').references(() => ammoPurchases.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const arBuildParts = sqliteTable('ar_build_parts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  buildId: integer('build_id').notNull().references(() => arBuilds.id, { onDelete: 'cascade' }),
  slot: text('slot').notNull(), // lower_receiver | upper_receiver | barrel | bcg | charging_handle | handguard | muzzle_device | trigger | buffer_system | stock_brace | grip | optic | extra
  brand: text('brand'),
  model: text('model'),
  price: real('price'),
  url: text('url'),
  status: text('status').notNull().default('wanted'), // wanted | ordered | acquired
  notes: text('notes'),
  photoPath: text('photo_path'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
});
