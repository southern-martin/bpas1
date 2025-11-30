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

  // Grab token for API calls
  const authHeaders = await authHeaderFromPage(page);
  const clientName = `Client ${Date.now()}`;

  // 2) Create Client via API (includes contact fields)
  const clientRes = await request.post(`${API_URL}/clients`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: {
      name: clientName,
      phone: "123-456-7890",
      email: "client@test.com",
      address: "123 Main St",
      notes: "Test notes"
    }
  });
  expect(clientRes.ok()).toBeTruthy();
  const createdClient = await clientRes.json();

  // 3) Create Project for that client via API
  const projectName = `Project ${Date.now()}`;
  const projRes = await request.post(`${API_URL}/projects`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: { name: projectName, client_id: createdClient.id }
  });
  expect(projRes.ok()).toBeTruthy();

  // 4) Create Card via API
  const cardRes = await request.post(`${API_URL}/cards`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: {
      title: `Card ${Date.now()}`,
      type: "Task",
      linked_client_id: createdClient.id,
      linked_project_id: (await projRes.json()).id,
      assigned_to_user_id: null
    }
  });
  expect(cardRes.ok()).toBeTruthy();
  const card = await cardRes.json();

  // Verify in pipeline UI
  await page.goto("/office/pipeline");
  await expect(page.locator(`text=${card.title}`)).toBeVisible();

  // 5) Update Card status to Doing via API
  await request.patch(`${API_URL}/cards/${card.id}`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: { status: "Doing", title: `${card.title} Updated` }
  });

  // Verify status in pipeline
  await page.goto("/office/pipeline");
  await expect(page.locator(`text=${card.title} Updated`)).toBeVisible();

  // (Optional) Mark Done via API to simulate removal from active work
  await request.patch(`${API_URL}/cards/${card.id}`, {
    headers: { ...authHeaders, "Content-Type": "application/json" },
    data: { status: "Done" }
  });

  await page.goto("/office/pipeline");
  await expect(page.locator("text=Card 1 Updated")).toBeVisible();
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
