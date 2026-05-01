# Samaritan Code

A designer-friendly AI coding assistant built on Claude, with native support for the [Life design system](https://www.laerdal.com) by Laerdal Medical.

## What it does

- Chat with Claude about your projects directly in the browser
- Browse project files and connect live previews
- Built-in Life component showroom with all `@laerdal/life-react-components` components
- Detects when Life library updates are available
- Attach images and files to your messages
- Dark mode
- Conversation history saved between sessions

## Getting started

**1. Install Node.js** (one-time)
Download and install the LTS version from [nodejs.org](https://nodejs.org).

**2. Clone or download this repo**
Click the green **Code** button above → **Download ZIP** → unzip it somewhere on your computer.

**3. Double-click `setup.command`**
This installs everything and walks you through adding your API key. You only need to do this once.

**4. Double-click `start.command` to launch the app**
From now on, this is all you need. It opens the app in your browser automatically.

> **Getting an API key:** Go to [console.anthropic.com](https://console.anthropic.com), sign up, and create a key under API Keys. The setup script will ask you to paste it in.

---

## For developers

If you prefer the terminal:

```bash
git clone https://github.com/Sorenordbo/samaritan-code.git
cd samaritan-code
npm install
cp .env.example .env.local   # then add your API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- **File browser and Finder integration** require the app to run locally on your machine — they won't work on a remote server.
- **Life library update check** — checks npm for `@laerdal/life-react-components` updates and can install them automatically.
- **Project scanning** — detects local projects in a configurable directory on your machine.

## Built with

- [Next.js](https://nextjs.org) (App Router)
- [Anthropic Claude API](https://docs.anthropic.com)
- [@laerdal/life-react-components](https://www.npmjs.com/package/@laerdal/life-react-components)
- [styled-components](https://styled-components.com)
- [react-markdown](https://github.com/remarkjs/react-markdown)
