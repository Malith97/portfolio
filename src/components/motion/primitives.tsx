"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  type Variants,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const heroContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

const heroTitleContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const heroTitleWordVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const inViewContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const inViewItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

export function HeroStagger({ children, className }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function HeroStaggerItem({
  children,
  className,
  delay = 0,
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delay}
      variants={heroItemVariants}
    >
      {children}
    </motion.div>
  );
}

export function HeroTitleReveal({ children, className }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  if (typeof children !== "string") {
    return (
      <motion.h1 className={className} variants={heroItemVariants}>
        {children}
      </motion.h1>
    );
  }

  const words = children.trim().split(/\s+/);

  return (
    <motion.h1 className={className} variants={heroTitleContainerVariants}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={heroTitleWordVariants}
          className="inline-block whitespace-pre"
        >
          {index < words.length - 1 ? `${word} ` : word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export function HeroCtaRow({ children, className }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay: 0.88 }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInOnView({
  children,
  className,
  delay = 0,
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delay}
      variants={inViewItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerInView({ children, className }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={inViewContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delay}
      variants={inViewItemVariants}
    >
      {children}
    </motion.div>
  );
}

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function HoverLift({
  children,
  className,
  glow = false,
}: HoverLiftProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        y: glow ? -6 : -4,
        scale: glow ? 1.01 : 1.005,
      }}
      transition={{
        y: { type: "spring", stiffness: 220, damping: 21, mass: 0.5 },
        scale: { type: "spring", stiffness: 240, damping: 24, mass: 0.48 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroAmbientBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242, 199, 91, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 199, 91, 0.08) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { backgroundPosition: ["0px 0px", "22px 24px", "0px 0px"] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "linear" }
        }
      />

      <motion.div
        className="absolute -top-20 right-[6%] h-56 w-56 rounded-full bg-accent/14 blur-3xl"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: [0.2, 0.32, 0.2],
                scale: [0.94, 1.08, 0.94],
                y: [0, 16, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 8.5, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.div
        className="absolute -bottom-20 left-[12%] h-44 w-44 rounded-full bg-accent/10 blur-3xl"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: [0.16, 0.28, 0.16],
                scale: [0.92, 1.03, 0.92],
                y: [0, -14, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 9.2, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

interface PortraitInteractiveProps {
  children: ReactNode;
  className?: string;
}

export function PortraitInteractive({
  children,
  className,
}: PortraitInteractiveProps) {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 180, damping: 24, mass: 0.65 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 24, mass: 0.65 });

  const updateTilt = (event: MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    rotateY.set(x * 8);
    rotateX.set(y * -8);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        className="pointer-events-none absolute -inset-5 rounded-[1.6rem] bg-accent/14 blur-3xl"
        animate={{ opacity: [0.16, 0.28, 0.16], scale: [0.94, 1.04, 0.94] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-2 rounded-[1.15rem] border border-accent/55"
        animate={{ opacity: [0.3, 0.58, 0.3], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        onMouseMove={updateTilt}
        onMouseLeave={resetTilt}
        onMouseUp={resetTilt}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.05,
          rotate: 1.4,
          boxShadow:
            "0 0 0 1px rgba(242, 199, 91, 0.45), 0 0 38px rgba(242, 199, 91, 0.32), 0 22px 40px rgba(0, 0, 0, 0.45)",
        }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 18 },
          rotate: { type: "spring", stiffness: 180, damping: 18 },
          boxShadow: { duration: 0.25, ease: "easeOut" },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
