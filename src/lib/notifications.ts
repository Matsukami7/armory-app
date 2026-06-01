import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), 'data/armory.db');
const configPath = resolve(dbPath, '..', 'notify-config.json');

export type NotifyChannel =
  | { type: 'ntfy';   url: string; topic: string }
  | { type: 'gotify'; url: string; token: string }
  | { type: 'email';  smtp: string; port: number; user: string; pass: string; from: string; to: string };

export type NotifyConfig = {
  channels: NotifyChannel[];
  onMaintenanceDue: boolean;
  onLowAmmo: boolean;
  onBarrelWear: boolean;
};

export function loadNotifyConfig(): NotifyConfig {
  if (!existsSync(configPath)) return { channels: [], onMaintenanceDue: true, onLowAmmo: true, onBarrelWear: true };
  try { return JSON.parse(readFileSync(configPath, 'utf-8')); } catch { return { channels: [], onMaintenanceDue: true, onLowAmmo: true, onBarrelWear: true }; }
}

export function saveNotifyConfig(cfg: NotifyConfig): void {
  writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

export async function sendNotification(channels: NotifyChannel[], title: string, body: string): Promise<{ channel: string; ok: boolean; error?: string }[]> {
  const results: { channel: string; ok: boolean; error?: string }[] = [];

  for (const ch of channels) {
    try {
      if (ch.type === 'ntfy') {
        const res = await fetch(`${ch.url.replace(/\/$/, '')}/${ch.topic}`, {
          method: 'POST',
          headers: { 'Title': title, 'Content-Type': 'text/plain' },
          body,
        });
        results.push({ channel: `ntfy:${ch.topic}`, ok: res.ok, error: res.ok ? undefined : await res.text() });
      }

      else if (ch.type === 'gotify') {
        const res = await fetch(`${ch.url.replace(/\/$/, '')}/message?token=${ch.token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, message: body, priority: 5 }),
        });
        results.push({ channel: 'gotify', ok: res.ok, error: res.ok ? undefined : await res.text() });
      }

      else if (ch.type === 'email') {
        // Dynamic import so the module only loads when actually used (nodemailer is optional)
        const nodemailer = await import('nodemailer').catch(() => null);
        if (!nodemailer) { results.push({ channel: 'email', ok: false, error: 'nodemailer not installed' }); continue; }
        const transport = nodemailer.default.createTransport({ host: ch.smtp, port: ch.port, auth: { user: ch.user, pass: ch.pass } });
        await transport.sendMail({ from: ch.from, to: ch.to, subject: `Armory: ${title}`, text: body });
        results.push({ channel: `email:${ch.to}`, ok: true });
      }
    } catch (e: any) {
      results.push({ channel: ch.type, ok: false, error: e?.message ?? 'Unknown error' });
    }
  }

  return results;
}
