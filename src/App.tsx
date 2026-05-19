// LoomPOS — Root: rail + topbar + active surface, employee picker overlay.

import { useEffect, useState } from 'react';
import { ThemeProvider } from './design/primitives';
import { Rail, TopBar, EmployeePicker } from './features/Shell';
import { FloorMap } from './features/FloorMap';
import { KDS } from './features/KDS';
import { Pulse } from './features/Pulse';
import { LoomCloud } from './features/LoomCloud';
import { Billing } from './features/Billing';
import { Inventory } from './features/Inventory';
import { Orders } from './features/Orders';
import { EMPLOYEES, ROLES, type Employee, type PageId, type RoleName } from './core/data';

const TITLES: Record<PageId, { title: string; crumb: string }> = {
  floor:     { title: 'Floor Map',       crumb: 'Server · Floor' },
  orders:    { title: 'Orders',          crumb: 'Server · Orders' },
  kds:       { title: 'Kitchen Display', crumb: 'Kitchen · Live tickets' },
  inventory: { title: 'Inventory',       crumb: 'Kitchen · Stock & 86 risk' },
  pulse:     { title: 'Pulse',           crumb: 'Manager · Live operations' },
  loom:      { title: 'Loom Cloud',      crumb: 'Network · System map' },
  billing:   { title: 'Billing',         crumb: 'Cashier · Settle' },
};

function firstAccessible(role: RoleName): PageId {
  return ROLES[role]?.access[0] ?? 'floor';
}

export default function App() {
  const [employee, setEmployee] = useState<Employee>(() => {
    try {
      const id = localStorage.getItem('loom-emp');
      const e = EMPLOYEES.find((x) => x.id === id);
      return e ?? EMPLOYEES[0];
    } catch {
      return EMPLOYEES[0];
    }
  });
  const [active, setActive] = useState<PageId>(() => firstAccessible(employee.role));
  const [pickerOpen, setPickerOpen] = useState(false);

  const access = ROLES[employee.role]?.access ?? [];

  useEffect(() => {
    if (!access.includes(active)) setActive(firstAccessible(employee.role));
    try { localStorage.setItem('loom-emp', employee.id); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id]);

  const handlePick = (e: Employee) => {
    setEmployee(e);
    setActive(firstAccessible(e.role));
    setPickerOpen(false);
  };

  const meta = TITLES[active] ?? TITLES.floor;
  const accent = ROLES[employee.role]?.accent ?? 'var(--brand)';

  return (
    <ThemeProvider>
      <div className="app">
        <div className="warp-top live" style={{ background: accent }} />
        <Rail
          active={active}
          onChange={setActive}
          employee={employee}
          onSwitchEmployee={() => setPickerOpen(true)}
        />
        <div className="main">
          <TopBar title={meta.title} crumb={meta.crumb} />
          {active === 'floor'     && <FloorMap />}
          {active === 'kds'       && <KDS />}
          {active === 'inventory' && <Inventory />}
          {active === 'pulse'     && <Pulse />}
          {active === 'loom'      && <LoomCloud />}
          {active === 'billing'   && <Billing />}
          {active === 'orders'    && <Orders />}
        </div>
        {pickerOpen && (
          <EmployeePicker
            current={employee}
            onPick={handlePick}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
