import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { rangeSessions, sessionFirearms, firearms, ammoInventory, maintenanceLogs, drills, ammoPurchases } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

function csv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
}

export const GET: APIRoute = async ({ params }) => {
  const type = params.type;
  let filename = `armory-${type}.csv`;
  let body = '';

  if (type === 'sessions') {
    const sessions = await db.select().from(rangeSessions).orderBy(desc(rangeSessions.date));
    const sfRows   = await db.select({ sf: sessionFirearms, gun: firearms, ammo: ammoInventory })
      .from(sessionFirearms)
      .leftJoin(firearms, eq(sessionFirearms.firearmId, firearms.id))
      .leftJoin(ammoInventory, eq(sessionFirearms.ammoId, ammoInventory.id));

    body = csv(sessions.map(s => {
      const guns = sfRows.filter(r => r.sf.sessionId === s.id);
      const totalRounds = guns.reduce((n, r) => n + r.sf.roundsFired, 0);
      const cost = guns.reduce((n, r) => n + r.sf.roundsFired * (r.ammo?.costPerRound ?? 0), 0);
      return {
        date: s.date,
        location: s.location ?? '',
        duration_min: s.durationMinutes ?? '',
        weather: s.weather ?? '',
        rounds_fired: totalRounds,
        cost: cost > 0 ? cost.toFixed(2) : '',
        firearms: guns.map(r => r.gun?.name ?? '').filter(Boolean).join('; '),
        tags: s.tags ?? '',
        notes: s.notes ?? '',
      };
    }));
  }

  else if (type === 'ammo') {
    const all = await db.select().from(ammoInventory);
    body = csv(all.map(a => ({
      caliber: a.caliber,
      brand: a.brand,
      grain: a.grain ?? '',
      type: a.type,
      quantity: a.quantity,
      cost_per_round: a.costPerRound ?? '',
      lot_number: a.lotNumber ?? '',
      low_stock_threshold: a.lowStockThreshold,
      notes: a.notes ?? '',
    })));
  }

  else if (type === 'ammo-purchases') {
    const rows = await db.select({ p: ammoPurchases, a: ammoInventory })
      .from(ammoPurchases)
      .leftJoin(ammoInventory, eq(ammoPurchases.ammoId, ammoInventory.id))
      .orderBy(desc(ammoPurchases.date));
    body = csv(rows.map(r => ({
      date: r.p.date,
      caliber: r.a?.caliber ?? '',
      brand: r.a?.brand ?? '',
      quantity: r.p.quantity,
      total_cost: r.p.totalCost ?? '',
      cost_per_round: r.p.totalCost && r.p.quantity > 0 ? (r.p.totalCost / r.p.quantity).toFixed(4) : '',
      source: r.p.source ?? '',
      notes: r.p.notes ?? '',
    })));
  }

  else if (type === 'maintenance') {
    const rows = await db.select({ m: maintenanceLogs, gun: firearms })
      .from(maintenanceLogs)
      .leftJoin(firearms, eq(maintenanceLogs.firearmId, firearms.id))
      .orderBy(desc(maintenanceLogs.date));
    body = csv(rows.map(r => ({
      date: r.m.date,
      firearm: r.gun?.name ?? '',
      type: r.m.type,
      round_count: r.m.roundCount ?? '',
      notes: r.m.notes,
    })));
  }

  else if (type === 'drills') {
    const rows = await db.select({ d: drills, s: rangeSessions, gun: firearms })
      .from(drills)
      .leftJoin(rangeSessions, eq(drills.sessionId, rangeSessions.id))
      .leftJoin(firearms, eq(drills.firearmId, firearms.id))
      .orderBy(desc(rangeSessions.date));
    body = csv(rows.map(r => ({
      date: r.s?.date ?? '',
      drill: r.d.name,
      firearm: r.gun?.name ?? '',
      distance: r.d.distance ?? '',
      score: r.d.score ?? '',
      par_time: r.d.parTime ?? '',
      notes: r.d.notes ?? '',
    })));
  }

  else {
    return new Response('Unknown export type', { status: 404 });
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
