import { expect, test, type Page } from "@playwright/test";

test.setTimeout(120_000);

type RouteExpectation = {
  path: string;
  headingEn: RegExp;
  headingFi: RegExp;
};

const routeExpectations: RouteExpectation[] = [
  {
    path: "/story",
    headingEn: /From Curiosity to Reliability/i,
    headingFi: /Uteliaisuudesta luotettavuuteen/i,
  },
  {
    path: "/work-education",
    headingEn: /Work & Education/i,
    headingFi: /Työkokemus ja koulutus/i,
  },
  {
    path: "/beyond-work",
    headingEn: /Life outside work/i,
    headingFi: /Elämää työn ulkopuolella/i,
  },
  {
    path: "/contact",
    headingEn: /Let’s build reliable systems together/i,
    headingFi: /Rakennetaan luotettavia järjestelmiä yhdessä/i,
  },
];

async function expectRouteInLanguage(
  page: Page,
  route: RouteExpectation,
  language: "eng" | "fi",
) {
  await page.goto(route.path, { waitUntil: "domcontentloaded" });

  const headingPattern = language === "fi" ? route.headingFi : route.headingEn;

  await expect(
    page.getByRole("heading", { name: headingPattern }).first(),
  ).toBeVisible();
}

async function switchLanguage(page: Page, language: "eng" | "fi") {
  const buttonLabel = language === "fi" ? "FI" : "EN";
  const markerLabel = language === "fi" ? "Työnäytteet" : "Case Studies";

  await page.getByRole("button", { name: buttonLabel, exact: true }).click();
  await expect(
    page.getByRole("button", { name: buttonLabel, exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: markerLabel })).toBeVisible();
  await page.waitForLoadState("networkidle");
}

test("main routes stay consistent in FI and EN after toggle and refresh", async ({
  page,
}) => {
  await page.goto("/");

  await switchLanguage(page, "fi");

  for (const route of routeExpectations) {
    await expectRouteInLanguage(page, route, "fi");
  }

  await page.reload();
  await expectRouteInLanguage(
    page,
    routeExpectations[routeExpectations.length - 1],
    "fi",
  );

  await switchLanguage(page, "eng");

  for (const route of routeExpectations) {
    await expectRouteInLanguage(page, route, "eng");
  }

  await page.reload();
  await expectRouteInLanguage(
    page,
    routeExpectations[routeExpectations.length - 1],
    "eng",
  );
});
