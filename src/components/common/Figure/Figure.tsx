import { useState } from 'react';
import { isPlaceholderImage, placeholderHue, classNames } from '@/utils/helpers';
import { siteConfig } from '@/config/siteConfig';
import styles from './Figure.module.css';

interface FigureProps {
  src?: string;
  alt: string;
  /** aspect ratio, e.g. "16/9", "4/5", "1/1" */
  ratio?: string;
  /** seed for deterministic placeholder styling (defaults to alt) */
  seed?: string;
  className?: string;
  rounded?: boolean;
  eager?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
}

/* ============================================================
   Figure — single, centralized image renderer.
   - Real src -> lazy <img> (with graceful fallback on error).
   - `placeholder:*` sentinel or load error -> branded gradient
     poster in the church's cyan/black identity.
   This keeps image handling in ONE place (no scattered URLs).
   ============================================================ */
export function Figure({
  src,
  alt,
  ratio = '16/9',
  seed,
  className,
  rounded = true,
  eager = false,
  overlay = false,
  children,
}: FigureProps) {
  const [failed, setFailed] = useState(false);
  const usePlaceholder = failed || isPlaceholderImage(src) || !src;
  const hue = placeholderHue(seed ?? alt);

  return (
    <figure
      className={classNames(styles.figure, rounded && styles.rounded, className)}
      style={{ aspectRatio: ratio }}
      role={usePlaceholder ? 'img' : undefined}
      aria-label={usePlaceholder ? alt : undefined}
    >
      {usePlaceholder ? (
        <div
          className={styles.placeholder}
          style={
            {
              '--ph-hue': hue,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <span className={styles.monogram}>{siteConfig.initials}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={styles.img}
          onError={() => setFailed(true)}
        />
      )}
      {overlay && <span className={styles.overlay} aria-hidden="true" />}
      {children}
    </figure>
  );
}
