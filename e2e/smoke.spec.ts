import { expect, test } from "@playwright/test";

test("homepage renders core hero content", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /View Work/i })).toBeVisible();
});

test("primary navigation opens case studies", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Case Studies" }).click();

  await expect(page).toHaveURL(/\/case-studies$/);
  await expect(
    page.getByRole("heading", { name: "Selected Work" }),
  ).toBeVisible();
});

test("Finnish locale renders when language cookie is set", async ({
  context,
  page,
  baseURL,
}) => {
  await context.addCookies([
    {
      name: "portfolio-lang",
      value: "fi",
      url: baseURL ?? "http://127.0.0.1:4173",
    },
  ]);

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Työnäytteet" })).toBeVisible();
});

test("language toggle switches both ways and persists after refresh", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "FI" }).click();
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Työnäytteet" })).toBeVisible();
  await expect(page.getByRole("button", { name: "FI" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload();
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "EN" }).click();
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Case Studies" })).toBeVisible();
  await expect(page.getByRole("button", { name: "EN" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();
});
