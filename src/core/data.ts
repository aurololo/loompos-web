// LoomPOS — Mock data for the redesign. Typed module replacing window.LoomData.

export type PageId =
  | 'floor' | 'orders' | 'kds' | 'inventory'
  | 'pulse' | 'loom' | 'billing';

export type RoleName =
  | 'Server' | 'Bartender' | 'Line Cook'
  | 'Cashier' | 'Supervisor' | 'Manager';

export type TableShape = 'round' | 'square' | 'rect' | 'booth' | 'stool';

export type TableState =
  | 'open' | 'seated' | 'ordered' | 'served' | 'bill' | 'overdue';

export interface FloorSection {
  id: string;
  name: string;
  bounds: { x: number; y: number; w: number; h: number };
}

export interface FloorTable {
  id: string;
  section: string;
  shape: TableShape;
  x: number;
  y: number;
  w: number;
  h: number;
  seats: number;
  state: TableState;
  name: string;
  party?: number;
  openMin?: number;
  server?: string;
  total?: number;
}

export interface SampleOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface TicketItem {
  qty: number;
  name: string;
  mod?: string;
}

export interface KitchenTicket {
  id: string;
  table: string;
  ageSec: number;
  items: TicketItem[];
  status: 'firing' | 'cooking';
}

export interface Station {
  name: string;
  load: number;
  count: number;
}

export interface CloudEvent {
  ts: string;
  text: string;
  src: string;
}

export interface Employee {
  id: string;
  name: string;
  initial: string;
  role: RoleName;
  shift: string;
  station: string;
}

export interface RoleDef {
  access: PageId[];
  accent: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  cat: string;
  unit: string;
  par: number;
  current: number;
  expiresInH: number;
  supplier: string;
  station: string;
}

export const SECTIONS: FloorSection[] = [
  { id: 'patio', name: 'Patio',  bounds: { x: 30,  y: 40, w: 220, h: 360 } },
  { id: 'main',  name: 'Main',   bounds: { x: 270, y: 40, w: 440, h: 360 } },
  { id: 'bar',   name: 'Bar',    bounds: { x: 730, y: 40, w: 220, h: 220 } },
  { id: 'booth', name: 'Booths', bounds: { x: 730, y: 280, w: 220, h: 120 } },
];

