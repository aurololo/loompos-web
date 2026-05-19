# LoomPOS — Web PWA

A premium showcase of the **LoomPOS** restaurant operating system, rebuilt as a responsive, installable Progressive Web App. Works on iPhone, iPad, and any modern browser.

> **Weaving Restaurant Operations Together.**

## What's inside

- **Vite + React + TypeScript** — fast dev, fast build
- **Tailwind CSS** — extended with the LoomPOS color tokens
- **Framer Motion** — smooth flow transitions
- **lucide-react** — icon set (close to SF Symbols vocabulary)
- **vite-plugin-pwa** — auto-generates manifest, service worker, install support

### Modules

```
src/
├── design/        theme, animated background, components, buttons, LoomMark
├── core/          types, mock data, app store (Context + reducer)
├── lib/           currency / time / haptics helpers
└── features/
    ├── onboarding/  Splash, Login (PIN + Face ID + handoff), RoleSelection
    ├── shared/      RoleShell (custom tab bar)
    ├── waiter/      TableMap (floor plan), Orders, OrderBuilder, MenuQuick, Me
    ├── kitchen/     KDS (live timers, heat colors), Stations
    ├── manager/     ManagerHome (pulse), Analytics, Comms, AIInsights, CloudMap
    ├── cashier/     CashierHome (queue), Billing (split payment), DayReport
    ├── inventory/   Inventory (freshness + below-par alerts)
    └── hardware/    DeviceCenter (rendered handheld silhouette, attachments)
```

## Run locally

```bash
cd web
npm install
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`).

To test the PWA install + service worker behavior, do a production preview:

```bash
npm run build
npm run preview
```

Both `dev` and `preview` bind to your LAN — you'll see a `Network: http://<your-LAN-ip>:5173` line. Open that URL on your phone or iPad and tap **Share → Add to Home Screen** to install LoomPOS as a fullscreen app.

## Deploy

### Vercel (recommended — one-click)

1. Push this repo to GitHub.
2. Go to **vercel.com/new** and import the repo.
3. In **Project Settings → General**, set **Root Directory** to `web/`.
4. Framework preset: **Vite** (Vercel auto-detects this).
5. Build command: `npm run build` · Output directory: `dist`.
6. Deploy.

The `vercel.json` already handles SPA rewrites and long-cache headers for hashed assets, so no extra config is needed.

### GitHub Pages

GitHub Pages serves under a sub-path (`/<repo-name>/`). Build with that base path:

```bash
cd web
VITE_BASE_PATH="/LoomPOS/" npm run build
```

Then either:

**A) Manual** — commit `web/dist` to a `gh-pages` branch and enable Pages → branch `gh-pages` → folder `/ (root)`.

**B) GitHub Actions** — drop this into `.github/workflows/deploy.yml`:

```yaml
name: Deploy LoomPOS PWA
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: web/package-lock.json }
      - working-directory: web
        run: npm ci
      - working-directory: web
        env:
          VITE_BASE_PATH: /${{ github.event.repository.name }}/
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: web/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Push to `main`, then enable **Settings → Pages → Source: GitHub Actions**.

### Other static hosts

The `dist/` folder is fully static. It works on Netlify, Cloudflare Pages, Firebase Hosting, S3+CloudFront, etc. Set the SPA rewrite (all routes → `index.html`).

## Brand

| Token             | Value      | Role                                |
| ----------------- | ---------- | ----------------------------------- |
| Atomic Black      | `#0F0F10`  | Base background                     |
| Surface 1 / 2 / 3 | `#16161A` / `#1F1F23` / `#2A2A2F` | Card layers       |
| Brand             | `#7D9772`  | Battleship Gray Green — primary CTA |
| Brand Bright      | `#A8C49A`  | Luminous highlight                  |
| Signal            | `#74A9D8` (info) · `#E0B85A` (warn) · `#E0775A` (crit) · `#B592D8` (route) |

Type: Inter (loaded from `rsms.me/inter`).

## Try it

The first screen is a 3-second splash. Then:

1. **Login** — Tap a staff member, key in any 4-digit PIN (no validation, just for show), or tap **Sign in with Face ID** to skip straight through.
2. **Choose a role** — Waiter, Kitchen, Cashier, Supervisor, or Manager.
3. **Tab through the shell.** Every role has its own tab set. Try:
   - **Waiter → Floor** — tap a table to open the live order sheet.
   - **Kitchen** — watch tickets age in real time; tap **Start / Plate / Ready / Bump** to advance them.
   - **Manager → Loom** — see the operational nervous system with pulsing connections.
   - **Cashier → Queue** — pick an order, settle it via Card / UPI / Cash / Wallet, see the success banner.

The Loom Cloud event stream emits an event every ~4.5s, and Loom AI recomputes insights every 9s, so the dashboard feels alive without any backend wired up.

## Extending

The model layer in `src/core/` is the seam — every screen reads from a single store. To add a new role, screen, station, event kind, AI insight, or hardware module, edit `types.ts`/`mockData.ts` and add a feature file. The tab bar and Loom Cloud map pick up new content automatically once you wire it into `RoleShell.tsx`.
