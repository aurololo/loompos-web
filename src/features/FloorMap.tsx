// LoomPOS — Floor Map. Architectural floorplan with section overlays.

import { useMemo, useState, type CSSProperties } from 'react';
import { Icon } from '../design/icons';
import {
  TABLES, SECTIONS, SAMPLE_ORDER,
  type FloorTable, type TableState
} from '../core/data';

const STATE_LABEL: Record<TableState, string> = {
  open: 'Open', seated: 'Seated', ordered: 'Ordered',
  served: 'Served', bill: 'Bill', overdue: 'Overdue',
};

const STATE_COLOR: Record<TableState, string> = {
  open:    'var(--brand)',
  seated:  'var(--info)',
  ordered: 'var(--warn)',
  served:  'var(--route)',
  bill:    'var(--crit)',
  overdue: 'var(--urgent)',
};

export function FloorMap() {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string>('5');

  const filtered = filter === 'all' ? TABLES : TABLES.filter((t) => t.section === filter);

  const stats = useMemo(() => {
    const total = TABLES.length;
    const occupied = TABLES.filter((t) => t.state !== 'open').length;
    const overdue = TABLES.filter((t) => t.state === 'overdue').length;
    const cover = TABLES.reduce((s, t) => s + (t.party || 0), 0);
    return { total, occupied, overdue, cover, occRate: Math.round((occupied / total) * 100) };
  }, []);

  const selectedTable = TABLES.find((t) => t.id === selected) ?? null;

  return (
    <div className="floor-wrap">
      <div className="floor-header">
        <div className="section-filter">
          {[{ id: 'all', name: 'All sections' }, ...SECTIONS].map((s) => (
            <button
              key={s.id}
              className={filter === s.id ? 'on' : ''}
              onClick={() => setFilter(s.id)}
            >
              {s.name || s.id}
            </button>
          ))}
        </div>
        <div className="legend">
          {Object.entries(STATE_COLOR).map(([k, c]) => (
            <div className="legend-item" key={k}>
              <span className="legend-dot" style={{ background: c }}></span>
              {STATE_LABEL[k as TableState]}
            </div>
          ))}
        </div>
      </div>

      <div className="floor-grid">
        <FloorCanvas tables={filtered} selected={selected} onSelect={setSelected} />
        <FloorSide stats={stats} table={selectedTable} />
      </div>
    </div>
  );
}

