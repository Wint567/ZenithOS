import { expect, test, type Page } from "@playwright/test";

async function resetApp(page: Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function login(page: Page) {
  await resetApp(page);
  await page.goto("/login");
  await page.getByRole("button", { name: /continue as demo admin/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("ZenithOS release smoke coverage", () => {
  test("protects dashboard routes and restores a demo session", async ({ page }) => {
    await resetApp(page);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await page.getByRole("button", { name: /continue as demo admin/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /executive dashboard/i })).toBeVisible();
  });

  test("supports command palette keyboard navigation and theme switching", async ({ page }) => {
    await login(page);
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    await expect(page.getByRole("dialog", { name: /command palette/i })).toBeVisible();
    await page.getByPlaceholder(/search pages/i).fill("design system");
    await page.getByRole("button", { name: /open design system/i }).click();
    await expect(page).toHaveURL(/\/design-system/);
    await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
    await page.getByPlaceholder(/search pages/i).fill("light mode");
    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("persists dashboard layout customization controls", async ({ page, isMobile }) => {
    test.skip(isMobile, "Dashboard layout density controls are covered in the desktop canvas test.");
    await login(page);
    await page.getByRole("button", { name: "Growth" }).click();
    await page.getByLabel(/resize revenue trajectory/i).selectOption("md");
    await page.reload();
    await expect(page.getByLabel(/resize revenue trajectory/i)).toHaveValue("md");
    await expect(page.getByText(/drag to reorder · revenue trajectory/i)).toBeVisible();
  });

  test("runs table selection and bulk order mutations", async ({ page, isMobile }) => {
    test.skip(isMobile, "Bulk table selection uses the desktop enterprise table; mobile cards have separate touch behavior.");
    await login(page);
    await page.goto("/orders");
    await page.getByLabel(/select row/i).first().check();
    await expect(page.getByRole("button", { name: /bulk actions/i })).toBeEnabled();
    await page.getByRole("button", { name: /bulk actions/i }).click();
    await page.getByRole("menuitem", { name: /move to pending review/i }).click();
    await expect(page.getByText(/selected order/i).first()).toBeVisible();
    await page.goto("/audit");
    await expect(page.getByRole("button", { name: /marked 1 order as pending/i }).first()).toBeVisible();
  });

  test("connects and disconnects integrations with audit history", async ({ page }) => {
    await login(page);
    await page.goto("/integrations");
    await expect(page.getByRole("heading", { name: "Integrations" })).toBeVisible();
    await page.getByRole("button", { name: /^Connect$/ }).first().click();
    await expect(page.getByRole("dialog", { name: /review integration permissions/i })).toBeVisible();
    await page.getByRole("button", { name: /approve and connect/i }).click();
    await expect(page.getByText(/connected/i).first()).toBeVisible();
    await page.goto("/audit");
    await expect(page.getByRole("button", { name: /connected integration/i }).first()).toBeVisible();
  });

  test("opens modals and closes them with Escape", async ({ page }) => {
    await login(page);
    await page.goto("/products");
    await page.getByRole("button", { name: /add product/i }).click();
    await expect(page.getByRole("dialog", { name: /create product/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /create product/i })).toBeHidden();
  });

  test("uses Zenith AI actions and mobile navigation remains reachable", async ({ page, isMobile }) => {
    await login(page);
    if (isMobile) {
      await expect(page.getByRole("navigation").last()).toBeVisible();
    }
    await page.getByRole("button", { name: /zenith ai/i }).click();
    await expect(page.getByRole("dialog", { name: /zenith ai/i })).toBeVisible();
    await page.getByRole("button", { name: /generate workspace recommendation/i }).click();
    await expect(page.getByRole("dialog", { name: /zenith ai/i }).getByText(/revenue is tracking|inventory is below target|invoice/i).first()).toBeVisible();
  });
});
