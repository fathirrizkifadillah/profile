# Vedora — Fathir Rizki Fadillah (`vedora.my.id`)

Personal web profile for **Fathir Rizki Fadillah (Vedora)** — AI Engineer, Informatics student at Universitas Siliwangi, Lead at MAUNC (Komunitas IoT Informatika Universitas Siliwangi), and Oracle Certified Generative AI Professional.

## Stack

- **Next.js 16 (App Router)** + **TypeScript**
- **Tailwind CSS v4** (CSS-first semantic tokens)
- **Framer Motion** (spring physics, layout transitions, isolated client leaves)
- **Phosphor Icons** (`@phosphor-icons/react`)
- **Centralized SEO Service** (`src/constants/seo.ts`, `src/services/seo/`, dynamic OpenGraph image, `sitemap.ts`, `robots.ts`, Schema.org `Person` & `WebSite` JSON-LD)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploying to `vedora.my.id` without a VPS (Vercel Free Hobby Plan)

1. Push this repository to GitHub (e.g., `fathirrizkifadillah/profile`).
2. Import the repository at [vercel.com/new](https://vercel.com/new) and deploy (Next.js is detected automatically).
3. Go to **Project Settings -> Domains**, add `vedora.my.id` and `www.vedora.my.id`.
4. Copy the DNS records shown by Vercel into your `.my.id` registrar's DNS Management panel (typically an `A` record for `@` pointing to Vercel's IP and a `CNAME` record for `www` pointing to `cname.vercel-dns.com`).
5. SSL/HTTPS certificates are provisioned and renewed automatically by Vercel at zero cost.
