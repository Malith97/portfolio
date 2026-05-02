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
  "cloud-cost-optimization": {
    titleFi: "Pilvikustannusten optimointi",
    summaryFi: "Käytännöllinen FinOps-kokonaisuus laski kustannuksia 35 % ilman palvelutason heikentymistä."
  },
  "cloud-migration-from-on-prem-to-cloud": {
    titleFi: "Pilvimigraatio: on-premistä pilveen",
    summaryFi: "Vaiheittainen migraatio siirsi liiketoimintakriittiset palvelut joustavampaan ja luotettavampaan arkkitehtuuriin."
  },
  "kubernetes-rbac-and-multi-team-access": {
    titleFi: "Kubernetes RBAC ja monitiiminen käyttöoikeusmalli",
    summaryFi: "Käyttörajat suunniteltiin niin, että tiimit voivat toimia itsenäisesti ilman turvallisuuskompromisseja."
  },
  "kubernetes-rbac-okta": {
    titleFi: "Kubernetes RBACin tehostaminen Oktalla",
    summaryFi: "Kubernetes-käyttöoikeuksien hallinta parani identity-ohjatulla RBAC-mallilla ja Okta-integraatiolla."
  },
  "multiple-i2c-ports-raspberry-pi": {
    titleFi: "Useiden I2C-porttien käyttöönotto Raspberry Pi:llä",
    summaryFi: "Useiden I2C-väylien konfigurointi Raspberry Pi -ympäristössä anturimoduulien rinnakkaiseen testaukseen."
  },
  "cycling-to-kiiminki-from-oulu": {
    titleFi: "Pyöräily Oulusta Kiiminkiin",
    summaryFi: "Tasainen pohjoiseen suuntautuva pyörälenkki Oulusta Jäälin kautta Kiiminkiin ja Koitelinkoskelle."
  },
  "cycling-to-hailuoto": {
    titleFi: "Pyöräretki Hailuotoon",
    summaryFi: "Spontaani pyöräilypäivä Oulusta Hailuotoon, mukana lauttamatka ja rauhallinen paluureitti."
  },
  "running-to-vartto": {
    titleFi: "Talvinen iltalenkki Värttöön",
    summaryFi: "Lyhyt talvinen iltajuoksu Oulusta Värttöön ja takaisin hiljaisia lumisia katuja pitkin."
  },
  "oyster-hack4health-best-pitch-award": {
    titleFi: "OYSTER Hack4Health – Best Pitch Award",
    summaryFi: "46 tunnin MedTech-hackathon Oulussa, jossa poikkitiimimme voitti Best Pitch -palkinnon puettavaan glukoosiennusteeseen perustuvalla konseptilla."
  },
  "juhannus-oul": {
    titleFi: "Juhannusyö Oulussa",
    summaryFi: "Rauhallinen juhannusilta veden äärellä, kun kokko valaisi pitkää pohjoista yötä."
  },
  "lumo-light-festival-oulu": {
    titleFi: "Lumo-valofestivaali Oulussa",
    summaryFi: "Iltakävely Oulussa Lumo-valofestivaalin aikaan, valoteoksia seuraten läpi kaupungin."
  },
  "frozen-sea-walk-nallikari": {
    titleFi: "Kävely jäätyneellä merellä Nallikarissa",
    summaryFi: "Talvipäivä ystävien kanssa Nallikarissa ja hiljainen kävely jäätyneelle merelle punaisen auringonlaskun alla."
  },
  "northern-lights-oulu": {
    titleFi: "Revontuliyö Oulussa",
    summaryFi: "Hiljainen ilta Oulussa, jossa himmeä revontuli voimistui hitaasti ja teki tavallisesta hetkestä ikimuistoisen."
  },
  "coffee-cake-weekend-bake": {
    titleFi: "Viikonlopun kahvikakku Oulussa",
    summaryFi: "Hidas viikonloppuleivonta Oulussa: kahvikakku, paahdetut cashewpähkinät jaettuina ystävien ja naapureiden kanssa."
  },
  "weekend-cookie-bake": {
    titleFi: "Viikonlopun keksileivonta",
    summaryFi: "Viikonlopun leivontasessio kolmella taikinaversiolla: chocolate chip, coffee ja milk chocolate."
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
