# InclusiFit

**AI-powered adaptive fashion and beauty for people with disabilities.**

> Built with Perfect Corp YouCam API · Hackathon: Perfect Corp × Startup World Cup 2026

## Live Demo
Deploy to Vercel: `vercel --prod`

## Setup

```bash
pnpm install
cp .env.local.example .env.local
# Add your Perfect Corp API key
pnpm dev
```

## Environment Variables

```
PERFECT_CORP_API_KEY=your_key_here
```
Get your key + 1000 free units: https://yce.perfectcorp.com/api-console/en/redeem-code/ (code: `Pegasus1000`)

## Features

- **Adaptive catalog** — filters by closure type, waistband, AFO compatibility, fit style
- **Clothes VTO** — AI virtual try-on for adaptive clothing
- **Skin analysis** — 12-concern HD analysis with product recommendations
- **Makeup VTO** — try foundation and makeup before buying
- **Voice output** — skin results read aloud (Web Speech API)
- **Accessible UI** — WCAG 2.1 AA, screen reader support, large tap targets

## Perfect Corp APIs Used

1. AI Clothes VTO v3 — `/s2s/v2.0/task/cloth`
2. AI Skin Analysis HD — `/s2s/v2.1/task/skin-analysis`
3. AI Makeup VTO — `/s2s/v2.0/task/makeup-vto`

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Vercel
