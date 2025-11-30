import { test, expect } from "@playwright/test";

// Env-driven creds / API
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@example.com";
const OWNER_PASS = process.env.OWNER_PASS || "123456";
const API_URL = process.env.API_URL || "http://localhost:4000";

test("Owner workflow: client -> project -> card -> update -> delete", async ({ page, request }) => {
  // 1) Login as Owner via UI
  await page.goto("/");
  await page.goto("/login");
  await page.fill('input[placeholder="email"]', OWNER_EMAIL);
  await page.fill('input[placeholder="password"]', OWNER_PASS);
  await page.click("text=Login as Owner");
  await expect(page).toHaveURL(/office\/pipeline|office\/dashboard|field\/today/);

  // 2) Create Client (full fields)
  await page.goto("/office/clients");
  const clientName = `Client ${Date.now()}`;
  await page.fill('input[placeholder="Name *"]', clientName);
  await page.fill('input[placeholder="Phone"]', "123-456-7890");
  await page.fill('input[placeholder="Email"]', "client@test.com");
  await page.fill('input[placeholder="Address"]', "123 Main St");
  await page.fill('textarea[placeholder="Notes"]', "Test notes");
  await page.click("text=Add Client");
  await expect(page.locator(`text=${clientName}`)).toBeVisible();

  // 3) Create Project for that client via API to simplify
  const authHeaders = await authHeaderFromPage(page);
  const clientRes = await request.get(`${API_URL}/clients`, {
    headers: authHeaders
  });
  const clients = await clientRes.json();
  const myClient = Array.isArray(clients)
    ? clients.find((c: any) => c.name === clientName)
    : null;
  expect(myClient).toBeTruthy();
  const projectName = `Project ${Date.now()}`;
  const projRes = await request.post(`${API_URL}/projects`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: { name: projectName, client_id: myClient.id }
  });
  expect(projRes.ok()).toBeTruthy();

  // 4) Create Card in Pipeline
  await page.goto("/office/create-card");
  await page.fill("input[placeholder='Card title']", "Card 1");
  await page.selectOption("select", { label: "Task" });
  // select client
  await page.selectOption("select", { value: myClient.id });
  // select project (second select on page)
  const selects = page.locator("select");
  await selects.nth(1).selectOption({ label: projectName });
  await page.click("text=Create Card");

  // Card opens; go to pipeline to verify
  await page.goto("/office/pipeline");
  await expect(page.locator("text=Card 1")).toBeVisible();

  // 5) Update Card status to Doing via drag/drop API (simpler via API)
  const cardsRes = await request.get(`${API_URL}/cards`, {
    headers: authHeaderFromPage(page)
  });
  const cards = await cardsRes.json();
  const card = cards.find((c: any) => c.title === "Card 1");
  expect(card).toBeTruthy();
  await request.patch(`${API_URL}/cards/${card.id}`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: { status: "Doing", title: "Card 1 Updated" }
  });

  // Verify status in pipeline
  await page.goto("/office/pipeline");
  await expect(page.locator("text=Card 1 Updated")).toBeVisible();

  // 6) Delete the card via API
  await request.delete(`${API_URL}/cards/${card.id}`, {
    headers: authHeaders
  });

  // Confirm gone
  await page.goto("/office/pipeline");
  await expect(page.locator("text=Card 1 Updated")).toHaveCount(0);
});

async function authHeaderFromPage(page: any) {
  const token = await page.evaluate(() => localStorage.getItem("token"));
  if (!token) {
    throw new Error("No token found in localStorage");
  }
  return {
    Authorization: "Bearer " + token
  };
}
