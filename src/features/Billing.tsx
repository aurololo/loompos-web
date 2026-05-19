// LoomPOS — Billing: receipt-first layout with payment pad.

import { useState } from 'react';
import { Icon, type IconName } from '../design/icons';
import { SAMPLE_ORDER } from '../core/data';

type Method = 'card' | 'upi' | 'cash' | 'wallet';

interface MethodDef {
  id: Method;
  name: string;
  hint: string;
  icon: IconName;
}

const METHODS: MethodDef[] = [
  { id: 'card',   name: 'Card',   hint: 'Tap, swipe or insert',     icon: 'CreditCard' },
  { id: 'upi',    name: 'UPI',    hint: 'Scan QR · GPay · PhonePe', icon: 'Smartphone' },
  { id: 'cash',   name: 'Cash',   hint: 'Open till',                icon: 'Banknote' },
  { id: 'wallet', name: 'Wallet', hint: 'Loyalty · Gift card',      icon: 'Wallet' },
];

export function Billing() {
  const [method, setMethod] = useState<Method>('card');
  const items = SAMPLE_ORDER;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = Math.round(subtotal * 0.05);
  const service = Math.round(subtotal * 0.10);
  const total = subtotal + tax + service;
  const current = METHODS.find((m) => m.id === method)!;

  return (
    <div className="billing-wrap">
      <div className="receipt">
        <div className="receipt-head">
          <div className="row items-end justify-between">
            <div>
              <div className="t-eyebrow muted">Order</div>
              <div className="t-lg" style={{ fontFamily: 'JetBrains Mono', fontVariantNumeric: 'tabular-nums' }}>
                #A4-2814
              </div>
            </div>
            <div className="text-right">
              <div className="t-eyebrow muted">Table</div>
              <div className="t-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>5</div>
            </div>
            <div className="text-right">
              <div className="t-eyebrow muted">Server</div>
              <div className="t-sub mt-2">Nadia M.</div>
            </div>
            <div className="text-right">
              <div className="t-eyebrow muted">Party</div>
              <div className="t-sub mt-2">4 covers</div>
            </div>
          </div>
        </div>

        <div className="receipt-rows">
          {items.map((it, i) => (
            <div className="receipt-row" key={i}>
              <div className="name">{it.qty} × {it.name}</div>
              <div className="price">₹{(it.qty * it.price).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div className="receipt-totals">
          <div className="receipt-row dim">
            <div className="name">Subtotal</div>
            <div className="price">₹{subtotal.toLocaleString('en-IN')}</div>
          </div>
          <div className="receipt-row dim">
            <div className="name">GST · 5%</div>
            <div className="price">₹{tax.toLocaleString('en-IN')}</div>
          </div>
          <div className="receipt-row dim">
            <div className="name">Service · 10%</div>
            <div className="price">₹{service.toLocaleString('en-IN')}</div>
          </div>
          <div className="receipt-row" style={{
            paddingTop: 10, marginTop: 10,
            borderTop: '1px solid var(--hairline-strong)'
          }}>
            <div className="name" style={{ fontWeight: 600 }}>Total</div>
            <div className="price" style={{ fontSize: 26, fontWeight: 600, color: 'var(--brand-bright)' }}>
              ₹{total.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      <div className="pay-pad">
        <div>
          <div className="t-eyebrow muted" style={{ marginBottom: 10 }}>Payment method</div>
          <div className="pay-methods">
            {METHODS.map((m) => {
              const Ic = Icon[m.icon];
              return (
                <button
                  key={m.id}
                  className={`pay-method ${method === m.id ? 'on' : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  <Ic className="icon" />
                  <div className="label">{m.name}</div>
                  <div className="hint">{m.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div className="t-eyebrow muted" style={{ marginBottom: 8 }}>Split</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Equal · 4</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>By item</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>Custom</button>
          </div>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div className="t-eyebrow muted" style={{ marginBottom: 8 }}>Tip</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['0%', '10%', '15%', '20%'].map((t, i) => (
              <button key={t} className={`btn ${i === 2 ? 'primary' : ''}`} style={{ justifyContent: 'center' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <button className="settle-btn">
          <div className="col" style={{ alignItems: 'flex-start' }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', opacity: 0.85
            }}>
              Settle via {current.name}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>tap to confirm</div>
          </div>
          <div className="amt">₹{total.toLocaleString('en-IN')}</div>
        </button>
      </div>
    </div>
  );
}
