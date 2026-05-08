import type { Language } from "@/lib/i18n";

interface PostTranslation {
  titleFi: string;
  summaryFi: string;
}

const postTranslations: Record<string, PostTranslation> = {
  "cloud-cost-optimization": {
    titleFi: "Pilvikustannusten optimointi",
    summaryFi:
      "Käytännön FinOps-työ pudotti kustannuksia 35 prosenttia ilman palvelutason heikkenemistä.",
  },
  "kubernetes-rbac-okta": {
    titleFi: "Kubernetesin RBAC-mallin tehostaminen Oktalla",
    summaryFi:
      "Kubernetes-käyttöoikeuksien hallinta parani identiteettiohjatulla RBAC-mallilla ja Okta-integraatiolla.",
  },
  "cycling-to-kiiminki-from-oulu": {
    titleFi: "Pyöräily Oulusta Kiiminkiin",
    summaryFi:
      "Tasainen pyörälenkki Oulusta Jäälin kautta Kiiminkiin ja Koitelinkoskelle.",
  },
  "cycling-to-hailuoto": {
    titleFi: "Pyöräretki Hailuotoon",
    summaryFi:
      "Spontaani pyöräilypäivä Oulusta Hailuotoon lauttamatkan ja rauhallisen paluun kanssa.",
  },
  "running-to-vartto": {
    titleFi: "Talvinen iltalenkki Värttöön",
    summaryFi:
      "Lyhyt talvinen iltajuoksu Oulusta Värttöön ja takaisin hiljaisia lumisia katuja pitkin.",
  },
  "oyster-hack4health-best-pitch-award": {
    titleFi: "OYSTER Hack4Health Best Pitch Award",
    summaryFi:
      "46 tunnin MedTech-hackathon Oulussa, jossa poikkitiimimme voitti Best Pitch Award -palkinnon puettavaan glukoosiennusteeseen perustuvalla konseptilla.",
  },
  "juhannus-oulu": {
    titleFi: "Juhannusyö Oulussa",
    summaryFi:
      "Rauhallinen juhannusilta veden äärellä, kun kokko valaisi pitkää pohjoista yötä.",
  },
  "lumo-light-festival-oulu": {
    titleFi: "Lumo-valofestivaali Oulussa",
    summaryFi:
      "Iltakävely Oulussa Lumo-valofestivaalin aikaan valoteoksia seuraten.",
  },
  "frozen-sea-walk-nallikari": {
    titleFi: "Kävely jäätyneellä merellä Nallikarissa",
    summaryFi:
      "Talvipäivä ystävien kanssa Nallikarissa ja rauhallinen kävely jäätyneelle merelle punaisen auringonlaskun alla.",
  },
  "northern-lights-oulu": {
    titleFi: "Revontuliyö Oulussa",
    summaryFi:
      "Hiljainen ilta Oulussa, jossa himmeä revontuli voimistui hitaasti ja teki tavallisesta hetkestä ikimuistoisen.",
  },
  "coffee-cake-weekend-bake": {
    titleFi: "Viikonlopun kahvikakku Oulussa",
    summaryFi:
      "Rauhallinen viikonloppuleivonta Oulussa, kahvikakku paahdetuilla cashewpähkinöillä ystävien ja naapureiden kanssa jaettuna.",
  },
  "weekend-cookie-bake": {
    titleFi: "Viikonlopun keksileivonta",
    summaryFi:
      "Viikonlopun leivontasessio kolmella taikinaversiolla, suklaahippu, kahvi ja maitosuklaa.",
  },
  "coastal-dusk-short-film-study": {
    titleFi: "Rannikon iltahämärän lyhytelokuvaharjoitus",
    summaryFi:
      "Tiivis iltakuvaus, jossa keskityttiin liikkeeseen, tuuleen ja hämärän tunnelmaan.",
  },
  "cycling-around-oulu": {
    titleFi: "Pyöräilyä Oulun ympäristössä",
    summaryFi:
      "Viikonloppulenkki rauhallisilla teillä, metsäpoluilla ja järvimaisemissa.",
  },
  "forest-route-journal-nuuksio-notes": {
    titleFi: "Metsäreittipäiväkirja Nuuksiosta",
    summaryFi:
      "Reittihavaintoja pitkältä polkupäivältä, maasto, sää, rytmi ja navigointipäätökset.",
  },
  "frames-from-a-winter-walk": {
    titleFi: "Hetkiä talvikävelyltä",
    summaryFi:
      "Valokuvakävely, jossa tallentui pehmeä valo, talvikadut ja rauhalliset hetket.",
  },
  "homemade-pasta-night": {
    titleFi: "Kotitekoinen pastailta",
    summaryFi:
      "Arki-illan pastakokeilu, jossa keskityttiin taikinan rytmiin, kärsivällisyyteen ja viimeistelyn puhtauteen.",
  },
  "morning-run-by-the-river": {
    titleFi: "Aamulenkki joen varrella",
    summaryFi:
      "Kevyt juoksu mielen nollaamiseen ennen keskittynyttä työviikkoa.",
  },
  "pool-intervals-on-a-cold-evening": {
    titleFi: "Uimahallin intervallit kylmänä iltana",
    summaryFi:
      "Tekniikkapainotteinen treeni hengityksen hallinnalla ja tasaisella rytmillä.",
  },
  "simple-rice-bowl-experiment": {
    titleFi: "Yksinkertainen riisikulhokokeilu",
    summaryFi:
      "Nopea arki-illan kulho tekstuurin, ajoituksen ja makukerrosten testaamiseen.",
  },
  "weekend-sri-lankan-curry": {
    titleFi: "Viikonlopun srilankalainen curry",
    summaryFi:
      "Sunnuntain eräkokkaus, jossa keskityttiin maustetasapainoon, tasaiseen rytmiin ja rauhalliseen valmisteluun.",
  },
};

export function getLocalizedPostTitle(
  slug: string,
  title: string,
  language: Language,
): string {
  if (language !== "fi") {
    return title;
  }

  return postTranslations[slug]?.titleFi ?? title;
}

export function getLocalizedPostSummary(
  slug: string,
  summary: string,
  language: Language,
): string {
  if (language !== "fi") {
    return summary;
  }

  return postTranslations[slug]?.summaryFi ?? summary;
}
