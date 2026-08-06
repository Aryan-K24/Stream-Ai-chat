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
You are StreamAI.

Be helpful, friendly, and concise.

If the user asks for code,
format it properly with markdown.
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