#!/bin/bash

# Go to the folder this script lives in
cd "$(dirname "$0")"

clear
echo "╔══════════════════════════════════════╗"
echo "║       Samaritan Code — Starting      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check setup has been run
if [ ! -f ".env.local" ] || ! grep -q "ANTHROPIC_API_KEY=sk-" .env.local; then
  echo "⚠️  Setup has not been completed yet."
  echo ""
  echo "Please double-click setup.command first."
  echo ""
  read -p "Press Enter to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "⚠️  Dependencies missing. Running setup first..."
  npm install --silent
fi

echo "Starting Samaritan Code..."
echo ""
echo "The app will open in your browser at"
echo "http://localhost:3000"
echo ""
echo "Keep this window open while using the app."
echo "Close it to stop the app."
echo ""

sleep 2
open http://localhost:3000
npm run dev
