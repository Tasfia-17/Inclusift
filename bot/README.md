# InclusiFit Bot — Powered by Photon Spectrum

Brings InclusiFit to iMessage, WhatsApp, and Telegram via the Spectrum framework.

## What it does

Users can interact with InclusiFit directly in their messaging app:

- Send a selfie to get a free AI skin analysis (Perfect Corp API)
- Type "afo" to get AFO-compatible footwear recommendations
- Type "loose" to get loose-fit / easy-wear clothing
- Type "dexterity" to get magnetic/velcro closure products
- Type "hair" to get wig and hair loss products
- Type "beauty" to get accessible beauty products
- Type "shorter" to get petite / shorter limb clothing
- Every response includes a direct link to the web app for virtual try-on

## Setup

1. Get credentials at https://app.photon.codes
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install and run:

```bash
npm install
node --env-file=.env index.js
```

## Commands

| Command | Response |
|---|---|
| hi / hello / help | Welcome message + command list |
| afo | AFO-compatible footwear |
| loose | Loose / easy-wear clothing |
| dexterity | Magnetic/velcro closure products |
| hair | Wigs and hair loss products |
| beauty | Accessible beauty products |
| shorter | Petite / shorter limb clothing |
| catalog | Link to full web catalog |
| Send a photo | AI skin analysis via Perfect Corp |
