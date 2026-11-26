# Vedora — Fathir Rizki Fadillah (`vedora.my.id`)

Personal web profile & private owner CMS for **Fathir Rizki Fadillah (Vedora)** — AI Engineer, Informatics student at Universitas Siliwangi, Lead at MAUNC (Komunitas IoT Informatika Universitas Siliwangi), and Oracle Certified Generative AI Professional.

## Features

- **Enriched GitHub Identity**: Real GitHub avatar, VEDORA animated GitHub banner, live repository language telemetry bar, latest pushed repositories, Current Focus tracks, and categorized Technical Stack matrix.
- **Interactive Engineering Bench**: Switchable real architecture simulator covering **Edge Vision (MediaPipe)**, **Federated FL (Flower + PyTorch)**, and **Arduino Bus (`smart_trash.ino` HC-SR04 proximity slider)**.
- **Private Owner Dashboard (`/admin`)**: Password-protected studio (`HttpOnly` signed session cookie, `noindex`) to edit Hero/Bio/Media, add/edit/reorder Projects, 1-click import repos via **GitHub Sync**, edit Current Focus/Stack/Timeline/Certifications, and export/import JSON backups — no hardcode editing needed.

## Setting Up Private `/admin` on Vercel (Zero VPS, Free)

1. In Vercel -> **Project Settings -> Environment Variables**, add:
   - `ADMIN_PASSWORD` = your private password
   - *(Optional)* `ADMIN_SESSION_SECRET` = random 32+ character string
2. To save edits permanently on Vercel without a VPS:
   - Go to **Vercel Project -> Storage -> Create Database -> Upstash Redis (Free)** and connect it to this project.
   - Vercel automatically injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Redeploy once, then visit `https://vedora.my.id/admin`.

## Local Development

```bash
cp .env.example .env.local
# Edit ADMIN_PASSWORD in .env.local
npm install
npm run dev
```

Open `http://localhost:3000` (public profile) and `http://localhost:3000/admin` (private owner dashboard).