function FloorCanvas({
  tables, selected, onSelect,
}: {
  tables: FloorTable[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="floor-canvas">
      <svg viewBox="0 0 980 420" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="floor-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill="var(--floor-grid)" />
          </pattern>
          <pattern id="patio-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--floor-grid)" strokeWidth={3} />
          </pattern>
          <pattern id="bar-tiles" patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill="transparent" />
            <line x1="0" y1="0" x2="12" y2="0" stroke="var(--floor-grid)" strokeWidth={0.8} />
            <line x1="0" y1="0" x2="0" y2="12" stroke="var(--floor-grid)" strokeWidth={0.8} />
          </pattern>
        </defs>

        <rect width="980" height="420" fill="url(#floor-dots)" />

        {/* Patio */}
        <rect x="30" y="40" width="220" height="360" fill="url(#patio-hatch)" stroke="var(--floor-wall)" strokeWidth={1.2} strokeDasharray="6 4" rx={2} />
        <text x="140" y="32" textAnchor="middle" fill="var(--floor-section-label)" fontSize="9.5" fontWeight={600} letterSpacing="0.24em">PATIO · OUTDOOR</text>

        {/* Main dining */}
        <rect x="270" y="40" width="440" height="360" fill="var(--floor-section)" stroke="var(--floor-wall)" strokeWidth={1.2} rx={2} />
        <text x="490" y="32" textAnchor="middle" fill="var(--floor-section-label)" fontSize="9.5" fontWeight={600} letterSpacing="0.24em">MAIN DINING</text>

        {/* Bar */}
        <rect x="730" y="40" width="220" height="220" fill="url(#bar-tiles)" stroke="var(--floor-wall)" strokeWidth={1.2} rx={2} />
        <text x="840" y="32" textAnchor="middle" fill="var(--floor-section-label)" fontSize="9.5" fontWeight={600} letterSpacing="0.24em">BAR · STOOLS</text>
        <rect x="745" y="55" width="220" height="24" fill="var(--floor-section)" stroke="var(--floor-wall)" strokeWidth={1} rx={3} transform="translate(-15,0)" />
        <text x="840" y="71" textAnchor="middle" fill="var(--floor-section-label)" fontSize="8" letterSpacing="0.18em" fontWeight={600}>— BAR COUNTER —</text>
        <rect x="730" y="40" width="220" height="14" fill="none" stroke="var(--floor-wall)" strokeWidth={0.8} strokeDasharray="2 3" />

        {/* Booths */}
        <rect x="730" y="280" width="220" height="120" fill="var(--floor-section)" stroke="var(--floor-wall)" strokeWidth={1.2} rx={2} />
        <text x="840" y="272" textAnchor="middle" fill="var(--floor-section-label)" fontSize="9.5" fontWeight={600} letterSpacing="0.24em">PRIVATE BOOTHS</text>

        {/* Doorway */}
        <line x1="720" y1="100" x2="720" y2="200" stroke="var(--floor-wall)" strokeWidth={1.2} />
        <line x1="720" y1="40"  x2="720" y2="100" stroke="var(--canvas)"      strokeWidth={2.5} />
        <line x1="720" y1="200" x2="720" y2="260" stroke="var(--canvas)"      strokeWidth={2.5} />
        <path d="M 718 100 Q 700 110 700 130" fill="none" stroke="var(--floor-wall)" strokeWidth={0.6} strokeDasharray="2 2" />

        {/* Kitchen pass */}
        <rect x="270" y="40" width="440" height="14" fill="none" stroke="var(--floor-wall)" strokeWidth={0.8} strokeDasharray="2 3" />
        <text x="490" y="50" textAnchor="middle" fill="var(--floor-section-label)" fontSize="7.5" letterSpacing="0.2em" fontWeight={600}>→ KITCHEN PASS</text>

        {/* Entrance */}
        <g transform="translate(280, 408)">
          <line x1="0" y1="0" x2="0" y2="-10" stroke="var(--floor-section-label)" strokeWidth={1} />
          <polyline points="-3,-7 0,-10 3,-7" fill="none" stroke="var(--floor-section-label)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
          <text x="8" y="-2" fill="var(--floor-section-label)" fontSize="7.5" letterSpacing="0.18em" fontWeight={600}>ENTRANCE</text>
        </g>

        {/* Decorative divider */}
        <line x1="260" y1="55" x2="260" y2="385" stroke="var(--floor-wall)" strokeWidth={0.8} strokeDasharray="3 4" />

        {tables.map((t) => (
          <Table key={t.id} t={t} selected={selected === t.id} onClick={() => onSelect(t.id)} />
        ))}
      </svg>
    </div>
  );
}

function Table({ t, selected, onClick }: { t: FloorTable; selected: boolean; onClick: () => void }) {
  const color = STATE_COLOR[t.state];
  const isPulse = t.state === 'overdue';
  const cls = `floor-table t-state-${t.state} ${selected ? 'selected' : ''} ${isPulse ? 'pulse' : ''}`;
  const cx = t.x + t.w / 2;
  const cy = t.y + t.h / 2;
  const labelY = t.shape === 'rect' || t.shape === 'booth' ? cy - 2 : cy - 1;
  const stateY = t.shape === 'rect' || t.shape === 'booth' ? cy + 12 : cy + 11;
  const isStool = t.shape === 'stool';
  const isOpen = t.state === 'open';
  const stroke = isOpen ? 'var(--floor-table-border)' : color;
  const fill = isOpen ? 'var(--floor-table-bg)' : color;
  const fillOp = isOpen ? 1 : 0.22;
  const strokeWidth = isOpen ? 1 : 1.6;

  return (
    <g className={cls} onClick={onClick}>
      {!isStool && t.shape !== 'rect' && t.shape !== 'booth' && <Chairs t={t} />}

      {t.shape === 'rect' && (
        <>
          <rect x={t.x - 3} y={t.y - 8} width={t.w + 6} height={6} fill="var(--floor-table-bg)" stroke="var(--floor-table-border)" strokeWidth={0.6} rx={2} />
          <rect x={t.x - 3} y={t.y + t.h + 2} width={t.w + 6} height={6} fill="var(--floor-table-bg)" stroke="var(--floor-table-border)" strokeWidth={0.6} rx={2} />
        </>
      )}
      {t.shape === 'booth' && (
        <path
          d={`M ${t.x - 6} ${t.y + t.h + 4} L ${t.x - 6} ${t.y + 8} A 10 10 0 0 1 ${t.x + 4} ${t.y - 2} L ${t.x + t.w - 4} ${t.y - 2} A 10 10 0 0 1 ${t.x + t.w + 6} ${t.y + 8} L ${t.x + t.w + 6} ${t.y + t.h + 4} Z`}
          fill="var(--floor-section)"
          stroke="var(--floor-table-border)"
          strokeWidth={0.8}
        />
      )}

      {t.shape === 'round' && (
        <circle className="t-shape" cx={cx} cy={cy} r={t.w / 2} fill={fill} fillOpacity={fillOp} stroke={stroke} strokeWidth={strokeWidth} />
      )}
      {(t.shape === 'square' || t.shape === 'rect' || t.shape === 'booth') && (
        <rect className="t-shape" x={t.x} y={t.y} width={t.w} height={t.h}
              rx={t.shape === 'square' ? 6 : 4}
              fill={fill} fillOpacity={fillOp} stroke={stroke} strokeWidth={strokeWidth} />
      )}
      {t.shape === 'stool' && (
        <>
          <circle cx={cx} cy={cy} r={t.w / 2 - 2} fill="var(--floor-table-bg)" stroke="var(--floor-table-border)" strokeWidth={0.8} />
          <circle className="t-shape" cx={cx} cy={cy} r={t.w / 2 - 5}
                  fill={isOpen ? 'var(--floor-table-bg)' : color}
                  fillOpacity={isOpen ? 1 : 0.85}
                  stroke={isOpen ? 'var(--floor-table-border)' : color}
                  strokeWidth={isOpen ? 0.8 : 1.2} />
        </>
      )}

      {!isStool ? (
        <>
          <text
            x={cx} y={labelY}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={t.shape === 'rect' ? 14 : 15}
            fontWeight={700}
            fill={isOpen ? 'var(--floor-table-text)' : 'var(--text)'}
            style={{ fontFamily: 'Inter', letterSpacing: '-0.01em' }}
          >
            {t.name}
          </text>
          {!isOpen && (
            <text
              x={cx} y={stateY}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="6.5" fontWeight={700}
              fill="var(--text)" opacity={0.78}
              style={{ letterSpacing: '0.16em', fontFamily: 'Inter' }}
            >
              {STATE_LABEL[t.state].toUpperCase()}{t.party ? ` · ${t.party}` : ''}
            </text>
          )}
          {isOpen && (
            <text
              x={cx} y={stateY}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="6" fontWeight={600}
              fill="var(--floor-section-label)"
              style={{ letterSpacing: '0.18em', fontFamily: 'Inter' }}
            >
              {t.seats} SEAT{t.seats > 1 ? 'S' : ''}
            </text>
          )}
        </>
      ) : (
        <text
          x={cx} y={cy + 0.5}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="7.5" fontWeight={700}
          fill={isOpen ? 'var(--floor-table-text)' : 'var(--text)'}
          style={{ fontFamily: 'Inter' }}
        >
          {t.name.replace('B', '')}
        </text>
      )}
    </g>
  );
}

function Chairs({ t }: { t: FloorTable }) {
  const cx = t.x + t.w / 2;
  const cy = t.y + t.h / 2;
  const ch = 'var(--floor-table-bg)';
  const cs = 'var(--floor-table-border)';
  const r = 4.5;
  if (t.shape === 'round') {
    const seats: Array<[number, number]> = [
      [cx, t.y - r - 2],
      [t.x + t.w + r + 2, cy],
      [cx, t.y + t.h + r + 2],
      [t.x - r - 2, cy],
    ];
    return (
      <>
        {seats.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={ch} stroke={cs} strokeWidth={0.6} />
        ))}
      </>
    );
  }
  if (t.shape === 'square') {
    const seatsPerSide = t.seats > 4 ? 2 : 1;
    const offsets = (n: number) => (n === 1 ? [0] : [-0.25, 0.25]);
    const chairs: Array<[number, number]> = [];
    offsets(seatsPerSide).forEach((o) => {
      chairs.push([cx + o * t.w, t.y - r - 2]);
      chairs.push([cx + o * t.w, t.y + t.h + r + 2]);
      chairs.push([t.x - r - 2, cy + o * t.h]);
      chairs.push([t.x + t.w + r + 2, cy + o * t.h]);
    });
    return (
      <>
        {chairs.map(([x, y], i) => (
          <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1.5} fill={ch} stroke={cs} strokeWidth={0.6} />
        ))}
      </>
    );
  }
  return null;
}

