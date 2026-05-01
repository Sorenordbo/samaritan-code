#!/bin/bash

# Go to the folder this script lives in
cd "$(dirname "$0")"

clear
echo "╔══════════════════════════════════════╗"
echo "║       Samaritan Code — Setup         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "⚠️  Node.js is not installed."
  echo ""
  echo "Please install it first:"
  echo "→ Go to https://nodejs.org and download the LTS version"
  echo "→ Install it, then double-click setup.command again"
  echo ""
  read -p "Press Enter to close..."
  exit 1
fi

echo "✓ Node.js found ($(node -v))"
echo ""

# Install dependencies
echo "Installing dependencies (this may take a minute)..."
npm install --silent
echo "✓ Dependencies installed"
echo ""

# Check for existing API key
if [ -f ".env.local" ] && grep -q "ANTHROPIC_API_KEY=sk-" .env.local; then
  echo "✓ API key already configured"
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Anthropic API key needed"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "To get an API key:"
  echo "1. Go to https://console.anthropic.com"
  echo "2. Sign up or log in"
  echo "3. Go to API Keys and create a new key"
  echo "4. Copy it and paste it below"
  echo ""
  read -p "Paste your API key here: " api_key

  if [[ ! "$api_key" == sk-* ]]; then
    echo ""
    echo "⚠️  That doesn't look like a valid API key (should start with sk-)"
    echo "Please run setup again and try again."
    read -p "Press Enter to close..."
    exit 1
  fi

  echo "ANTHROPIC_API_KEY=$api_key" > .env.local
  echo "✓ API key saved"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  All done! Starting Samaritan Code..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The app will open in your browser at"
echo "http://localhost:3000"
echo ""
echo "Keep this window open while using the app."
echo "Close it to stop the app."
echo ""

# Open browser after a short delay
sleep 2
open http://localhost:3000

# Start the app
npm run dev
