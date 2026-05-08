"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK_SRC = "/media/malith-portrait.jpg";

export function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  alt,
  ...props
}: SafeImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== fallbackSrc) {
          setResolvedSrc(fallbackSrc);
        }
      }}
    />
  );
}
