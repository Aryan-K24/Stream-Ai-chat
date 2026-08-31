# StreamAI — FE-07 Tool Results & Structured UI

StreamAI is a Next.js AI chatbot using the Vercel AI SDK and Google Gemini. FE-07 adds a real server-side tool call and renders its lifecycle as structured UI instead of dumping JSON into the chat.

## FE-07: Website Metadata Tool

### Tool: `analyzeWebsite`

The assistant uses this tool when the user asks StreamAI to analyze, inspect, or retrieve metadata from a website URL.

### Input schema

```ts
{
  url: string; // valid http:// or https:// URL
}
```

### Return shape

```ts
{
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  statusCode: number;
}
```

### Error behavior

The tool throws a descriptive error when a webpage cannot be fetched, returns a non-2xx response, takes too long, or does not return HTML. The client renders this as a dedicated `output-error` tool card rather than crashing or displaying a raw JSON error.

## Tool lifecycle UI

The client renders all four required AI SDK tool states:

1. **`input-streaming`** — "Preparing website analysis" while the tool input is being streamed.
2. **`input-available`** — "Inspecting webpage" with the URL once the complete input is available.
3. **`output-available`** — a structured website-analysis result card with title, description, HTTP status, URL, and optional social preview.
4. **`output-error`** — a dedicated failure card explaining that the website could not be analyzed.

The tool result is rendered as a real component in `components/chat/WebsiteTool.tsx`, not as a JSON dump.

## Project structure for FE-07

```text
lib/tools/analyzeWebsite.ts       # server-side Zod tool definition
components/chat/WebsiteTool.tsx   # typed tool lifecycle + result UI
components/chat/WebsiteTool.module.css
components/chat/ChatContainer.tsx # reads typed tool parts from AI SDK messages
components/chat/MessageList.tsx
components/chat/AssistantMessage.tsx
app/api/chat/route.ts              # registers the server-side tool
```

## Run locally

```bash
npm install
npm run dev
```

Set the existing Gemini environment variable used by the project, then open `http://localhost:3000`.

### Test the successful tool call

Try:

> Analyze this website: https://example.com

### Test the designed error state

Try:

> Analyze this website: https://example.invalid

The second request should produce the designed red `output-error` tool state.
