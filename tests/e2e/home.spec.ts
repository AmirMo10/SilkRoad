import { test, expect } from "@playwright/test";

test.describe("Home page (Persian / RTL)", () => {
  test("renders RTL with brand headline and shipping tiers", async ({ page }) => {
    await page.goto("/fa");

    // RTL direction
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");

    // Brand headline
    await expect(page.getByRole("heading", { name: "راه ابریشم" })).toBeVisible();

    // All 3 shipping tiers
    await expect(page.getByText("اکسپرس", { exact: false })).toBeVisible();
    await expect(page.getByText("عادی", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("اقتصادی", { exact: false })).toBeVisible();

    // MOQ badge with Persian digits visible somewhere
    await expect(page.getByText(/حداقل سفارش/)).toBeVisible();
  });

  test("English locale renders LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "SilkRoad" })).toBeVisible();
  });
});
