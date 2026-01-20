# Deployment Guide - Railway (Recommended)

## Why Not GitHub Pages?

GitHub Pages **cannot** run your app because it only hosts static files (HTML/CSS/JS). Your NoteTaker app needs:
- ✅ Node.js server (to run Express)
- ✅ Database (SQLite)
- ✅ API endpoints
- ✅ Server-side authentication

**Solution:** Deploy to Railway, Render, or similar platforms that support Node.js.

---

## Deploy to Railway (Free & Easy)

### Step 1: Push Your Code to GitHub

If you haven't already:
```bash
cd /Users/jeff/Library/CloudStorage/Dropbox/claude/notetaker/notetaker-app

git add .
git commit -m "Add Railway config"
git push origin main
```

### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**

2. **Sign up** using your GitHub account

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `notetaker-app` repository
   - Click "Deploy Now"

4. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:

   ```
   JWT_SECRET=change-this-to-a-random-secret-key-12345
   NODE_ENV=production
   PORT=3001
   ```

5. **Wait for Deployment**
   - Railway will automatically build and deploy
   - Takes about 3-5 minutes
   - Watch the "Deployments" tab for progress

6. **Get Your URL**
   - Click "Settings" tab
   - Under "Domains", click "Generate Domain"
   - You'll get a URL like: `https://notetaker-production.up.railway.app`
   - Click it to open your app!

7. **Create Your Account**
   - Click "Register"
   - Choose username and password
   - Start using your app!

### Troubleshooting Railway

**Build Failed?**
- Check the build logs in Railway
- Make sure all files were pushed to GitHub
- Verify `railway.json` and `railway.toml` are in your repo root

**App Not Loading?**
- Check environment variables are set correctly
- Look at deployment logs for errors
- Make sure `NODE_ENV=production`

**Database Issues?**
- SQLite file will be created automatically
- Note: Railway may reset database on redeployments (free tier)
- For persistent data, upgrade to paid tier or use external database

---

## Alternative: Deploy to Render

### Step 1: Push to GitHub (if not done)

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)**

2. **Sign up** with GitHub

3. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Click "Connect"

4. **Configure Service**
   - **Name**: `notetaker-app`
   - **Environment**: `Node`
   - **Build Command**:
     ```
     cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**:
     ```
     cd server && node server.js
     ```

5. **Add Environment Variables**
   - Click "Environment" in the sidebar
   - Add:
     ```
     JWT_SECRET=your-random-secret-key
     NODE_ENV=production
     ```

6. **Create Web Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://notetaker-app.onrender.com`

---

## Alternative: Deploy to Fly.io

1. Install Fly CLI:
   ```bash
   brew install flyctl
   ```

2. Login:
   ```bash
   fly auth login
   ```

3. Create app:
   ```bash
   cd /Users/jeff/Library/CloudStorage/Dropbox/claude/notetaker/notetaker-app
   fly launch
   ```

4. Follow prompts to deploy

---

## What About GitHub Pages?

**Option: Disable GitHub Pages**

Since GitHub Pages can't run your app:

1. Go to your GitHub repository
2. Settings → Pages
3. Under "Source", select "None"
4. Save

This will remove the README-only page.

**Or: Keep GitHub Pages for Documentation**

Leave it as-is to show the README as documentation, but add this note at the top of your README:

```markdown
🚀 **[Live App on Railway](https://your-app.railway.app)** 🚀

(Note: This GitHub Pages site shows documentation only. The app runs on Railway.)
```

---

## Accessing Your App

Once deployed:

### On Desktop
- Open your Railway/Render URL in any browser
- Register an account
- Start taking notes!

### On Mobile
- Open the same URL on your phone
- Works great on iOS and Android
- Add to home screen for app-like experience

### Share with Others
- Your URL is public (but accounts are private)
- Anyone can register their own account
- Each user's data is separate and secure

---

## Cost

### Railway
- **Free Tier**: $5 of free credits per month
- **Paid**: $5/month for more resources
- Good for personal use

### Render
- **Free Tier**: Available (with some limitations)
- **Paid**: $7/month for better performance
- Auto-sleeps after 15 min of inactivity (free tier)

### Fly.io
- **Free Tier**: 3 small VMs free
- **Paid**: Pay as you go

**Recommendation:** Start with Railway's free tier.

---

## After Deployment

### Update Your App
When you make changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway/Render will automatically redeploy!

### Backup Your Data
- Download the SQLite database file periodically
- Or export notes manually
- Free tiers may not persist data across deployments

### Custom Domain (Optional)
- Buy a domain (e.g., from Namecheap)
- Connect it in Railway/Render settings
- Example: `notes.yourdomain.com`

---

## Security Reminders

✅ **Change JWT_SECRET** to a strong random value
✅ **Use HTTPS** (Railway/Render provide this automatically)
✅ **Don't share your password** or database file
✅ **Regular backups** if using free tier

---

## Need Help?

**Railway Issues:**
- Check [Railway Docs](https://docs.railway.app/)
- Discord: [Railway Community](https://discord.gg/railway)

**App Issues:**
- Check the main README.md
- Review server logs in Railway dashboard

---

## Summary

1. ✅ Push code to GitHub
2. ✅ Sign up for Railway
3. ✅ Deploy from GitHub repo
4. ✅ Add environment variables
5. ✅ Get your URL and use your app!

Total time: **10-15 minutes** 🚀

Enjoy your NoteTaker app!
