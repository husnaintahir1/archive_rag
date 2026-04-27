# Client App

A minimal, polished chat front-end for the RAG platform. Built with Vite + React + TypeScript + Tailwind.

## Run locally

```bash
cd client-app
npm install
npm run dev
```

Then open http://localhost:5173.

By default the app runs in **demo mode** with mocked responses so you can see the UI without the backend running.

## Connect to the backend

Copy `.env.example` to `.env` and fill in:

```
VITE_API_URL=http://localhost:9380
VITE_API_KEY=<your-api-key>
```

Restart `npm run dev`. The "Demo mode" badge will disappear and chat will hit the real backend.

## Build for production

```bash
npm run build
npm run preview   # local smoke test of the built bundle
```

The output goes to `dist/`. Serve it from any static host (nginx, Vercel, S3+CloudFront, etc.).

## Features

- Sidebar with conversation history and per-conversation knowledge base selection
- Streaming-style "typing" indicator while the backend thinks
- Markdown answers with code blocks, lists, tables (via `react-markdown` + `remark-gfm`)
- Expandable source citations with snippets
- Copy-to-clipboard on assistant messages
- Auto-resizing input box, `Enter` to send, `Shift+Enter` for newline
- Suggested prompts on the empty state
- Responsive layout, smooth animations, keyboard friendly
