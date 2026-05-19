// LoomPOS — Loom Cloud Map: animated network of nodes.

import { useEffect, useState } from 'react';
import { EVENTS } from '../core/data';

type NodeType = 'hub' | 'kitchen' | 'pos' | 'cash' | 'inv' | 'ai' | 'device';

interface CloudNode {
  id: string;
  name: string;
  type: NodeType;
  angle: number;
  r?: number;
}

const CLOUD_NODES: CloudNode[] = [
  { id: 'hub',     name: 'Loom Cloud',  type: 'hub',     angle: 0,   r: 0 },
  { id: 'kds-01',  name: 'KDS · Hot',   type: 'kitchen', angle: 0   },
  { id: 'kds-02',  name: 'KDS · Cold',  type: 'kitchen', angle: 36  },
  { id: 'pos-01',  name: 'POS · Bar',   type: 'pos',     angle: 72  },
  { id: 'pos-02',  name: 'POS · Floor', type: 'pos',     angle: 108 },
  { id: 'pos-03',  name: 'POS · Patio', type: 'pos',     angle: 144 },
  { id: 'cash',    name: 'Cashier',     type: 'cash',    angle: 180 },
  { id: 'inv',     name: 'Inventory',   type: 'inv',     angle: 216 },
  { id: 'ai',      name: 'Loom AI',     type: 'ai',      angle: 252 },
  { id: 'printer', name: 'Pass Printer',type: 'device',  angle: 288 },
  { id: 'auth',    name: 'Identity',    type: 'device',  angle: 324 },
];

const NODE_COLOR: Record<NodeType, string> = {
  hub:     'var(--brand-bright)',
  kitchen: 'var(--crit)',
  pos:     'var(--info)',
  cash:    'var(--warn)',
  inv:     'var(--route)',
  ai:      'var(--brand)',
  device:  'var(--text-muted)',
};

