import type { APIRoute } from 'astro';
import { loadNotifyConfig, sendNotification } from '../../../lib/notifications';
import { db } from '../../../db';
import { firearms, maintenanceLogs, sessionFirearms, ammoInventory } from '../../../db/schema';
import { eq, sum } from 'drizzle-orm';

export const POST: APIRoute = async () => {
  const cfg = loadNotifyConfig();
  if (cfg.channels.length === 0) return new Response(JSON.stringify({ sent: 0, results: [] }), { headers: { 'Content-Type': 'application/json' } });

  const messages: { title: string; body: string }[] = [];
  const today = new Date();

  if (cfg.onMaintenanceDue || cfg.onBarrelWear) {
    const allGuns = await db.select().from(firearms).where(eq(firearms.status, 'active'));
    for (const gun of allGuns) {
      const roundsRow = await db.select({ total: sum(sessionFirearms.roundsFired) }).from(sessionFirearms).where(eq(sessionFirearms.firearmId, gun.id));
      const totalRounds = parseInt(String(roundsRow[0]?.total ?? 0)) || 0;
      const logs = await db.select().from(maintenanceLogs).where(eq(maintenanceLogs.firearmId, gun.id));
      const lastClean = logs.filter(l => l.type === 'cleaning').sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
      const roundsSince = totalRounds - (lastClean?.roundCount ?? 0);
      const daysSince   = lastClean ? Math.floor((today.getTime() - new Date(lastClean.date).getTime()) / 86_400_000) : null;

      if (cfg.onMaintenanceDue) {
        const byRounds = gun.serviceIntervalRounds != null && roundsSince >= gun.serviceIntervalRounds;
        const byDays   = gun.cleanIntervalDays != null && (daysSince == null || daysSince >= gun.cleanIntervalDays);
        if (byRounds || byDays) {
          const reason = [byRounds ? `${roundsSince} rds since last clean` : null, byDays ? `${daysSince ?? 0}d since last clean` : null].filter(Boolean).join(', ');
          messages.push({ title: `Cleaning Due — ${gun.name}`, body: `${gun.name} (${gun.caliber}) is due for cleaning. ${reason}.` });
        }
      }

      if (cfg.onBarrelWear && gun.barrelRatedRounds && (gun.barrelRoundCount ?? 0) > 0) {
        const pct = ((gun.barrelRoundCount ?? 0) / gun.barrelRatedRounds) * 100;
        if (pct >= 80) {
          messages.push({ title: `Barrel Wear — ${gun.name}`, body: `${gun.name} barrel is at ${pct.toFixed(0)}% of rated life (${gun.barrelRoundCount?.toLocaleString()} / ${gun.barrelRatedRounds.toLocaleString()} rounds).` });
        }
      }
    }
  }

  if (cfg.onLowAmmo) {
    const ammo = await db.select().from(ammoInventory);
    for (const a of ammo) {
      if (a.lowStockThreshold > 0 && a.quantity <= a.lowStockThreshold) {
        messages.push({ title: `Low Ammo — ${a.caliber}`, body: `${a.brand} ${a.grain ? `${a.grain}gr ` : ''}${a.caliber}: ${a.quantity} rounds remaining (threshold: ${a.lowStockThreshold}).` });
      }
    }
  }

  const allResults = [];
  for (const msg of messages) {
    const res = await sendNotification(cfg.channels, msg.title, msg.body);
    allResults.push(...res);
  }

  return new Response(JSON.stringify({ sent: messages.length, results: allResults }), { headers: { 'Content-Type': 'application/json' } });
};
