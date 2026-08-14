import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/helpers';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  to?: undefined;
  href?: undefined;
}
interface ButtonAsLink extends BaseProps {
  to: string;
  href?: undefined;
}
interface ButtonAsAnchor extends BaseProps {
  href: string;
  to?: undefined;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

function buildClass(variant: Variant, size: Size, fullWidth?: boolean, extra?: string) {
  return classNames(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    extra,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { variant = 'primary', size = 'md', fullWidth, leftIcon, rightIcon, className, children } =
    props;

  const inner = (
    <>
      {leftIcon && <span className={styles.icon} aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={styles.icon} aria-hidden="true">{rightIcon}</span>}
    </>
  );

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={buildClass(variant, size, fullWidth, className)}>
        {inner}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { external } = props as ButtonAsAnchor;
    return (
      <a
        href={props.href}
        className={buildClass(variant, size, fullWidth, className)}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  // Strip non-DOM props so they aren't forwarded as attributes.
  const {
    type,
    variant: _v,
    size: _s,
    fullWidth: _fw,
    leftIcon: _li,
    rightIcon: _ri,
    className: _cn,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={buildClass(variant, size, fullWidth, className)}
      {...rest}
    >
      {inner}
    </button>
  );
});
