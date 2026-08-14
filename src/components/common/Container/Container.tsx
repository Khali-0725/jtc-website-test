import type { ElementType, ReactNode } from 'react';
import { classNames } from '@/utils/helpers';

interface ContainerProps {
  children: ReactNode;
  size?: 'default' | 'wide' | 'narrow';
  as?: ElementType;
  className?: string;
}

export function Container({ children, size = 'default', as: Tag = 'div', className }: ContainerProps) {
  return (
    <Tag
      className={classNames(
        'container',
        size === 'wide' && 'container--wide',
        size === 'narrow' && 'container--narrow',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
