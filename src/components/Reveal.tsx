import { type ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
};

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
