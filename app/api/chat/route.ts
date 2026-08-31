import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";

import { analyzeWebsite } from "@/lib/tools/analyzeWebsite";

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

WEBSITE TOOL RULES:
- You have access to a server-side tool named analyzeWebsite.
- When the user asks you to analyze, inspect, review, or get metadata from a website URL, use analyzeWebsite instead of guessing.
- If the user provides a URL and clearly asks for website information, use the tool.
- After the tool returns, explain the result naturally. Do not dump the raw tool JSON into the chat.
- If the tool fails, be honest about the failure and explain what the user can try next.

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
      `,

      messages: modelMessages,
      tools: {
        analyzeWebsite,
      },
      stopWhen: stepCountIs(3),
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
      },
    );
  }
}
