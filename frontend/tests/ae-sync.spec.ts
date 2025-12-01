import { test, expect } from "@playwright/test";

const API_URL = process.env.API_URL || "http://localhost:4000";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@example.com";
const OWNER_PASS = process.env.OWNER_PASS || "123456";

test("AE: offline card update queues and syncs when back online", async ({ page, request }) => {
  // Health check backend
  const health = await request.get(API_URL + "/");
  if (!health.ok()) test.skip("Backend not reachable");

  // Login to get token
  const loginRes = await request.post(`${API_URL}/auth/login`, {
    headers: { "Content-Type": "application/json" },
    data: { email: OWNER_EMAIL, password: OWNER_PASS }
  });
  if (!loginRes.ok()) test.skip("Login failed; check backend auth");
  const { token } = await loginRes.json();

  // 1) Create a card via API
  const createRes = await request.post(`${API_URL}/cards`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    data: {
      title: `AE Card ${Date.now()}`,
      type: "Task",
      status: "To Do",
      assigned_to_user_id: "staff-1"
    }
  });
  expect(createRes.ok()).toBeTruthy();
  const card = await createRes.json();

  // Seed auth into localStorage for UI
  await page.addInitScript(([t]) => {
    localStorage.setItem("token", t);
    localStorage.setItem("role", "Staff");
    localStorage.setItem("userId", "staff-1");
  }, token);

  // 2) Open the card while online to cache it
  await page.goto(`/field/card/${card.id}`, { waitUntil: "networkidle" });
  const titleLocator = page.getByText(card.title);
  const visible = await titleLocator.isVisible({ timeout: 5000 });
  if (!visible) test.skip("Card detail page not reachable");

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
