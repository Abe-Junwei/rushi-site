# Rushi product site

This is the static product website for **如是我闻 Rushi**.

## Local development

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

The build output is written to `dist/`. `public/CNAME` pins the GitHub Pages
custom domain to `rushi.app`.

## Edit content

- `src/content.ts`: version, download links, feature copy, guide steps, changelog
- `src/main.tsx`: page structure and navigation
- `src/styles.css`: visual system and responsive layout

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys the site on
every push to `main`.

In the GitHub repository settings:

1. Open **Settings -> Pages**.
2. Set **Source** to **GitHub Actions**.
3. Keep the custom domain as `rushi.app`.

Cloudflare should point the apex domain to GitHub Pages:

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```
