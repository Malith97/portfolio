import { redirect } from "next/navigation";

import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Experience",
  description:
    "Experience overview for Malith Ileperuma covering DevOps, cloud platform engineering, and delivery systems.",
  path: "/experience",
});

export default function ExperiencePage() {
  redirect("/work-education");
}