interface Stats { total: number; occupied: number; overdue: number; cover: number; occRate: number }

function FloorSide({ stats, table }: { stats: Stats; table: FloorTable | null }) {
  return (
    <div className="floor-side">
      <div className="floor-stats">
        <div className="floor-stat">
          <div className="v">
            {stats.occupied}<span className="muted" style={{ fontSize: 14 }}>/{stats.total}</span>
          </div>
          <div className="l">Tables</div>
        </div>
        <div className="floor-stat">
          <div className="v">{stats.cover}</div>
          <div className="l">Covers</div>
        </div>
        <div className="floor-stat">
          <div className="v" style={{ color: stats.overdue ? 'var(--urgent)' : undefined }}>{stats.overdue}</div>
          <div className="l">Overdue</div>
        </div>
      </div>
      {table ? <TableDetail t={table} /> : <EmptyDetail />}
    </div>
  );
}

function TableDetail({ t }: { t: FloorTable }) {
  const color = STATE_COLOR[t.state];
  const isOpen = t.state === 'open';
  const style = { ['--st' as never]: color } as CSSProperties;
  return (
    <div className="table-detail" style={style}>
      <div className="td-head">
        <div>
          <div className="t-eyebrow muted" style={{ marginBottom: 4 }}>Table</div>
          <div className="td-num">{t.name}</div>
          <div className="td-meta">{capitalize(t.section)} · {t.seats} seat{t.seats > 1 ? 's' : ''}</div>
        </div>
        <div className="state-badge">{STATE_LABEL[t.state]}</div>
      </div>

      {isOpen ? (
        <div className="td-list" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', flexDirection: 'column',
          gap: 8, textAlign: 'center'
        }}>
          <Icon.Plus style={{ width: 24, height: 24 }} />
          <div className="t-sm">Table available.</div>
          <div className="t-cap quiet">Tap "Seat" to start a new check.</div>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            padding: '14px 0', borderBottom: '1px solid var(--hairline)'
          }}>
            <DetailKV k="Server" v={t.server || '—'} />
            <DetailKV k="Party"  v={t.party || 0} />
            <DetailKV k="Open"   v={`${t.openMin}m`} />
            <DetailKV k="Items"  v={SAMPLE_ORDER.length} />
          </div>
          <div className="td-list">
            {SAMPLE_ORDER.map((it, i) => (
              <div className="td-list-row" key={i}>
                <span>{it.qty} × {it.name}</span>
                <span className="mono">₹{it.price}</span>
              </div>
            ))}
          </div>
          <div className="td-total">
            <div className="l">Subtotal</div>
            <div className="v">₹{(t.total || 0).toLocaleString('en-IN')}</div>
          </div>
        </>
      )}

      <div className="td-foot">
        {isOpen ? (
          <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Icon.Plus style={{ width: 14, height: 14 }} /> Seat &amp; open check
          </button>
        ) : (
          <>
            <button className="btn">Add item</button>
            <button className="btn primary">
              <Icon.Receipt style={{ width: 14, height: 14 }} /> Fire / Bill
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DetailKV({ k, v }: { k: string; v: string | number }) {
  return (
    <div>
      <div className="t-eyebrow muted" style={{ marginBottom: 2 }}>{k}</div>
      <div className="t-sub" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</div>
    </div>
  );
}

function EmptyDetail() {
  return <div className="table-detail">Select a table</div>;
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
