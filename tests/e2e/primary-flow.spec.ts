import { test, expect } from "@playwright/test";

test("user can send a prompt and see the assistant response", async ({ page }) => {
  await page.route("**/api/chat", async route => {
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: '0:"Mock response from StreamAI"\n',
    });
  });

  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Message StreamAI" });
  await input.fill("Explain React");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Explain React")).toBeVisible();
});
