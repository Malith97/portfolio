import Image from "next/image";

interface PhotoGridProps {
  images: string[];
  altBase: string;
  className?: string;
  maxItems?: number;
  aspectClass?: string;
  priorityFirst?: boolean;
}

export function PhotoGrid({
  images,
  altBase,
  className = "",
  maxItems,
  aspectClass = "aspect-[4/3]",
  priorityFirst = false
}: PhotoGridProps) {
  const items = maxItems ? images.slice(0, maxItems) : images;

  if (items.length === 0) {
    return null;
  }

  const gridColsClass = items.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3";

  return (
    <ul className={`grid ${gridColsClass} gap-3 ${className}`}>
      {items.map((image, index) => (
        <li key={`${image}-${index}`} className={`${aspectClass} overflow-hidden rounded-md border border-border`}>
          <Image
            src={image}
            alt={`${altBase} image ${index + 1}`}
            width={1200}
            height={900}
            className="hover-lift image-frame h-full w-full object-cover"
            priority={priorityFirst && index === 0}
          />
        </li>
      ))}
    </ul>
  );
}