export const TABLES: FloorTable[] = [
  { id: 'P1', section: 'patio', shape: 'round',  x: 80,  y: 90,  w: 60, h: 60, seats: 2, state: 'open',    name: 'P1' },
  { id: 'P2', section: 'patio', shape: 'round',  x: 175, y: 90,  w: 60, h: 60, seats: 2, state: 'seated',  name: 'P2', party: 2, openMin: 14, server: 'Nadia', total: 720 },
  { id: 'P3', section: 'patio', shape: 'round',  x: 80,  y: 200, w: 60, h: 60, seats: 4, state: 'ordered', name: 'P3', party: 3, openMin: 22, server: 'Nadia', total: 1860 },
  { id: 'P4', section: 'patio', shape: 'round',  x: 175, y: 200, w: 60, h: 60, seats: 2, state: 'open',    name: 'P4' },
  { id: 'P5', section: 'patio', shape: 'round',  x: 80,  y: 320, w: 60, h: 60, seats: 4, state: 'served',  name: 'P5', party: 4, openMin: 48, server: 'Theo', total: 3240 },
  { id: 'P6', section: 'patio', shape: 'round',  x: 175, y: 320, w: 60, h: 60, seats: 4, state: 'open',    name: 'P6' },

  { id: '1',  section: 'main', shape: 'square', x: 300, y: 75,  w: 70, h: 70, seats: 4, state: 'seated',  name: '1', party: 4, openMin: 9,  server: 'Marisol', total: 940 },
  { id: '2',  section: 'main', shape: 'square', x: 400, y: 75,  w: 70, h: 70, seats: 4, state: 'ordered', name: '2', party: 2, openMin: 18, server: 'Marisol', total: 1620 },
  { id: '3',  section: 'main', shape: 'square', x: 500, y: 75,  w: 70, h: 70, seats: 4, state: 'served',  name: '3', party: 4, openMin: 38, server: 'Theo', total: 3920 },
  { id: '4',  section: 'main', shape: 'square', x: 600, y: 75,  w: 70, h: 70, seats: 4, state: 'open',    name: '4' },

  { id: '5',  section: 'main', shape: 'square', x: 300, y: 175, w: 70, h: 70, seats: 4, state: 'overdue', name: '5', party: 4, openMin: 71, server: 'Theo', total: 4140 },
  { id: '6',  section: 'main', shape: 'square', x: 400, y: 175, w: 70, h: 70, seats: 4, state: 'bill',    name: '6', party: 3, openMin: 64, server: 'Marisol', total: 2880 },
  { id: '7',  section: 'main', shape: 'square', x: 500, y: 175, w: 70, h: 70, seats: 4, state: 'open',    name: '7' },
  { id: '8',  section: 'main', shape: 'square', x: 600, y: 175, w: 70, h: 70, seats: 4, state: 'seated',  name: '8', party: 2, openMin: 6,  server: 'Nadia', total: 480 },

  { id: '9',  section: 'main', shape: 'rect', x: 295, y: 290, w: 175, h: 56, seats: 6, state: 'ordered', name: '9',  party: 6, openMin: 24, server: 'Theo', total: 5840 },
  { id: '10', section: 'main', shape: 'rect', x: 495, y: 290, w: 175, h: 56, seats: 6, state: 'open',    name: '10' },

  { id: 'B1',  section: 'bar', shape: 'stool', x: 760, y: 95,  w: 30, h: 30, seats: 1, state: 'seated',  name: 'B1',  party: 1, openMin: 18, server: 'Kai', total: 620 },
  { id: 'B2',  section: 'bar', shape: 'stool', x: 800, y: 95,  w: 30, h: 30, seats: 1, state: 'ordered', name: 'B2',  party: 1, openMin: 12, server: 'Kai', total: 460 },
  { id: 'B3',  section: 'bar', shape: 'stool', x: 840, y: 95,  w: 30, h: 30, seats: 1, state: 'open',    name: 'B3' },
  { id: 'B4',  section: 'bar', shape: 'stool', x: 880, y: 95,  w: 30, h: 30, seats: 1, state: 'seated',  name: 'B4',  party: 1, openMin: 5,  server: 'Kai', total: 320 },
  { id: 'B5',  section: 'bar', shape: 'stool', x: 920, y: 95,  w: 30, h: 30, seats: 1, state: 'open',    name: 'B5' },
  { id: 'B6',  section: 'bar', shape: 'stool', x: 760, y: 175, w: 30, h: 30, seats: 1, state: 'open',    name: 'B6' },
  { id: 'B7',  section: 'bar', shape: 'stool', x: 800, y: 175, w: 30, h: 30, seats: 1, state: 'open',    name: 'B7' },
  { id: 'B8',  section: 'bar', shape: 'stool', x: 840, y: 175, w: 30, h: 30, seats: 1, state: 'ordered', name: 'B8',  party: 1, openMin: 22, server: 'Kai', total: 980 },
  { id: 'B9',  section: 'bar', shape: 'stool', x: 880, y: 175, w: 30, h: 30, seats: 1, state: 'served',  name: 'B9',  party: 1, openMin: 40, server: 'Kai', total: 1280 },
  { id: 'B10', section: 'bar', shape: 'stool', x: 920, y: 175, w: 30, h: 30, seats: 1, state: 'open',    name: 'B10' },

  { id: 'BX1', section: 'booth', shape: 'booth', x: 750, y: 305, w: 90, h: 70, seats: 6, state: 'seated',  name: 'BX1', party: 5, openMin: 31, server: 'Nadia', total: 4720 },
  { id: 'BX2', section: 'booth', shape: 'booth', x: 855, y: 305, w: 90, h: 70, seats: 6, state: 'ordered', name: 'BX2', party: 4, openMin: 19, server: 'Nadia', total: 3260 },
];

export const SAMPLE_ORDER: SampleOrderItem[] = [
  { name: 'Burrata + heirloom tomato', qty: 1, price: 480 },
  { name: 'Wood-fired margherita',     qty: 2, price: 520 },
  { name: 'Cacio e pepe',              qty: 1, price: 640 },
  { name: 'Negroni',                   qty: 2, price: 380 },
  { name: 'Espresso',                  qty: 1, price: 140 },
];