export function LoomCloud() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1100);
    return () => clearInterval(t);
  }, []);

  const activeIdx = tick % (CLOUD_NODES.length - 1);
  const CX = 500, CY = 300, R = 220;

  const nodes = CLOUD_NODES.map((n) => {
    if (n.id === 'hub') return { ...n, x: CX, y: CY };
    const a = (n.angle - 90) * Math.PI / 180;
    return { ...n, x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
  });

  return (
    <div className="cloud-wrap">
      <div className="cloud-canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="hub-glow" cx="0.5" cy="0.5">
              <stop offset="0%"   stopColor="var(--brand-bright)" stopOpacity={0.6} />
              <stop offset="50%"  stopColor="var(--brand-bright)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--brand-bright)" stopOpacity={0} />
            </radialGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'cloud-rotate 60s linear infinite' }}>
            <circle cx={CX} cy={CY} r={R}      fill="none" stroke="var(--hairline-strong)" strokeWidth={0.8} strokeDasharray="2 6" />
            <circle cx={CX} cy={CY} r={R - 40} fill="none" stroke="var(--hairline)"        strokeWidth={0.6} strokeDasharray="2 8" />
            <circle cx={CX} cy={CY} r={R + 40} fill="none" stroke="var(--hairline)"        strokeWidth={0.6} strokeDasharray="2 10" />
          </g>

          <circle cx={CX} cy={CY} r={140} fill="url(#hub-glow)" />

          {nodes.slice(1).map((n, i) => {
            const active = i === activeIdx;
            return (
              <g key={'l' + n.id}>
                <line
                  x1={CX} y1={CY} x2={n.x} y2={n.y}
                  stroke={active ? NODE_COLOR[n.type] : 'var(--hairline-strong)'}
                  strokeWidth={active ? 1.6 : 0.6}
                  strokeDasharray={active ? '0' : '3 4'}
                  opacity={active ? 0.9 : 0.55}
                  style={{ transition: 'all 280ms ease' }}
                />
                <line
                  x1={CX} y1={CY} x2={n.x} y2={n.y}
                  stroke={NODE_COLOR[n.type]}
                  strokeWidth={0.8}
                  strokeDasharray="3 12"
                  opacity={0.6}
                  style={{ animation: 'thread-flow 6s linear infinite' }}
                />
              </g>
            );
          })}

          {nodes.map((n) => {
            const isHub = n.id === 'hub';
            const r = isHub ? 36 : 26;
            const color = NODE_COLOR[n.type];
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                {isHub && (
                  <>
                    <circle r={r + 18} fill="none" stroke={color} strokeWidth={0.8} opacity={0.4}
                            style={{ animation: 'breathe 3s ease-in-out infinite' }} />
                    <circle r={r + 10} fill="none" stroke={color} strokeWidth={1.2} opacity={0.7} />
                  </>
                )}
                <circle r={r} fill="var(--surface-1)" stroke={color} strokeWidth={isHub ? 2 : 1.4} />
                <circle r={r - 6}
                        fill={isHub ? color : `color-mix(in oklab, ${color} 18%, var(--surface-1))`}
                        opacity={isHub ? 0.95 : 1} />
                <text
                  textAnchor="middle" dominantBaseline="middle" y={-2}
                  fontSize={isHub ? 11 : 9.5} fontWeight={700}
                  fill={isHub ? 'var(--ink)' : 'var(--text)'}
                  style={{ fontFamily: 'Inter' }}
                >
                  {isHub ? 'LOOM' : n.type.toUpperCase()}
                </text>
                <text
                  textAnchor="middle" dominantBaseline="middle"
                  y={isHub ? 10 : 9}
                  fontSize={isHub ? 8.5 : 7.5} fontWeight={600}
                  fill={isHub ? 'var(--ink)' : 'var(--text-muted)'}
                  opacity={isHub ? 0.6 : 1}
                  style={{ fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}
                >
                  {isHub ? 'CLOUD' : n.id}
                </text>
                {!isHub && (
                  <text
                    textAnchor="middle" y={r + 14}
                    fontSize={10} fontWeight={600}
                    fill="var(--text)"
                    style={{ fontFamily: 'Inter' }}
                  >
                    {n.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8 }}>
          <CloudStat label="Nodes online" value="11/11" tone="ok" />
          <CloudStat label="Ping"         value="4.5s" />
          <CloudStat label="Last sync"    value="2s ago" />
          <CloudStat label="Events/min"   value="14" />
        </div>

        <div style={{
          position: 'absolute', bottom: 20, left: 20, right: 20,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <div className="card" style={{ padding: 14 }}>
            <div className="t-eyebrow muted" style={{ marginBottom: 8 }}>Live Event Stream</div>
            <div className="col" style={{ gap: 4 }}>
              {EVENTS.slice(0, 4).map((e, i) => (
                <div key={i} className="t-sm" style={{
                  display: 'flex', gap: 10,
                  fontFamily: 'JetBrains Mono', fontSize: 11.5,
                }}>
                  <span className="quiet">{e.ts}</span>
                  <span style={{ flex: 1 }}>{e.text}</span>
                  <span className="quiet">{e.src}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div className="t-eyebrow muted" style={{ marginBottom: 8 }}>Devices</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                'iPad-Air-01','iPad-Air-02','iPad-Mini-03','iPhone-15-04',
                'iPhone-15-05','KDS-Display-A','KDS-Display-B','Star-TSP',
              ].map((d) => (
                <div key={d} className="t-cap" style={{
                  padding: '6px 8px',
                  background: 'var(--surface-2)',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 10,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: 999,
                    background: 'var(--brand-bright)',
                    boxShadow: '0 0 6px var(--brand-glow)',
                  }}></span>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cloud-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes breathe { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.65; transform: scale(1.08); } }
        @keyframes thread-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -90; } }
      `}</style>
    </div>
  );
}

function CloudStat({ label, value, tone }: { label: string; value: string; tone?: 'ok' }) {
  return (
    <div className="card" style={{ padding: '8px 12px', minWidth: 120 }}>
      <div className="t-eyebrow muted" style={{ fontSize: 9 }}>{label}</div>
      <div className="t-sub mt-2" style={{
        fontVariantNumeric: 'tabular-nums',
        color: tone === 'ok' ? 'var(--brand-bright)' : undefined,
      }}>
        {value}
      </div>
    </div>
  );
}
