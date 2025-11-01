# Deploying NeuralChat to Vercel

## Quick Deployment Steps

### 1. Push to GitHub (if not already done)

```bash
git push -u origin main
```

If you encounter authentication issues, you may need to:
- Use a personal access token instead of password
- Or use SSH: `git remote set-url origin git@github.com:NayakSubhasish/CHATBOT.git`

### 2. Deploy to Vercel

1. **Visit Vercel**: Go to [https://vercel.com](https://vercel.com)
2. **Sign In**: Use your GitHub account to sign in
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your repository: `NayakSubhasish/CHATBOT`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Environment Variables**:
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key
   - Click "Add"
   - Make sure it's enabled for Production, Preview, and Development

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

### 3. Post-Deployment

- Your app will be live at: `https://your-project-name.vercel.app`
- Vercel automatically deploys on every push to main branch
- Check the deployment logs in the Vercel dashboard

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+ (Vercel auto-detects)
- Check build logs in Vercel dashboard

### API Key Issues
- Make sure `GEMINI_API_KEY` is set in Vercel environment variables
- Redeploy after adding environment variables

### Pattern Not Visible
- The background pattern uses opacity 0.25 - may need adjustment for different screens
- Check browser console for any CSS errors

