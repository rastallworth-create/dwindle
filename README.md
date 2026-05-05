# Dwindle 🎯

Reveal the hidden photo tile by tile. One puzzle a day. Beat your friends.

## Deploy in 4 Steps

### Step 1 — Get free Unsplash API key
1. Go to unsplash.com/developers
2. Click New Application
3. Copy your Access Key

### Step 2 — Put this folder on GitHub
1. Go to github.com → + → New repository → name it "dwindle" → Public → Create
2. Click "uploading an existing file"
3. Drag ALL files from this folder → Commit changes

### Step 3 — Deploy on Vercel
1. Go to vercel.com → Sign up with GitHub
2. Add New Project → import your dwindle repo → Deploy
3. Settings → Environment Variables → Add:
   Name: UNSPLASH_ACCESS_KEY  Value: (your key from Step 1)
4. Deployments → Redeploy

Your game is live at your-project.vercel.app

### Step 4 — Connect your domain (optional)
1. Buy domain at namecheap.com (try playdwindle.com)
2. Vercel → Settings → Domains → add your domain
3. Update nameservers at Namecheap as instructed
4. Wait 10-30 min

## File Structure
- public/index.html   The entire game
- api/image.js        Fetches Unsplash photo (keeps key secret)
- api/daily.js        Returns same game index to all players daily
- vercel.json         Vercel config

## Stuck? 
Go back to Claude and describe exactly what you see. It built this and knows every line.
