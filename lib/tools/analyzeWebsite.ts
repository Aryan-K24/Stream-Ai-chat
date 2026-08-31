import { tool } from "ai";
import { z } from "zod";

const analyzeWebsiteInput = z.object({
  url: z
    .string()
    .url()
    .refine(
      (value) => value.startsWith("https://") || value.startsWith("http://"),
      "URL must use http:// or https://",
    )
    .describe("The full webpage URL to inspect, including http:// or https://"),
});

export type WebsiteMetadata = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  statusCode: number;
};

function extractMeta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta\\b[^>]*(?:name|property)\\s*=\\s*["']${escaped}["'][^>]*content\\s*=\\s*["']([^"']*)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta\\b[^>]*content\\s*=\\s*["']([^"']*)["'][^>]*(?:name|property)\\s*=\\s*["']${escaped}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}


function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.replace(/\s+/g, " ").trim() || null;
}

export const analyzeWebsite = tool({
  description:
    "Fetch a webpage and return its title, meta description, social preview image, and HTTP status. Use this when the user asks to analyze, inspect, or get metadata from a website URL.",
  inputSchema: analyzeWebsiteInput,
  execute: async ({ url }): Promise<WebsiteMetadata> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "StreamAI-FE07/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`The website returned HTTP ${response.status}.`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        throw new Error("The URL did not return an HTML webpage.");
      }

      const html = (await response.text()).slice(0, 1_000_000);

      return {
        url: response.url,
        title: extractTitle(html),
        description:
          extractMeta(html, "description") ??
          extractMeta(html, "og:description"),
        image: extractMeta(html, "og:image"),
        statusCode: response.status,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("The website took too long to respond.");
      }

      throw error instanceof Error
        ? error
        : new Error("The website could not be analyzed.");
    } finally {
      clearTimeout(timeout);
    }
  },
});
