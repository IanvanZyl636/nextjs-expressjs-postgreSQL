import React from 'react';
import { cn } from '@/app/utils/cn';


export const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({children, className}, ref) => (
  <h1
    ref={ref}
    className={cn('text-3xl md:text-4xl lg:text-5xl font-bold font-formula-one-regular leading-tight tracking-tight text-content-foreground', className)}>
    {children}
  </h1>
));

H1.displayName = 'H1';