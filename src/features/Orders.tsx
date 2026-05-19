// LoomPOS — Orders: live order list (table-style, sortable feel).

import { Icon } from '../design/icons';

type OrderState = 'cooking' | 'served' | 'bill' | 'overdue';

interface DemoOrder {
  id: string;
  table: string;
  server: string;
  items: number;
  total: number;
  state: OrderState;
  minutes: number;
}

const ORDERS: DemoOrder[] = [
  { id: 'A4-2814', table: '5',   server: 'Nadia',   items: 5,  total: 4140, state: 'overdue', minutes: 71 },
  { id: 'A4-2813', table: '9',   server: 'Theo',    items: 11, total: 5840, state: 'cooking', minutes: 24 },
  { id: 'A4-2812', table: 'BX1', server: 'Nadia',   items: 6,  total: 4720, state: 'cooking', minutes: 31 },
  { id: 'A4-2811', table: 'P5',  server: 'Theo',    items: 4,  total: 3240, state: 'served',  minutes: 48 },
  { id: 'A4-2810', table: '6',   server: 'Marisol', items: 5,  total: 2880, state: 'bill',    minutes: 64 },
  { id: 'A4-2809', table: 'B2',  server: 'Kai',     items: 2,  total: 460,  state: 'cooking', minutes: 12 },
  { id: 'A4-2808', table: '3',   server: 'Theo',    items: 7,  total: 3920, state: 'served',  minutes: 38 },
  { id: 'A4-2807', table: '2',   server: 'Marisol', items: 4,  total: 1620, state: 'cooking', minutes: 18 },
];

const STATE_COLOR: Record<OrderState, string> = {
  cooking: 'var(--warn)',
  served:  'var(--route)',
  bill:    'var(--crit)',
  overdue: 'var(--urgent)',
};

export function Orders() {
  return (
    <div className="content">
      <div className="band">
        <div className="band-row">
          <h2>Live orders</h2>
          <div className="actions">
            <button className="btn ghost">
              <Icon.Filter style={{ width: 14, height: 14 }} /> All states
            </button>
            <button className="btn primary">
              <Icon.Plus style={{ width: 14, height: 14 }} /> New order
            </button>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '140px 80px 1fr 120px 100px 140px 100px',
            padding: '12px 18px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--hairline)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-quiet)',
            fontWeight: 600,
          }}>
            <div>Order</div>
            <div>Table</div>
            <div>Server</div>
            <div>Items</div>
            <div>Age</div>
            <div>State</div>
            <div className="text-right">Total</div>
          </div>
          {ORDERS.map((o) => (
            <div key={o.id} style={{
              display: 'grid',
              gridTemplateColumns: '140px 80px 1fr 120px 100px 140px 100px',
              padding: '14px 18px',
              borderBottom: '1px solid var(--hairline)',
              alignItems: 'center',
              fontSize: 14,
            }}>
              <div className="mono">{o.id}</div>
              <div style={{ fontWeight: 600 }}>{o.table}</div>
              <div>{o.server}</div>
              <div className="muted">{o.items} items</div>
              <div className="mono" style={{ color: o.state === 'overdue' ? 'var(--urgent)' : undefined }}>
                {o.minutes}m
              </div>
              <div>
                <span style={{
                  padding: '4px 9px',
                  borderRadius: 999,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: `color-mix(in oklab, ${STATE_COLOR[o.state]} 18%, transparent)`,
                  color: STATE_COLOR[o.state],
                  border: `1px solid color-mix(in oklab, ${STATE_COLOR[o.state]} 35%, transparent)`,
                }}>
                  {o.state}
                </span>
              </div>
              <div className="text-right mono" style={{ fontWeight: 600 }}>
                ₹{o.total.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
