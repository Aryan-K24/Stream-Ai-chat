import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: UIMessage[];
    };

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google("gemini-3-flash-preview"),

      system: `
You are StreamAI, a helpful and friendly AI assistant.

General rules:
- Be helpful, clear, and concise.
- Use Markdown when it improves readability.
- Format code using fenced Markdown code blocks.
- Use headings, bullet points, and numbered lists when appropriate.
- Do not use raw Markdown symbols such as **text** or *text* outside valid Markdown formatting.

TABLE RULES:
When presenting tabular information, ALWAYS use a valid Markdown table.

A valid Markdown table MUST follow this exact structure:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |

Important:
- Put each row on its own line.
- Put every column between | characters.
- The separator row must contain dashes.
- NEVER put the entire table on one line.
- NEVER combine the header, separator, and data rows into a single line.
- NEVER escape the | characters with backslashes.
- Keep the number of cells consistent across every row.

Example:

| Destination | Flight | Stay & Food | Best For |
|---|---:|---:|---|
| Vietnam | ₹22,000 | ₹25,000 | Nature & Culture |
| Thailand | ₹18,000 | ₹20,000 | Beaches & Shopping |
| Bali | ₹30,000 | ₹20,000 | Romantic & Scenic |

If you provide a table, make sure it follows this format exactly.
      `,

      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}