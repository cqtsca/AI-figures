# CLAUDE.md

Guidance for AI assistants working in this repository.

## What the project does

China WeChat mini program for municipal lithium construction equipment sales
(TSEMODUX Full Pro SKUs + two trowels). Phase 1 is the sales system: mall,
one-level dealers, three purchase methods, Huiju pay interfaces, role UIs,
listing approval. Device lock / BMS is reserved only. Do not rebuild 页稿/yegao.

## Working in this repo

### Branching

- Default branch: `main`.
- Feature work for Claude sessions on the web goes on the branch the
  harness assigns (e.g. `claude/<slug>`). Do **not** push directly to
  `main` without explicit permission.
- Create the assigned branch locally if it doesn't yet exist.

### Commits

- Write descriptive commit messages focused on the *why*, not just the
  *what*.
- Prefer small, focused commits over large omnibus changes.
- Never bypass hooks (`--no-verify`) or signing unless the user asks.

### Pushing

- Use `git push -u origin <branch-name>` on first push.
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on
  network failures only — never on validation failures.

### Pull requests

- Do **not** open a pull request unless the user explicitly asks.
- When asked, keep PR titles under ~70 characters and put detail in the
  body.

## Entry points

- Mini program source: `miniprogram/`
- App entry: `miniprogram/src/main.js`, `miniprogram/src/App.vue`
- Pages: `miniprogram/src/pages.json`
- Domain rules: `miniprogram/src/store/engine.js`
- Huiju interfaces: `miniprogram/src/api/huiju.js`
- Reserved device APIs: `miniprogram/src/api/device.js`

## Install

```bash
cd miniprogram
npm ci
```

(`npm install` is fine if `package-lock.json` needs a refresh.)

## Run

```bash
cd miniprogram
npm run dev:mp-weixin   # WeChat mini program → import dist/dev/mp-weixin in DevTools
npm run dev:h5          # browser preview
npm run dev:app         # later App resources
```

## Test

```bash
cd miniprogram
npm test
```

Tests live in `miniprogram/tests/`.

## Lint / format

```bash
cd miniprogram
npm run lint
npm run format
```

Prettier is the formatter. Keep WeChat pages on uni-app tags (`view`/`text`/`button`), not HTML.

## Directory layout

- `miniprogram/src/pages/` — login, mall, customer, dealer, sales, finance, admin, scan
- `miniprogram/src/components/` — shared UI (role tabs)
- `miniprogram/src/data/catalog.js` — Full Pro + trowel SKUs
- `miniprogram/src/store/` — in-memory demo backend + persistence
- `miniprogram/src/api/` — Huiju mock + device stubs
- `README.md` — Chinese WeChat DevTools instructions

If 页稿 files land in the repo root later, keep the mini program in `miniprogram/`; do not delete 页稿.

## External services

- WeChat mini program AppID: `miniprogram/src/manifest.json` → `mp-weixin.appid` (empty in this repo; use a test appid locally).
- Huiju pay: interfaces only; mock when `huijuConfig.mock === true`. Never commit merchant secrets.
- Device 4G/GNSS/BMS: not connected in phase 1.

## Conventions

1. Pin direct dependencies and commit `package-lock.json`.
2. Chinese UI copy. Product names follow tsemodux.com; do not treat USD kit prices as China list prices.
3. Sales may edit price / promo / service fee / rent; finance + admin must approve before customers see it.
4. Do not implement hardware lock execution in phase 1.
5. Secrets stay out of git (`.env`, credentials, API keys).
