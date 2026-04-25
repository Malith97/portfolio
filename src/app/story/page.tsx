import Image from "next/image";

import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";
import { createMetadata } from "@/lib/metadata";

const storyImages = [
  "/media/photo-2.webp",
  "/media/photo-3.webp",
  "/media/photo-4.webp",
  "/media/photo-5.webp",
  "/media/photo-6.webp"
];

export const metadata = createMetadata({
  title: "Story",
  description:
    "Career journey of Malith Ileperuma, from Sri Lanka to Finland and from software engineering to DevOps.",
  path: "/story"
});

export default function StoryPage() {
  const language = getServerLanguage();
  const t = getDictionary(language);

  return (
    <div className="space-y-14">
      <SectionHeading
        label={t.storyPage.label}
        title={t.storyPage.title}
        description={t.storyPage.description}
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <figure>
          <div className="aspect-[4/5] overflow-hidden rounded-md border border-border">
            <Image
              src={storyImages[0]}
              alt="Portrait and notebook composition"
              width={1200}
              height={1500}
              className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
            />
          </div>
        </figure>

        <div className="space-y-6 text-base leading-relaxed text-text">
          <p>
            I started my career in Sri Lanka as a Software Engineer, learning how products are built under
            real constraints and how delivery pressure can quietly create fragile systems. That early
            experience made me care as much about operations as features.
          </p>
          <p>
            Over time, I moved deeper into DevOps engineering, focusing on automation, reliability, cloud
            infrastructure, and continuous improvement. I enjoy making complex workflows understandable,
            measurable, and easier for teams to maintain.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6 text-base leading-relaxed text-text">
          <p>
            Relocating to Finland added a new chapter: adapting to a different culture, investing in Finnish
            language studies, and continuing to build technical depth while staying grounded in practical
            collaboration.
          </p>
          <p>
            Outside of work, running, cycling, swimming, photography, and videography keep me balanced.
            Endurance habits and creative practice both influence how I solve engineering problems: steady
            effort, clear observation, and respect for craft.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <figure className="sm:col-span-2">
            <div className="aspect-[16/10] overflow-hidden rounded-md border border-border">
              <Image
                src={storyImages[1]}
                alt="City and travel notes image"
                width={1400}
                height={880}
                className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
              />
            </div>
          </figure>

          {storyImages.slice(2).map((image, index) => (
            <figure key={image}>
              <div className="aspect-[4/3] overflow-hidden rounded-md border border-border">
                <Image
                  src={image}
                  alt={`Story supporting image ${index + 1}`}
                  width={900}
                  height={680}
                  className="hover-lift image-frame h-full w-full object-cover grayscale transition duration-500 ease-out hover:grayscale-0"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
