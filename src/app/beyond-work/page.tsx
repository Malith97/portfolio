import { BeyondWorkPageContent } from "@/components/beyond-work-page-content";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Beyond Work | Activities and Personal Projects",
  description:
    "A personal journal of running, cycling, photography, cooking, and side projects outside day-to-day engineering work.",
  path: "/beyond-work",
  keywords: [
    "Engineer personal blog",
    "DevOps life in Finland",
    "Running and cycling journal",
    "Personal projects",
  ],
});

export default async function BeyondWorkPage() {
  const [postsEng, postsFi] = await Promise.all([
    getAllBeyondWorkPosts("eng"),
    getAllBeyondWorkPosts("fi"),
  ]);

  return (
    <BeyondWorkPageContent postsByLanguage={{ eng: postsEng, fi: postsFi }} />
  );
}
