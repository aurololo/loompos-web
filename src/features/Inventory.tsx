// LoomPOS — Inventory: grouped status with critical/expiring/low/healthy.

import { useState } from 'react';
import { Icon } from '../design/icons';
import { INVENTORY, type InventoryItem } from '../core/data';

type Status = 'critical' | 'expiring' | 'low' | 'ok';

interface InvWithStatus extends InventoryItem {
  ratio: number;
  status: Status;
}

export function Inventory() {
  const [filter, setFilter] = useState<Status | 'all'>('all');

  const itemsWithStatus: InvWithStatus[] = INVENTORY.map((i) => {
    const ratio = i.current / i.par;
    let status: Status =
      ratio < 0.5 ? 'critical'
      : ratio < 0.75 ? 'low'
      : 'ok';
    if (i.expiresInH < 24) status = status === 'critical' ? 'critical' : 'expiring';
    return { ...i, ratio, status };
  });

  const filtered = filter === 'all'
    ? itemsWithStatus
    : itemsWithStatus.filter((i) => i.status === filter);

  const stats = {
    critical: itemsWithStatus.filter((i) => i.status === 'critical').length,
    expiring: itemsWithStatus.filter((i) => i.status === 'expiring').length,
    low:      itemsWithStatus.filter((i) => i.status === 'low').length,
    ok:       itemsWithStatus.filter((i) => i.status === 'ok').length,
    total:    itemsWithStatus.length,
  };

  const groups = [
    { id: 'critical', label: 'Below par · re-order now', color: 'var(--urgent)', items: filtered.filter((i) => i.status === 'critical') },
    { id: 'expiring', label: 'Expiring soon · 86 risk',  color: 'var(--warn)',   items: filtered.filter((i) => i.status === 'expiring') },
    { id: 'low',      label: 'Approaching par',          color: 'var(--info)',   items: filtered.filter((i) => i.status === 'low') },
    { id: 'ok',       label: 'Healthy',                  color: 'var(--brand)',  items: filtered.filter((i) => i.status === 'ok') },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="content inv-wrap">
      <div className="band">
        <div className="inv-stats">
          <InvStat label="Total SKUs"     value={stats.total} />
          <InvStat label="Below par"      value={stats.critical} color="var(--urgent)" />
          <InvStat label="Expiring < 24h" value={stats.expiring} color="var(--warn)" />
          <InvStat label="Approaching"    value={stats.low}      color="var(--info)" />
          <InvStat label="Healthy"        value={stats.ok}       color="var(--brand)" />
        </div>

        <div className="inv-filter">
          {([
            { id: 'all',      name: 'All',         c: 'var(--text)' },
            { id: 'critical', name: 'Below par',   c: 'var(--urgent)' },
            { id: 'expiring', name: 'Expiring',    c: 'var(--warn)' },
            { id: 'low',      name: 'Approaching', c: 'var(--info)' },
            { id: 'ok',       name: 'Healthy',     c: 'var(--brand)' },
          ] as const).map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? 'on' : ''}
              onClick={() => setFilter(f.id as Status | 'all')}
            >
              <span className="dot" style={{ background: f.c }}></span>
              {f.name}
            </button>
          ))}
          <div style={{ flex: 1 }}></div>
          <button className="btn ghost">
            <Icon.Filter style={{ width: 14, height: 14 }} /> By station
          </button>
          <button className="btn primary">
            <Icon.Plus style={{ width: 14, height: 14 }} /> Receive shipment
          </button>
        </div>
      </div>

      {groups.map((g) => (
        <div className="band inv-group" key={g.id}>
          <div className="inv-group-head">
            <div className="row items-center gap-3">
              <span
                className="inv-pill"
                style={{
                  background: `color-mix(in oklab, ${g.color} 16%, transparent)`,
                  color: g.color,
                  borderColor: `color-mix(in oklab, ${g.color} 35%, transparent)`,
                }}
              >
                {g.items.length}
              </span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{g.label}</h3>
            </div>
          </div>

          <div className="inv-table">
            <div className="inv-row inv-header">
              <div>Item</div>
              <div>Category</div>
              <div>Station</div>
              <div className="text-right">Stock / Par</div>
              <div>Level</div>
              <div>Expires</div>
              <div>Supplier</div>
            </div>
            {g.items.map((it) => (
              <InvRow key={it.id} it={it} groupColor={g.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InvStat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card inv-stat">
      <div className="t-eyebrow muted">{label}</div>
      <div className="inv-stat-val" style={{ color }}>{value}</div>
    </div>
  );
}

function InvRow({ it, groupColor }: { it: InvWithStatus; groupColor: string }) {
  const pct = Math.min(it.ratio * 100, 140);
  return (
    <div className="inv-row">
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{it.name}</div>
      </div>
      <div className="muted t-sm">{it.cat}</div>
      <div className="muted t-sm">{it.station}</div>
      <div className="text-right mono" style={{ fontSize: 14, fontWeight: 600 }}>
        <span style={{ color: it.status === 'critical' ? 'var(--urgent)' : undefined }}>
          {it.current}
        </span>
        <span className="muted" style={{ fontWeight: 400 }}> / {it.par} {it.unit}</span>
      </div>
      <div>
        <div className="thermo">
          <div className="thermo-fill"
               style={{ width: `${Math.min(pct, 100)}%`, background: groupColor }} />
          <div className="thermo-mark" style={{ left: '100%' }} />
        </div>
      </div>
      <div className="mono t-sm" style={{ color: it.expiresInH < 24 ? 'var(--warn)' : undefined }}>
        {formatExpiry(it.expiresInH)}
      </div>
      <div className="muted t-sm">{it.supplier}</div>
    </div>
  );
}

function formatExpiry(h: number) {
  if (h < 24) return `${h}h`;
  if (h < 168) return `${Math.round(h / 24)}d`;
  if (h < 720) return `${Math.round(h / 168)}w`;
  return `${Math.round(h / 720)}mo`;
}
