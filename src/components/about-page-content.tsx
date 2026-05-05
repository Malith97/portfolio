"use client";

import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";

export function AboutPageContent() {
  const { language } = useLanguage();
  const isFinnish = language === "fi";

  return (
    <div className="space-y-12">
      <SectionHeading
        label={isFinnish ? "Tietoa" : "ABOUT"}
        title={isFinnish ? "Malith Ileperuma" : "About Malith Ileperuma"}
        description={
          isFinnish
            ? "DevOps-insinööri, joka rakentaa luotettavaa pilvi-infrastruktuuria ja automatisoituja toimitusputkia."
            : "DevOps Engineer building reliable cloud infrastructure and automated delivery pipelines."
        }
      />

      <section className="max-w-reading space-y-4 text-base leading-relaxed text-muted">
        <p>
          {isFinnish
            ? "Suunnittelen ja ylläpidän tuotantotason järjestelmiä keskittyen CI/CD-putkiin, Kubernetes-ympäristöihin, Terraform-pohjaiseen infrastruktuuriin sekä käytännön automaatioon."
            : "I design and operate production-grade systems with a focus on CI/CD pipelines, Kubernetes platforms, Terraform infrastructure, and practical automation."}
        </p>
        <p>
          {isFinnish
            ? "Työni painopiste on luotettavuudessa, toimitusnopeudessa ja selkeässä teknisessä toteutuksessa, joka auttaa tiimejä julkaisemaan turvallisesti ja toistettavasti."
            : "My work prioritizes reliability, delivery speed, and clear technical implementation so teams can ship safely and consistently."}
        </p>
      </section>
    </div>
  );
}
