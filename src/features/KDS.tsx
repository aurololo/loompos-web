// LoomPOS — KDS: live ticket cards with timers + station strip.

import { useEffect, useState } from 'react';
import { Icon } from '../design/icons';
import { TICKETS, STATIONS, type KitchenTicket } from '../core/data';

export function KDS() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(TICKETS);

  useEffect(() => {
    const id = setInterval(() => {
      setTickets((ts) => ts.map((t) => ({ ...t, ageSec: t.ageSec + 1 })));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const advance = (id: string) =>
    setTickets((ts) => ts.filter((t) => t.id !== id));

  return (
    <div className="kds-wrap">
      <div className="station-strip">
        {STATIONS.map((s) => {
          const c = s.load > 0.85 ? 'var(--crit)' : s.load > 0.65 ? 'var(--warn)' : 'var(--brand)';
          return (
            <div className="station-chip" key={s.name}>
              <div className="col" style={{ flex: 1 }}>
                <div className="name">{s.name}</div>
                <div className="load">{s.count} tickets · {Math.round(s.load * 100)}%</div>
              </div>
              <div className="station-bar">
                <i style={{ width: `${s.load * 100}%`, background: c }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="kds-grid">
        {tickets.map((t) => (
          <Ticket key={t.id} t={t} onAdvance={() => advance(t.id)} />
        ))}
      </div>
    </div>
  );
}

function Ticket({ t, onAdvance }: { t: KitchenTicket; onAdvance: () => void }) {
  const minutes = Math.floor(t.ageSec / 60);
  const seconds = t.ageSec % 60;
  const heat = t.ageSec >= 540 ? 'overdue'
    : t.ageSec >= 360 ? 'high'
    : t.ageSec >= 180 ? 'mid'
    : 'low';
  return (
    <div className={`ticket heat-${heat}`}>
      <div className="ticket-head">
        <div className="col">
          <div className="ticket-id">{t.id}</div>
          <div className="ticket-table">Table {t.table}</div>
        </div>
        <div className="ticket-timer mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="ticket-body">
        {t.items.map((it, i) => (
          <div key={i}>
            <div className="ticket-item">
              <div className="qty">×{it.qty}</div>
              <div className="name">{it.name}</div>
            </div>
            {it.mod && <div className="ticket-item mod">{it.mod}</div>}
          </div>
        ))}
      </div>
      <div className="ticket-foot">
        <button className="advance" onClick={onAdvance}>
          <Icon.Play style={{ width: 12, height: 12 }} />
          {t.status === 'firing' ? 'Cook' : 'Plate'}
        </button>
        <button className="ghost" title="Recall">
          <Icon.Bell style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}
