# youjavu.com — the YouJavu Studio website

Plain static site (no build step): home, a page per game, privacy policies, support, `app-ads.txt`.

```
index.html                  home: game cards
ballsortmoods/index.html    Ball Sort Moods page
ballsortmoods/privacy.html  Ball Sort Moods privacy policy (same text as BallSortMoods/docs/privacy)
support.html                contact + purchases help
youjavu/                    the YouJavu app (Rewind Your Days): page, privacy, terms
privacy.html, terms.html    copies of the YouJavu app's policies, so old youjavu.com/privacy.html links keep working
404.html                    not-found page (GitHub Pages uses it)
app-ads.txt                 ad network line(s); must stay at the site root
CNAME                       youjavu.com (GitHub Pages custom domain)
img/                        WebP images made from the games' screenshots and Astra's art
```

Preview locally: `python3 -m http.server 8765` in this folder, then open http://localhost:8765/.

## Publishing (Yasar does these steps; Claude never changes accounts or DNS)

Hosting: GitHub Pages, like the other YouJavu pages.

1. GitHub Desktop: publish this folder as a new repository `youjavu-site` under `youjavuapp-sudo`, then push.
2. On GitHub: repository → Settings → Pages → Source: `main` branch, root. Custom domain: `youjavu.com`. Tick "Enforce HTTPS" once it is offered.
3. Cloudflare (DNS for youjavu.com): add only these records, and do not touch MX, TXT/SPF or `privacy`:
   - `A  @  185.199.108.153`, `A  @  185.199.109.153`, `A  @  185.199.110.153`, `A  @  185.199.111.153` (DNS only, grey cloud)
   - `CNAME  www  youjavuapp-sudo.github.io` (DNS only)
4. Porkbun (youjavu.app): URL forwarding of `youjavu.app` and `www.youjavu.app` to `https://youjavu.com` (permanent 301). Keep the MX (email) records.

Not affected: `tiles.youjavu.com` (the YouJavu map Worker), email (MX/SPF), and `privacy.youjavu.com/ballsortmoods.html` (used in the Ball Sort store listing) is a separate GitHub Pages site and is not changed by any of this.

## When a game goes live
Replace its grey "coming soon" buttons with the store links (Google Play: `https://play.google.com/store/apps/details?id=app.ballsortmoods`).
New game: copy `ballsortmoods/`, change the text and images, add a card on `index.html`, add its privacy page.

This site replaces the old YouJavu "step 8" plan (apex redirect to youjavuapp-sudo.github.io); that plan is no longer needed. youjavuapp-sudo.github.io stays online so the YouJavu store listing links keep working.
