# Boredfolio — One-Shot Deployment

## Option 1: Claude Code (Recommended)

### Prerequisites
```bash
# Install Claude Code if you don't have it
npm install -g @anthropic-ai/claude-code

# Install GitHub CLI
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Install Vercel CLI
npm install -g vercel

# Login to both
gh auth login
vercel login
```

### Run Claude Code
```bash
cd ~/path-to/boredfolio
claude
```

### Paste this prompt:

```
I need you to take this Next.js project live at boredfolio.com. Do the following:

1. VERIFY BUILD
   - Run `npm install`
   - Run `npm run build`
   - Fix any TypeScript or build errors before proceeding

2. GIT SETUP
   - Initialize git if not already done
   - Create .env.local with:
     NEXT_PUBLIC_SITE_URL=https://boredfolio.com
     NEXT_PUBLIC_MFAPI_BASE=https://api.mfapi.in
   - Make sure .env.local is in .gitignore
   - Stage all files and commit: "feat: boredfolio v1 — complete frontend"

3. PUSH TO GITHUB
   - Use `gh repo create boredfolio --private --source=. --push`
   - Confirm the repo is live on GitHub

4. DEPLOY TO VERCEL
   - Run `vercel` to link the project (accept defaults, framework=nextjs)
   - Set environment variables:
     `vercel env add NEXT_PUBLIC_SITE_URL production` → https://boredfolio.com
     `vercel env add NEXT_PUBLIC_MFAPI_BASE production` → https://api.mfapi.in
   - Run `vercel --prod` to deploy to production
   - Confirm the deployment URL works

5. ADD CUSTOM DOMAIN
   - Run `vercel domains add boredfolio.com`
   - Run `vercel domains add www.boredfolio.com`
   - Show me the DNS records I need to configure in GoDaddy

6. VERIFY
   - Confirm the Vercel deployment URL loads correctly
   - Show me the exact GoDaddy DNS changes needed
   - List any post-launch steps (Google Search Console, analytics)

Do NOT proceed to the next step if the current step fails. Fix errors first.
After step 5, stop and show me the GoDaddy DNS instructions — I'll do that part manually.
```

---

## Option 2: Cowork Task

Open Claude Desktop → Switch to Cowork tab → Point it at your boredfolio folder → Paste:

```
Take this Next.js project and prepare it for deployment:

1. Run `npm install` and `npm run build` in terminal — fix any errors
2. Create .env.local with NEXT_PUBLIC_SITE_URL=https://boredfolio.com and NEXT_PUBLIC_MFAPI_BASE=https://api.mfapi.in
3. Initialize git, commit all files with message "feat: boredfolio v1"
4. Use `gh repo create boredfolio --private --source=. --push` to push to GitHub
5. Run `vercel` to link the project, then `vercel env add NEXT_PUBLIC_SITE_URL production` (value: https://boredfolio.com) and `vercel env add NEXT_PUBLIC_MFAPI_BASE production` (value: https://api.mfapi.in)
6. Run `vercel --prod` to deploy
7. Run `vercel domains add boredfolio.com` and `vercel domains add www.boredfolio.com`
8. Show me the GoDaddy DNS records I need to set

Stop after step 8 and show me what to do in GoDaddy.
```

---

## The ONE Manual Step: GoDaddy DNS (2 minutes)

After Claude Code/Cowork finishes, it will show you DNS records. Do this:

1. Go to godaddy.com → My Products → boredfolio.com → DNS
2. Either:

   **Option A — Change Nameservers (cleanest):**
   - Scroll to Nameservers → Change → "Enter my own nameservers"
   - Enter: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`
   - Save

   **Option B — Add DNS Records (if you want GoDaddy as nameserver):**
   - Add A Record: Name=@ Value=76.76.21.21 TTL=600
   - Add CNAME: Name=www Value=cname.vercel-dns.com TTL=600
   - Delete any existing A record for @ pointing to GoDaddy parking

3. Wait 5-30 minutes → boredfolio.com is live with auto SSL

---

## Post-Launch Checklist

After DNS propagates:
- [ ] https://boredfolio.com loads
- [ ] https://www.boredfolio.com redirects properly
- [ ] https://boredfolio.com/explore works
- [ ] https://boredfolio.com/sitemap.xml renders
- [ ] Submit sitemap to Google Search Console
- [ ] Test OG image at opengraph.xyz
- [ ] Run PageSpeed Insights — target 90+
