// LoomPOS — Theme, brand mark, sparkline, KPI primitive.

import {
  createContext, useContext, useEffect, useState,
  type ReactNode, type CSSProperties
} from 'react';
import { Icon } from './icons';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('loom-theme') as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('loom-theme', theme); } catch {}
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="theme-toggle">
      <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
        <Icon.Moon style={{ width: 12, height: 12 }} />
        Dark
      </button>
      <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
        <Icon.Sun style={{ width: 12, height: 12 }} />
        Light
      </button>
    </div>
  );
}

// Brand mark — the LoomPOS basket-weave logo (PNG sourced from /public/logo.png).
// Wrapped in a dark squircle "chip" so the white weft bars stay visible in
// light mode where the rail background is also white.
export function LoomMark({ size = 28, framed = true }: { size?: number; framed?: boolean }) {
  const padding = framed ? Math.round(size * 0.10) : 0;
  return (
    <div
      className="loom-mark"
      style={{
        width: size,
        height: size,
        background: framed ? '#0F0F10' : 'transparent',
        borderRadius: framed ? Math.round(size * 0.22) : 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: framed ? 'inset 0 0 0 0.6px rgba(255,255,255,0.10)' : 'none',
      }}
    >
      <img
        src="/logo.png"
        alt="LoomPOS"
        width={size - padding * 2}
        height={size - padding * 2}
        style={{ display: 'block', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  );
}

interface SparkProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}
export function Sparkline({ data, color, width = 80, height = 28, fill = false }: SparkProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * (width - 2) + 1;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  });
  const path = `M ${pts.join(' L ')}`;
  const stroke = color || 'var(--brand)';
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && (
        <path
          d={`${path} L ${width - 1},${height} L 1,${height} Z`}
          fill={stroke}
          opacity={0.18}
        />
      )}
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface KPIProps {
  label: string;
  value: string;
  sub?: string;
  hero?: boolean;
  delta?: string;
  sparkData?: number[];
  sparkColor?: string;
  style?: CSSProperties;
}
export function KPI({ label, value, sub, hero = false, delta, sparkData, sparkColor, style }: KPIProps) {
  return (
    <div
      className="hero-card"
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 160, ...style }}
    >
      <div className="t-eyebrow muted">{label}</div>
      <div className={hero ? 't-hero' : 't-xl'} style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="row items-center gap-3">
        {delta && (
          <div className={`delta ${delta.startsWith('-') ? 'down' : 'up'}`}>{delta}</div>
        )}
        {sub && <div className="muted t-sm">{sub}</div>}
      </div>
      {sparkData && (
        <div className="mt-2">
          <Sparkline data={sparkData} color={sparkColor} width={260} height={36} fill />
        </div>
      )}
    </div>
  );
}