export const TICKETS: KitchenTicket[] = [
  { id: 'T-204', table: 'T3',  ageSec: 187, items: [
    { qty: 2, name: 'Margherita',   mod: 'extra basil' },
    { qty: 1, name: 'Burrata' },
    { qty: 1, name: 'Cacio e pepe', mod: 'no pepper' },
  ], status: 'firing' },
  { id: 'T-205', table: 'T9',  ageSec: 412, items: [
    { qty: 4, name: 'Negroni' },
    { qty: 2, name: 'Olives, smoked' },
  ], status: 'cooking' },
  { id: 'T-206', table: 'B2',  ageSec: 96,  items: [
    { qty: 1, name: 'Bar burger', mod: 'med-rare, no onion' },
    { qty: 1, name: 'Fries' },
  ], status: 'firing' },
  { id: 'T-207', table: 'BX1', ageSec: 542, items: [
    { qty: 4, name: 'Tasting menu A' },
    { qty: 2, name: 'Pairing flight' },
    { qty: 1, name: 'Sparkling' },
  ], status: 'cooking' },
  { id: 'T-208', table: 'T1',  ageSec: 268, items: [
    { qty: 1, name: 'Calamari fritti' },
    { qty: 1, name: 'Caesar' },
  ], status: 'firing' },
  { id: 'T-209', table: '5',   ageSec: 645, items: [
    { qty: 4, name: 'Lobster ravioli' },
    { qty: 1, name: 'Tartare' },
  ], status: 'cooking' },
  { id: 'T-210', table: '2',   ageSec: 134, items: [
    { qty: 2, name: 'Carpaccio' },
    { qty: 1, name: 'Burrata' },
  ], status: 'firing' },
  { id: 'T-211', table: '9',   ageSec: 320, items: [
    { qty: 6, name: 'Group platter' },
    { qty: 2, name: 'Bread basket' },
  ], status: 'cooking' },
];

export const STATIONS: Station[] = [
  { name: 'Saute', load: 0.74, count: 4 },
  { name: 'Grill', load: 0.92, count: 6 },
  { name: 'Pasta', load: 0.61, count: 3 },
  { name: 'Cold',  load: 0.32, count: 2 },
  { name: 'Pizza', load: 0.55, count: 3 },
  { name: 'Bar',   load: 0.81, count: 5 },
];

export const EVENTS: CloudEvent[] = [
  { ts: '21:47:02', text: 'Ticket T-204 fired to Pizza',   src: 'kds-01' },
  { ts: '21:46:51', text: 'Table 5 marked overdue',        src: 'floor' },
  { ts: '21:46:33', text: 'Payment ₹4,140 settled · Card', src: 'cashier' },
  { ts: '21:46:12', text: 'AI: Re-route Grill → Pasta',    src: 'ai' },
  { ts: '21:45:58', text: 'New ticket T-208 (T1)',         src: 'pos-03' },
  { ts: '21:45:31', text: 'B9 ready for plating',          src: 'kds-02' },
  { ts: '21:45:09', text: 'Server Nadia clocked in',       src: 'auth' },
  { ts: '21:44:47', text: 'Stock alert: Burrata < par',    src: 'inventory' },
];

export const ROLES: Record<RoleName, RoleDef> = {
  Server:      { access: ['floor', 'orders'],                                       accent: 'var(--brand)' },
  Bartender:   { access: ['floor', 'orders', 'billing'],                            accent: 'var(--info)' },
  'Line Cook': { access: ['kds'],                                                   accent: 'var(--crit)' },
  Cashier:     { access: ['orders', 'billing'],                                     accent: 'var(--warn)' },
  Supervisor:  { access: ['floor', 'orders', 'kds', 'pulse', 'inventory'],          accent: 'var(--route)' },
  Manager:     { access: ['floor', 'orders', 'kds', 'pulse', 'loom', 'inventory', 'billing'], accent: 'var(--brand-bright)' },
};

