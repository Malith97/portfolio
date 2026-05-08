import { expect, test } from "@playwright/test";

test("detail pages switch language EN <-> FI without stale content", async ({
  page,
}) => {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/case-studies/cloud-cost-optimization");
  await page.waitForSelector('[data-testid="language-toggle"]', {
    state: "visible",
  });

  await page.getByTestId("lang-fi").click();
  await expect(page.getByTestId("lang-fi")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("nav-link-case-studies")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Pilvikustannusten optimointi ja 35 prosentin säästö/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/Pilvikulut laskivat 35 prosenttia/i).first(),
  ).toBeVisible();

  await page.getByTestId("lang-eng").click();
  await expect(page.getByTestId("lang-eng")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("heading", {
      name: /The problem/i,
    }),
  ).toBeVisible();

  await page.getByTestId("lang-fi").click();
  await expect(
    page.getByRole("heading", {
      name: /Pilvikustannusten optimointi ja 35 prosentin säästö/i,
    }),
  ).toBeVisible();

  await page.goto("/beyond-work/running-to-vartto");
  await page.waitForSelector('[data-testid="nav-link-beyond-work"]', {
    state: "visible",
  });
  await expect(page.getByTestId("nav-link-beyond-work")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Talvinen iltalenkki Värttöön/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Lyhyt talvinen iltajuoksu/i)).toBeVisible();

  await page.getByTestId("lang-eng").click();
  await expect(
    page.getByRole("heading", {
      name: /Evening Winter Run in Värttö/i,
    }),
  ).toBeVisible();

  expect(
    consoleErrors,
    `Browser console errors: ${consoleErrors.join("\n")}`,
  ).toEqual([]);
});
