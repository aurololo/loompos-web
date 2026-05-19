// LoomPOS — Pulse: manager dashboard.

import { useMemo } from 'react';
import { Icon } from '../design/icons';
import { Sparkline } from '../design/primitives';
import { STATIONS, EVENTS } from '../core/data';

export function Pulse() {
  const rev = useMemo(
    () => Array.from({ length: 28 }, (_, i) =>
      40 + Math.sin(i / 3) * 20 + i * 1.8 + Math.random() * 6
    ),
    []
  );

  return (
    <div className="content">
      <div className="band">
        <div className="band-row">
          <div className="col">
            <div className="t-eyebrow muted">Today · Friday peak</div>
            <h2>Pulse</h2>
          </div>
          <div className="actions">
            <button className="btn ghost"><Icon.Filter style={{ width: 14, height: 14 }} /> Filter</button>
            <button className="btn"><Icon.Maximize style={{ width: 14, height: 14 }} /> Compare</button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="hero-card glow" style={{ padding: 24 }}>
            <div className="t-eyebrow muted">Revenue today</div>
            <div className="row items-end gap-3 mt-2">
              <div className="t-hero">₹86,420</div>
              <div className="delta up" style={{ marginBottom: 16 }}>+12.4%</div>
            </div>
            <div className="muted t-sm mt-2">vs Friday last week · ₹76.9k</div>
            <div className="mt-3"><Sparkline data={rev} width={400} height={44} fill /></div>
          </div>
          <SmallKPI label="Active orders" value="34"    sub="14 firing · 20 cooking" delta="+6" />
          <SmallKPI label="Avg wait"      value="11:42" sub="P95 · 18:20"            delta="-0:32" trend="good" />
          <SmallKPI label="Line load"     value="74%"   sub="Threshold 85%"          delta="+8%"   trend="warn" />
        </div>
      </div>

      <div className="band" style={{ paddingTop: 0 }}>
        <div className="insight">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--brand-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--brand-bright)'
          }}>
            <Icon.Zap style={{ width: 18, height: 18 }} />
          </div>
          <div className="body">
            <div className="head">Loom AI · 2m ago</div>
            <div className="text">
              Grill is bottlenecked (92% load). Re-route 3 incoming pasta tickets from Grill prep
              to Pasta line — projected wait drops by 3m24s.
            </div>
          </div>
          <button className="btn primary">Apply re-route</button>
        </div>
      </div>

      <div className="band">
        <div className="band-row">
          <h2>Station load</h2>
          <div className="t-sm muted">Refreshes every 4.5s</div>
        </div>
        <div className="station-load">
          {STATIONS.map((s) => {
            const c = s.load > 0.85 ? 'var(--crit)' : s.load > 0.65 ? 'var(--warn)' : 'var(--brand)';
            return (
              <div className="stn" key={s.name}>
                <div className="stn-name">{s.name}</div>
                <div className="stn-val" style={{ color: s.load > 0.85 ? 'var(--crit)' : undefined }}>
                  {Math.round(s.load * 100)}
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>%</span>
                </div>
                <div className="stn-bar">
                  <i style={{ width: `${s.load * 100}%`, background: c }} />
                </div>
                <div className="t-cap muted mt-2">{s.count} active tickets</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="band">
        <div className="band-row">
          <h2>Event stream</h2>
          <button className="btn ghost">Open Loom Cloud →</button>
        </div>
        <div className="events">
          {EVENTS.map((e, i) => (
            <div className="event-row" key={i}>
              <div className="ts">{e.ts}</div>
              <div>{e.text}</div>
              <div className="src">{e.src}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SmallKPI({
  label, value, sub, delta, trend,
}: {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  trend?: 'good' | 'warn';
}) {
  const deltaCls =
    trend === 'good' ? 'up'
    : trend === 'warn' ? 'down'
    : delta && delta.startsWith('-') ? 'down'
    : 'up';
  return (
    <div className="hero-card" style={{ padding: 22 }}>
      <div className="t-eyebrow muted">{label}</div>
      <div className="t-xl mt-2" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="row items-center gap-3 mt-2">
        {delta && <div className={`delta ${deltaCls}`}>{delta}</div>}
        {sub && <div className="muted t-sm">{sub}</div>}
      </div>
    </div>
  );
}
