"use client";

import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";

export function AboutPageContent() {
  const { language } = useLanguage();
  const isFinnish = language === "fi";

  return (
    <div className="space-y-10 sm:space-y-12">
      <SectionHeading
        label={isFinnish ? "Tietoa minusta" : "ABOUT"}
        title={isFinnish ? "Malith Ileperuma" : "About Malith Ileperuma"}
        description={
          isFinnish
            ? "DevOps-insinööri, joka rakentaa luotettavaa pilvi-infrastruktuuria ja automatisoituja toimitusputkia."
            : "DevOps Engineer focused on cloud infrastructure, delivery automation, and reliability."
        }
      />

      <section className="max-w-reading space-y-4 text-[0.98rem] leading-7 text-muted sm:text-base sm:leading-relaxed">
        <p>
          {isFinnish
            ? "Suunnittelen ja ylläpidän tuotantotason järjestelmiä keskittyen CI/CD-putkiin, Kubernetes-ympäristöihin, Terraform-pohjaiseen infrastruktuuriin sekä käytännön automaatioon."
            : "I design and operate systems around CI/CD pipelines, Kubernetes platforms, Terraform infrastructure, and practical automation."}
        </p>
        <p>
          {isFinnish
            ? "Työni painopiste on luotettavuudessa, toimitusnopeudessa ja selkeässä teknisessä toteutuksessa, joka auttaa tiimejä julkaisemaan turvallisesti ja toistettavasti."
            : "My work is usually about making releases safer, infrastructure easier to reason about, and operational risk visible before it becomes an incident."}
        </p>
      </section>
    </div>
  );
}
