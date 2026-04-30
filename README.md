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

## Requirements

- [Node.js](https://nodejs.org) 18 or later
- An [Anthropic API key](https://console.anthropic.com)

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/your-username/samaritan-code.git
cd samaritan-code
```

**2. Install dependencies**

```bash
npm install
```

**3. Add your API key**

Copy the example env file and add your key:

```bash
cp .env.example .env.local
```

Then open `.env.local` and replace `your-api-key-here` with your Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

**4. Run the app**

```bash
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
