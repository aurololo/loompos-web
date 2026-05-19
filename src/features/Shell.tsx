// LoomPOS — Shell: rail + topbar + employee switcher.

import { useEffect, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../design/icons';
import { LoomMark, ThemeToggle } from '../design/primitives';
import { ROLES, EMPLOYEES, type Employee, type PageId } from '../core/data';

interface RailItem {
  id: PageId;
  name: string;
  icon: IconName;
  badge?: string;
}

interface RailSection {
  label: string;
  items: RailItem[];
}

const RAIL_SECTIONS: RailSection[] = [
  {
    label: 'Floor',
    items: [
      { id: 'floor',     name: 'Floor Map',  icon: 'Map',        badge: '14' },
      { id: 'orders',    name: 'Orders',     icon: 'Receipt',    badge: '8' },
    ],
  },
  {
    label: 'Kitchen',
    items: [
      { id: 'kds',       name: 'KDS',        icon: 'Flame',      badge: '8' },
      { id: 'inventory', name: 'Inventory',  icon: 'Boxes',      badge: '4' },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { id: 'pulse',     name: 'Pulse',      icon: 'Activity' },
      { id: 'loom',      name: 'Loom Cloud', icon: 'Wifi' },
    ],
  },
  {
    label: 'Cashier',
    items: [
      { id: 'billing',   name: 'Billing',    icon: 'CreditCard', badge: '3' },
    ],
  },
];

interface RailProps {
  active: PageId;
  onChange: (p: PageId) => void;
  employee: Employee;
  onSwitchEmployee: () => void;
}

export function Rail({ active, onChange, employee, onSwitchEmployee }: RailProps) {
  const role = ROLES[employee.role];
  const access = role?.access ?? [];
  return (
    <div className="rail">
      <div className="rail-brand">
        <div className="mark"><LoomMark size={30} /></div>
        <div className="word">LoomPOS</div>
      </div>

      <button className="rail-user-btn" onClick={onSwitchEmployee} title="Switch employee">
        <div className="avatar-row">
          <div
            className="avatar"
            style={{ background: role?.accent, color: 'var(--ink)' }}
          >
            {employee.initial}
          </div>
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, display: 'flex',
              alignItems: 'center', gap: 6
            }}>
              {employee.name}
              <Icon.ChevronDown style={{ width: 12, height: 12, opacity: 0.5 }} />
            </div>
            <div className="t-cap muted" style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {employee.shift}
            </div>
          </div>
        </div>
        <div
          className="role-chip"
          style={{
            color: role?.accent,
            borderColor: `color-mix(in oklab, ${role?.accent} 40%, transparent)`,
            background: `color-mix(in oklab, ${role?.accent} 14%, transparent)`,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />
          {employee.role}
        </div>
      </button>

      {RAIL_SECTIONS.map((sec) => {
        const allowedItems = sec.items.filter((it) => access.includes(it.id));
        if (allowedItems.length === 0) return null;
        return (
          <div className="rail-section" key={sec.label}>
            <div className="rail-section-label">{sec.label}</div>
            {sec.items.map((it) => {
              const Ic = Icon[it.icon];
              const allowed = access.includes(it.id);
              if (!allowed) {
                return (
                  <div
                    key={it.id}
                    className="rail-item locked"
                    title={`${employee.role} can't access ${it.name}`}
                  >
                    <Ic className="icon" />
                    <span>{it.name}</span>
                    <Icon.X className="lock-mark" />
                  </div>
                );
              }
              return (
                <button
                  key={it.id}
                  className={'rail-item ' + (active === it.id ? 'active' : '')}
                  onClick={() => onChange(it.id)}
                >
                  <Ic className="icon" />
                  <span>{it.name}</span>
                  {it.badge && <span className="badge">{it.badge}</span>}
                </button>
              );
            })}
          </div>
        );
      })}

      <div className="rail-bottom">
        <div className="cloud-strip">
          <div className="pulse-dot"></div>
          <div className="col" style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 11 }}>
              Loom Cloud · live
            </div>
            <div className="t-cap" style={{ marginTop: 2 }}>12 nodes · 4.5s ping</div>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}

interface TopBarProps {
  title: string;
  crumb: string;
  right?: ReactNode;
}

export function TopBar({ title, crumb, right }: TopBarProps) {
  const [now, setNow] = useState(() => fmtTime(new Date()));
  useEffect(() => {
    const t = setInterval(() => setNow(fmtTime(new Date())), 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="topbar">
      <div className="col">
        <div className="crumb">{crumb}</div>
        <h1>{title}</h1>
      </div>
      <div className="filler"></div>
      <div className="live-badge">
        <span className="pulse-dot"></span>
        LIVE · {now}
      </div>
      <button className="icon-btn"><Icon.Search style={{ width: 16, height: 16 }} /></button>
      <button className="icon-btn" style={{ position: 'relative' }}>
        <Icon.Bell style={{ width: 16, height: 16 }} />
        <span style={{
          position: 'absolute', top: 6, right: 7,
          width: 7, height: 7, borderRadius: 999, background: 'var(--crit)'
        }}></span>
      </button>
      {right}
    </div>
  );
}

interface PickerProps {
  current: Employee;
  onPick: (e: Employee) => void;
  onClose: () => void;
}

export function EmployeePicker({ current, onPick, onClose }: PickerProps) {
  return (
    <div className="emp-overlay" onClick={onClose}>
      <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="emp-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LoomMark size={36} />
            <div>
              <div className="t-eyebrow muted">Sign in as</div>
              <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600, letterSpacing: '-0.012em' }}>
                Pick your handle
              </h2>
            </div>
          </div>
          <button className="emp-close" onClick={onClose}>
            <Icon.X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div className="emp-grid">
          {EMPLOYEES.map((e) => {
            const role = ROLES[e.role];
            const isCurrent = e.id === current.id;
            return (
              <button
                key={e.id}
                className={'emp-card ' + (isCurrent ? 'current' : '')}
                onClick={() => onPick(e)}
                style={{ ['--accent' as never]: role?.accent }}
              >
                <div className="emp-avatar" style={{ background: role?.accent }}>{e.initial}</div>
                <div className="emp-info">
                  <div className="emp-name">{e.name}</div>
                  <div className="emp-role">{e.role}</div>
                  <div className="emp-meta">{e.shift} · {e.station}</div>
                </div>
                <div className="emp-access">
                  {role?.access.length} <span style={{ opacity: 0.5 }}>access</span>
                </div>
                {isCurrent && (
                  <div className="emp-check">
                    <Icon.Check style={{ width: 14, height: 14 }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="emp-foot">
          <div className="t-sm muted">
            Each role only sees the surfaces they need. Switching does not require a PIN in demo mode.
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
