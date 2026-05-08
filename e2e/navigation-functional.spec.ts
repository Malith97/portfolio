import { expect, test } from "@playwright/test";

test("navigation, story anchors, and core routes work without console errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await page.waitForSelector('[data-testid="nav-link-story"]', {
    state: "visible",
  });

  await page.goto("/story");
  await expect(page).toHaveURL(/\/story$/);
  await expect(
    page.getByRole("heading", { name: /From Curiosity to Reliability/i }),
  ).toBeVisible();

  await expect(page.getByTestId("nav-link-story")).toHaveAttribute(
    "aria-current",
    "page",
  );

  // Story chapter links are rendered after page hydration; wait before anchor navigation.
  await page.waitForSelector('aside a[href="#chapter-06"]', {
    state: "visible",
  });
  await page.locator('aside a[href="#chapter-06"]').first().click();
  await expect(page).toHaveURL(/#chapter-06$/);
  await expect(
    page
      .locator('aside a[aria-current="location"][href="#chapter-06"]')
      .first(),
  ).toBeVisible();

  await page.goto("/case-studies");
  await page.waitForSelector('a[href^="/case-studies/"]', { state: "visible" });
  await expect(
    page.getByRole("heading", {
      name: /Infrastructure & Delivery Case Studies/i,
    }),
  ).toBeVisible();

  await page.locator('a[href^="/case-studies/"]').first().click();
  await expect(page).toHaveURL(/\/case-studies\/[^/]+$/);

  await page.goto("/contact");
  await expect(
    page.getByRole("heading", {
      name: /Let’s build reliable systems together/i,
    }),
  ).toBeVisible();

  expect(
    consoleErrors,
    `Browser console errors: ${consoleErrors.join("\n")}`,
  ).toEqual([]);
});
