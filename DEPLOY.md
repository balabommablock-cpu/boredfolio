# 🚀 Boredfolio Deployment Guide
## GitHub → Vercel → boredfolio.com (GoDaddy)

Total time: ~15 minutes.

---

## Step 1: Push to GitHub (2 min)

```bash
# In your project folder
cd boredfolio

# Initialize git
git init
git add .
git commit -m "Initial commit: Boredfolio frontend"

# Create repo on GitHub (go to github.com/new → name it "boredfolio" → private)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/boredfolio.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel (3 min)

1. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your `boredfolio` repository
4. Vercel auto-detects Next.js — settings should be:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)
5. Add **Environment Variables** before deploying:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SITE_URL` | `https://boredfolio.com` |
   | `NEXT_PUBLIC_MFAPI_BASE` | `https://api.mfapi.in` |

6. Click **"Deploy"**
7. Wait ~60 seconds. You'll get a live URL like `boredfolio-xxxxx.vercel.app`
8. **Test it** — open the Vercel URL, click around, verify pages load

---

## Step 3: Connect GoDaddy Domain (10 min)

### Option A: Nameservers (Recommended — Vercel manages everything)

**In Vercel:**
1. Go to your project → **Settings** → **Domains**
2. Add `boredfolio.com`
3. Also add `www.boredfolio.com`
4. Vercel will show you **nameservers** to configure:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

**In GoDaddy:**
1. Log in to [godaddy.com](https://godaddy.com) → **My Products** → Find `boredfolio.com`
2. Click **DNS** (or **Manage DNS**)
3. Scroll down to **Nameservers** → Click **Change**
4. Select **"Enter my own nameservers (advanced)"**
5. Enter:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
6. Click **Save**
7. GoDaddy will warn about changing nameservers — confirm

**Wait 5-30 minutes** for DNS propagation. Vercel auto-provisions SSL.

### Option B: DNS Records (If you want GoDaddy to stay as nameserver)

**In Vercel:**
1. Go to project → **Settings** → **Domains** → Add `boredfolio.com`
2. Vercel will show you the required DNS records

**In GoDaddy DNS Manager:**
1. Add an **A Record**:
   - **Type:** A
   - **Name:** @
   - **Value:** `76.76.21.21`
   - **TTL:** 600
2. Add a **CNAME Record** for www:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** 600
3. **Delete** any existing A record for @ pointing to GoDaddy's parking page

**Wait 5-30 minutes.** Vercel auto-provisions SSL.

---

## Step 4: Verify (2 min)

Check all of these:

- [ ] `https://boredfolio.com` loads the homepage
- [ ] `https://www.boredfolio.com` redirects to `https://boredfolio.com`
- [ ] `https://boredfolio.com/explore` loads the screener
- [ ] `https://boredfolio.com/tools/sip` loads the SIP calculator
- [ ] `https://boredfolio.com/sitemap.xml` shows the sitemap
- [ ] `https://boredfolio.com/robots.txt` shows crawl rules
- [ ] SSL padlock shows in browser (green lock)
- [ ] Open a scheme page — data loads from mfapi.in
- [ ] Try a non-existent URL → custom 404 page shows

### Check OG tags:
- Go to [opengraph.xyz](https://www.opengraph.xyz/) → enter `https://boredfolio.com`
- Verify the sage-green OG image and correct title/description

### Check mobile:
- Open `https://boredfolio.com` on your phone
- Verify bottom nav works, pages scroll properly

---

## Step 5: Post-Launch Essentials

### Google Search Console (do immediately)
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Enter `https://boredfolio.com`
3. Verify via DNS (add TXT record in GoDaddy, or auto-verify if using Vercel nameservers)
4. Submit sitemap: `https://boredfolio.com/sitemap.xml`

### Analytics (optional, recommend Plausible)
1. Sign up at [plausible.io](https://plausible.io) (privacy-first, no cookie banner needed)
2. Add `boredfolio.com` as a site
3. Add to `layout.tsx`:
   ```html
   <script defer data-domain="boredfolio.com" src="https://plausible.io/js/script.js" />
   ```

### Performance check
- Run [PageSpeed Insights](https://pagespeed.web.googl.com/) on `https://boredfolio.com`
- Target: 90+ performance, 95+ accessibility

---

## Ongoing Deployment

Every push to `main` auto-deploys via Vercel. No action needed.

For preview deployments: push to any branch → Vercel creates a preview URL automatically.

```bash
# Make changes, commit, push
git add .
git commit -m "feat: add new fund analysis"
git push origin main
# → Vercel auto-deploys in ~30 seconds
```

---

## Troubleshooting

**"Build failed" on Vercel:**
- Check the build logs in Vercel dashboard
- Most likely: TypeScript error. Run `npm run build` locally first.

**Domain not working after 30 min:**
- Check DNS propagation: [dnschecker.org](https://dnschecker.org/#A/boredfolio.com)
- Verify nameservers or A record is correct
- In Vercel dashboard, domain should show ✓ green checkmark

**MFAPI calls failing:**
- mfapi.in is rate-limited. ISR caching handles this.
- If persistent, check if API is down at https://api.mfapi.in/mf/125497/latest

**SSL not working:**
- Vercel auto-provisions SSL. If it fails, go to Vercel → Settings → Domains → click "Refresh" next to your domain
- Can take up to 1 hour for SSL after DNS change

---

## Cost

| Item | Cost |
|------|------|
| Vercel (Hobby plan) | Free (100GB bandwidth, sufficient for launch) |
| GoDaddy domain | Already owned |
| mfapi.in | Free |
| **Total** | **₹0/month** |

When you scale past 100GB bandwidth or need team features, Vercel Pro is $20/mo.
