import type { Language } from "@/lib/i18n";

interface PostTranslation {
  titleFi: string;
  summaryFi: string;
}

const postTranslations: Record<string, PostTranslation> = {
  "chaos-engineering-for-better-reliability": {
    titleFi: "Chaos Engineering parempaan luotettavuuteen",
    summaryFi: "Hallittu resilienssiohjelma paljasti virhepolkuja varhain ja paransi incident-valmiutta tiimeissä."
  },
  "cicd-modernization-faster-and-safer-deployments": {
    titleFi: "CI/CD-modernisointi: nopeammat ja turvallisemmat julkaisut",
    summaryFi: "Putkien uudistus, ympäristöjen yhdenmukaisuus ja vahvemmat laatuportit lisäsivät toimitusnopeutta ja vähensivät julkaisuriskiä."
  },
  "cloud-cost-optimization-reducing-spend-by-35": {
    titleFi: "Pilvikustannusten optimointi: kulut alas 35 %",
    summaryFi: "Käytännöllinen FinOps-kokonaisuus laski kustannuksia ilman palvelutason regressioita."
  },
  "cloud-migration-from-on-prem-to-cloud": {
    titleFi: "Pilvimigraatio: on-premistä pilveen",
    summaryFi: "Vaiheittainen migraatio siirsi liiketoimintakriittiset palvelut joustavampaan ja luotettavampaan arkkitehtuuriin."
  },
  "kubernetes-rbac-and-multi-team-access": {
    titleFi: "Kubernetes RBAC ja monitiiminen käyttöoikeusmalli",
    summaryFi: "Käyttörajat suunniteltiin niin, että tiimit voivat toimia itsenäisesti ilman turvallisuuskompromisseja."
  },
  "coastal-dusk-short-film-study": {
    titleFi: "Rannikon iltahämärä - lyhytelokuvaharjoitus",
    summaryFi: "Tiivis iltakuvaus, jossa keskityttiin liikkeeseen, tuuleen ja hämärän tunnelmaan."
  },
  "cycling-around-oulu": {
    titleFi: "Pyöräilyä Oulun ympäristössä",
    summaryFi: "Viikonloppulenkki rauhallisilla teillä, metsäpoluilla ja järvimaisemissa."
  },
  "forest-route-journal-nuuksio-notes": {
    titleFi: "Metsäreittipäiväkirja: Nuuksion muistiinpanot",
    summaryFi: "Reittihavaintoja pitkältä polkupäivältä: maasto, sää, rytmi ja navigointipäätökset."
  },
  "frames-from-a-winter-walk": {
    titleFi: "Hetkiä talvikävelyltä",
    summaryFi: "Valokuvakävely, jossa tallentui pehmeä valo, talvikadut ja rauhalliset hetket."
  },
  "homemade-pasta-night": {
    titleFi: "Kotitekoinen pasta -ilta",
    summaryFi: "Arki-illan pastakokeilu, jossa keskityttiin taikinan rytmiin, kärsivällisyyteen ja viimeistelyn puhtauteen."
  },
  "morning-run-by-the-river": {
    titleFi: "Aamulenkki joen varrella",
    summaryFi: "Kevyt juoksu mielen nollaamiseen ennen fokusoitua työviikkoa."
  },
  "pool-intervals-on-a-cold-evening": {
    titleFi: "Uimahallin intervallit kylmänä iltana",
    summaryFi: "Tekniikkapainotteinen treeni hengityksen hallinnalla ja tasaisella rytmillä."
  },
  "simple-rice-bowl-experiment": {
    titleFi: "Yksinkertainen riisikulhokokeilu",
    summaryFi: "Nopea arki-illan kulho tekstuurin, ajoituksen ja makukerrosten testaamiseen."
  },
  "weekend-sri-lankan-curry": {
    titleFi: "Viikonlopun sri lankalainen curry",
    summaryFi: "Sunnuntain eräkokkaus keskittyen maustetasapainoon, tasaiseen rytmiin ja rauhalliseen valmisteluun."
  }
};

export function getLocalizedPostTitle(slug: string, title: string, language: Language): string {
  if (language !== "fi") {
    return title;
  }

  return postTranslations[slug]?.titleFi ?? title;
}

export function getLocalizedPostSummary(slug: string, summary: string, language: Language): string {
  if (language !== "fi") {
    return summary;
  }

  return postTranslations[slug]?.summaryFi ?? summary;
}
