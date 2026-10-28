import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export function buttonVariants(variant: ButtonProps['variant'] = 'default') {
  return cn(
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    variant === 'default'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  )
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return <button className={cn(buttonVariants(variant), className)} {...props} />
}
