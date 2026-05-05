import { BeyondWorkPageContent } from "@/components/beyond-work-page-content";
import { getAllBeyondWorkPosts } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Beyond Work",
  description:
    "Journal-style activity stories on running, cycling, photography, cooking, achievements, and notes.",
  path: "/beyond-work",
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
