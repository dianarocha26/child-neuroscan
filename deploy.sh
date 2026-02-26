#!/bin/bash

# ChildNeuroScan - Quick Deploy Script
# This script helps you deploy to Netlify quickly

echo "🚀 ChildNeuroScan Deployment Helper"
echo "===================================="
echo ""

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - ChildNeuroScan v2.1 ready for production"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  WARNING: .env file not found!"
    echo "You'll need to configure environment variables in Netlify:"
    echo "  VITE_SUPABASE_URL"
    echo "  VITE_SUPABASE_ANON_KEY"
    echo ""
else
    echo "✅ .env file exists (remember to add these to Netlify!)"
fi

# Run build to verify everything works
echo ""
echo "🔨 Running production build to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo ""
    echo "1. Push to GitHub:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/childneuroscan.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "2. Deploy to Netlify:"
    echo "   - Go to https://app.netlify.com"
    echo "   - Click 'Add new site' → 'Import an existing project'"
    echo "   - Select your GitHub repository"
    echo "   - Add environment variables:"
    echo "     VITE_SUPABASE_URL=[your_url]"
    echo "     VITE_SUPABASE_ANON_KEY=[your_key]"
    echo "   - Click 'Deploy site'"
    echo ""
    echo "3. Or drag & drop the 'dist' folder to Netlify"
    echo ""
    echo "📖 Full guide: See DEPLOYMENT_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
