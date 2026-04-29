"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface PhotoGridProps {
  images: string[];
  altBase: string;
  className?: string;
  maxItems?: number;
  aspectClass?: string;
  priorityFirst?: boolean;
  enableLightbox?: boolean;
}

export function PhotoGrid({
  images,
  altBase,
  className = "",
  maxItems,
  aspectClass = "aspect-[4/3]",
  priorityFirst = false,
  enableLightbox = false
}: PhotoGridProps) {
  const items = maxItems ? images.slice(0, maxItems) : images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  const gridColsClass = items.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3";
  const hasMultiple = items.length > 1;
  const isLightboxOpen = enableLightbox && activeIndex !== null;
  const activeImage = useMemo(
    () => (activeIndex !== null && activeIndex >= 0 && activeIndex < items.length ? items[activeIndex] : null),
    [activeIndex, items]
  );
  const imageSizes =
    items.length === 1
      ? "(max-width: 768px) 100vw, 880px"
      : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 380px";

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length < 2) return current;
      return (current + 1) % items.length;
    });
  }, [items.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length < 2) return current;
      return (current - 1 + items.length) % items.length;
    });
  }, [items.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        goNext();
        return;
      }

      if (event.key === "ArrowLeft" && hasMultiple) {
        goPrevious();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, goNext, goPrevious, hasMultiple, isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen || activeIndex === null || !hasMultiple) {
      return;
    }

    const preload = (index: number) => {
      const src = items[(index + items.length) % items.length];
      const img = new window.Image();
      img.src = src;
    };

    preload(activeIndex + 1);
    preload(activeIndex - 1);
  }, [activeIndex, hasMultiple, isLightboxOpen, items]);

  useEffect(() => {
    if (activeIndex === null) return;
    if (activeIndex < items.length) return;
    setActiveIndex(items.length - 1);
  }, [activeIndex, items.length]);

  return (
    <>
      <ul className={`grid ${gridColsClass} gap-3 ${className}`}>
        {items.map((image, index) => {
          const isPriority = priorityFirst && index === 0;
          const alt = `${altBase} image ${index + 1}`;
          const loading = isPriority ? undefined : "lazy";
          const imageElement = (
            <Image
              src={image}
              alt={alt}
              width={1200}
              height={900}
              sizes={imageSizes}
              loading={loading}
              className="hover-lift image-frame h-full w-full object-cover"
              priority={isPriority}
            />
          );

          return (
            <li key={`${image}-${index}`} className={`${aspectClass} overflow-hidden rounded-md border border-border`}>
              {enableLightbox ? (
                <button
                  type="button"
                  className="block h-full w-full cursor-zoom-in"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Open ${alt}`}
                >
                  {imageElement}
                </button>
              ) : (
                imageElement
              )}
            </li>
          );
        })}
      </ul>

      {isLightboxOpen && activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-[2px] transition-opacity duration-200 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${altBase} image viewer`}
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-[90vw] transition-transform duration-200" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 z-30 rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-1.5 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent"
              aria-label="Close image viewer"
            >
              Close
            </button>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-2 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent sm:left-3"
                  aria-label="Previous image"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-2 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent sm:right-3"
                  aria-label="Next image"
                >
                  Next
                </button>
              </>
            ) : null}

            <div className="relative h-[85vh] w-[90vw] overflow-hidden rounded-md border border-border bg-[#0b0b0b]">
              <Image
                src={activeImage}
                alt={`${altBase} image ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain transition-opacity duration-200"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
