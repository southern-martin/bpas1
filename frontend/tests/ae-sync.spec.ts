import { test, expect } from "@playwright/test";

const API_URL = process.env.API_URL || "http://localhost:4000";

test("AE: offline card update queues and syncs when back online", async ({ page, request }) => {
  // 1) Create a card via API
  const createRes = await request.post(`${API_URL}/cards`, {
    headers: { "Content-Type": "application/json" },
    data: {
      title: `AE Card ${Date.now()}`,
      type: "Task",
      status: "To Do",
      assigned_to_user_id: "staff-1"
    }
  });
  expect(createRes.ok()).toBeTruthy();
  const card = await createRes.json();

  // 2) Open the card while online to cache it
  await page.goto(`/field/card/${card.id}`);
  await expect(page.getByText(card.title)).toBeVisible();

  // 3) Go offline and perform an update (status change + notes)
  await page.context().setOffline(true);
  await page.selectOption("select.status-select", { label: "Done" });
  await page.fill("textarea.notes-input", "Offline update");
  await page.click("button.save-btn");

  // Wait for navigation back to Field Today
  await page.waitForURL(/\/field\/today/);

  // 4) Go back online and allow sync loop to run (online event triggers processQueue)
  await page.context().setOffline(false);
  // Wait a bit for sync loop to push the queue
  await page.waitForTimeout(5000);

  // 5) Verify backend reflects the update
  const cardAfter = await request.get(`${API_URL}/cards/${card.id}`);
  const updated = await cardAfter.json();
  expect(updated.status).toBe("Done");
});