export const EMPLOYEES: Employee[] = [
  { id: 'nadia',   name: 'Nadia M.',   initial: 'N', role: 'Server',     shift: '4:30p — close', station: 'Patio + Main' },
  { id: 'theo',    name: 'Theo R.',    initial: 'T', role: 'Server',     shift: '5:00p — close', station: 'Main' },
  { id: 'marisol', name: 'Marisol G.', initial: 'M', role: 'Server',     shift: '4:30p — 11p',   station: 'Main' },
  { id: 'kai',     name: 'Kai J.',     initial: 'K', role: 'Bartender',  shift: '4:30p — 1a',    station: 'Bar' },
  { id: 'owen',    name: 'Owen P.',    initial: 'O', role: 'Line Cook',  shift: '3p — 11p',      station: 'Grill · Saute' },
  { id: 'riley',   name: 'Riley S.',   initial: 'R', role: 'Cashier',    shift: '5p — close',    station: 'Pass' },
  { id: 'lin',     name: 'Lin C.',     initial: 'L', role: 'Supervisor', shift: '4p — close',    station: 'Floor' },
  { id: 'arush',   name: 'Arush B.',   initial: 'A', role: 'Manager',    shift: 'All day',       station: 'Anywhere' },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'i01', name: 'Burrata di Andria',       cat: 'Dairy',   unit: 'wheel', par: 24, current: 6,   expiresInH: 18,    supplier: 'Casa Lombardi',   station: 'Cold' },
  { id: 'i02', name: 'Heirloom tomato · vine',  cat: 'Produce', unit: 'kg',    par: 12, current: 3,   expiresInH: 36,    supplier: 'Sahyadri Farms',  station: 'Cold' },
  { id: 'i03', name: 'Negroni mix · house',     cat: 'Bar',     unit: 'L',     par: 4,  current: 0.8, expiresInH: 96,    supplier: 'In-house',        station: 'Bar' },
  { id: 'i04', name: 'Sourdough · rustica',     cat: 'Bakery',  unit: 'loaf',  par: 30, current: 8,   expiresInH: 10,    supplier: 'Levain Bakers',   station: 'Pass' },
  { id: 'i05', name: 'Lobster tail · Maine',    cat: 'Seafood', unit: 'pc',    par: 20, current: 18,  expiresInH: 12,    supplier: 'Cape Cod Co',     station: 'Saute' },
  { id: 'i06', name: 'Basil · sweet',           cat: 'Herb',    unit: 'bunch', par: 18, current: 22,  expiresInH: 14,    supplier: 'Sahyadri Farms',  station: 'Pizza' },
  { id: 'i07', name: 'Buffalo mozzarella',      cat: 'Dairy',   unit: 'ball',  par: 40, current: 38,  expiresInH: 22,    supplier: 'Casa Lombardi',   station: 'Pizza' },
  { id: 'i08', name: 'Pasta · cacio e pepe',    cat: 'Dry',     unit: 'kg',    par: 8,  current: 12,  expiresInH: 720,   supplier: 'Pastificio',      station: 'Pasta' },
  { id: 'i09', name: 'Olive oil · EVOO',        cat: 'Pantry',  unit: 'L',     par: 12, current: 18,  expiresInH: 2160,  supplier: 'Frescobaldi',     station: 'All' },
  { id: 'i10', name: 'Campari · 1L',            cat: 'Bar',     unit: 'btl',   par: 8,  current: 9,   expiresInH: 8760,  supplier: 'In-bond',         station: 'Bar' },
  { id: 'i11', name: 'Espresso beans · Lavoro', cat: 'Bar',     unit: 'kg',    par: 6,  current: 4,   expiresInH: 480,   supplier: 'Roastery Five',   station: 'Bar' },
  { id: 'i12', name: 'Parmigiano · 24mo',       cat: 'Dairy',   unit: 'kg',    par: 5,  current: 3.4, expiresInH: 1440,  supplier: 'Casa Lombardi',   station: 'Pasta' },
  { id: 'i13', name: 'Saffron · threads',       cat: 'Spice',   unit: 'g',     par: 60, current: 48,  expiresInH: 4320,  supplier: 'Mehrgarh Co',     station: 'Saute' },
  { id: 'i14', name: 'Red wine · Chianti',      cat: 'Bar',     unit: 'btl',   par: 24, current: 26,  expiresInH: 17520, supplier: 'Frescobaldi',     station: 'Bar' },
];
