import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { classNames } from '@/utils/helpers';

interface AnimatedRevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: 'up' | 'scale';
  delay?: number; // ms
  className?: string;
  style?: CSSProperties;
}

/* Declarative scroll-reveal wrapper. Falls back to visible content
   automatically under prefers-reduced-motion (handled in CSS). */
export function AnimatedReveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className,
  style,
}: AnimatedRevealProps) {
  const ref = useScrollAnimation<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={classNames(variant === 'scale' ? 'reveal-scale' : 'reveal', className)}
      style={{ ...(delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : {}), ...style }}
    >
      {children}
    </Tag>
  );
}
