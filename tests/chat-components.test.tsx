import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MessageList, {
  type Message,
} from "@/components/chat/MessageList";

import ChatInput from "@/components/chat/ChatInput";

import WebsiteTool, {
  type WebsiteToolPart,
} from "@/components/chat/WebsiteTool";

// Clean up the DOM after every test
afterEach(() => {
  cleanup();
});

// Sample chat messages
const base: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Hello",
    createdAt: "10:00",
  },
  {
    id: 2,
    role: "assistant",
    content: "Hi **there**",
    createdAt: "10:01",
  },
];

// ==========================================
// CHAT MESSAGE RENDERER TESTS
// ==========================================

describe("chat message renderer", () => {
  it("renders user and assistant messages", () => {
    render(
      <MessageList
        messages={base}
        status={null}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();

    expect(screen.getByText("there")).toBeInTheDocument();
  });

  it("renders markdown links in assistant messages", () => {
    render(
      <MessageList
        messages={[
          {
            ...base[1],
            content: "[Docs](https://example.com)",
          },
        ]}
        status={null}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Docs",
      })
    ).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("renders the pending/thinking state", () => {
    render(
      <MessageList
        messages={[]}
        status="thinking"
      />
    );

    expect(
      screen.getByText(/thinking/i)
    ).toBeInTheDocument();
  });

  it("renders the streaming/writing state", () => {
    render(
      <MessageList
        messages={[]}
        status="writing"
      />
    );

    expect(
      screen.getByText(/writing/i)
    ).toBeInTheDocument();
  });

  it("renders a completed website tool result", () => {
    const part: WebsiteToolPart = {
      type: "tool-analyzeWebsite",
      toolCallId: "1",
      state: "output-available",

      output: {
        url: "https://example.com",
        title: "Example",
        description: "A page",
        image: null,
        statusCode: 200,
      },
    };

    render(
      <MessageList
        messages={[
          {
            id: 3,
            role: "assistant",
            content: "",
            createdAt: "10:02",
            toolParts: [part],
          },
        ]}
        status={null}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Example",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("200")
    ).toBeInTheDocument();
  });

  it("renders a tool error as an alert", () => {
    const part: WebsiteToolPart = {
      type: "tool-analyzeWebsite",
      toolCallId: "2",
      state: "output-error",
      errorText: "Invalid URL",
    };

    render(
      <WebsiteTool part={part} />
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Invalid URL");
  });
});

// ==========================================
// VALIDATED CHAT INPUT TESTS
// ==========================================

describe("validated chat input", () => {
  it("does not submit an empty prompt", async () => {
    const onSend = vi.fn();

    const user = userEvent.setup();

    render(
      <ChatInput
        prompt=""
        setPrompt={vi.fn()}
        onSend={onSend}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Send message",
      })
    );

    expect(onSend).not.toHaveBeenCalled();
  });

  it("submits a non-empty prompt", async () => {
    const onSend = vi.fn();

    const setPrompt = vi.fn();

    const user = userEvent.setup();

    render(
      <ChatInput
        prompt="Explain React"
        setPrompt={setPrompt}
        onSend={onSend}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Send message",
      })
    );

    expect(onSend).toHaveBeenCalledTimes(1);
  });
});