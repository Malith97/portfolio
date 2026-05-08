import { expect, test } from "@playwright/test";

test("homepage renders core hero content", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('[data-testid="nav-link-case-studies"]', {
    state: "visible",
  });
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("nav-link-case-studies")).toBeVisible();
});

test("primary navigation opens case studies", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('[data-testid="nav-link-case-studies"]', {
    state: "visible",
  });
  await page.getByTestId("nav-link-case-studies").click();

  await expect(page).toHaveURL(/\/case-studies$/);
  await expect(
    page.getByRole("heading", {
      name: "Infrastructure & Delivery Case Studies",
    }),
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
      url: baseURL ?? "http://localhost:4173",
    },
  ]);

  await page.goto("/");
  await page.waitForSelector('[data-testid="nav-link-case-studies"]', {
    state: "visible",
  });
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();
  await expect(page.getByTestId("nav-link-case-studies")).toBeVisible();
});

test("language toggle switches both ways and persists after refresh", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForSelector('[data-testid="language-toggle"]', {
    state: "visible",
  });
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();

  await page.getByTestId("lang-fi").click();
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();
  await expect(page.getByTestId("nav-link-case-studies")).toBeVisible();
  await expect(page.getByTestId("lang-fi")).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload();
  await expect(
    page.getByRole("heading", { name: /DevOps-insinööri/i }).first(),
  ).toBeVisible();

  await page.getByTestId("lang-eng").click();
  await expect(
    page.getByRole("heading", {
      name: /DevOps Engineer building resilient cloud systems/i,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("nav-link-case-studies")).toBeVisible();
  await expect(page.getByTestId("lang-eng")).toHaveAttribute(
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
