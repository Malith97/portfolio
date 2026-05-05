"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SafeImage } from "@/components/safe-image";

interface PhotoGridProps {
  images: string[];
  altBase: string;
  className?: string;
  maxItems?: number;
  aspectClass?: string;
  priorityFirst?: boolean;
  enableLightbox?: boolean;
  labels?: {
    openImage: string;
    closeImageViewer: string;
    previousImage: string;
    nextImage: string;
    imageViewer: string;
  };
}

export function PhotoGrid({
  images,
  altBase,
  className = "",
  maxItems,
  aspectClass = "aspect-[4/3]",
  priorityFirst = false,
  enableLightbox = false,
  labels
}: PhotoGridProps) {
  const items = maxItems ? images.slice(0, maxItems) : images;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const gridColsClass = items.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  const hasMultiple = items.length > 1;
  const isLightboxOpen = enableLightbox && activeIndex !== null;
  const activeImage = useMemo(
    () => (activeIndex !== null && activeIndex >= 0 && activeIndex < items.length ? items[activeIndex] : null),
    [activeIndex, items]
  );
  const imageSizes =
    items.length === 1
      ? "(max-width: 768px) 100vw, 880px"
      : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 380px";
  const resolvedLabels = {
    openImage: labels?.openImage ?? "Open image",
    closeImageViewer: labels?.closeImageViewer ?? "Close image viewer",
    previousImage: labels?.previousImage ?? "Previous image",
    nextImage: labels?.nextImage ?? "Next image",
    imageViewer: labels?.imageViewer ?? "image viewer"
  };

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
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

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ul className={`grid ${gridColsClass} gap-3 ${className}`}>
        {items.map((image, index) => {
          const isPriority = priorityFirst && index === 0;
          const alt = `${altBase} ${index + 1}`;
          const loading = isPriority ? undefined : "lazy";
          const imageElement = (
            <SafeImage
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
                  className="block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setActiveIndex(index);
                  }}
                  aria-label={`${resolvedLabels.openImage}: ${alt}`}
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
          aria-label={`${altBase} ${resolvedLabels.imageViewer}`}
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-[90vw] transition-transform duration-200" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-3 top-3 z-30 inline-flex min-h-11 items-center rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-1.5 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
              aria-label={resolvedLabels.closeImageViewer}
            >
              {resolvedLabels.closeImageViewer}
            </button>

            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  className="absolute left-2 top-1/2 z-30 inline-flex min-h-11 items-center -translate-y-1/2 rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-2 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] sm:left-3"
                  aria-label={resolvedLabels.previousImage}
                >
                  {resolvedLabels.previousImage}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-30 inline-flex min-h-11 items-center -translate-y-1/2 rounded-md border border-border bg-[#0d0d0d]/95 px-3 py-2 font-mono text-xs uppercase tracking-label text-text shadow-md transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] sm:right-3"
                  aria-label={resolvedLabels.nextImage}
                >
                  {resolvedLabels.nextImage}
                </button>
              </>
            ) : null}

            <div className="relative h-[85vh] w-[90vw] overflow-hidden rounded-md border border-border bg-[#0b0b0b]">
              <SafeImage
                src={activeImage}
                alt={`${altBase} ${activeIndex + 1}`}
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
