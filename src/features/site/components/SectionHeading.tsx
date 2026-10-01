import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description, light = false, children }: SectionHeadingProps) {
  return (
    <div className={`site-section-heading${light ? ' is-light' : ''}`}>
      <span className="site-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
