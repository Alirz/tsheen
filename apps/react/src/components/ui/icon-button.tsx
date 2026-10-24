import { Plus } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function IconButton({
  className,
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-10 items-center justify-center overflow-hidden rounded-sds-200 bg-background-neutral-secondary text-on-surface',
        className,
      )}
      data-name="icon button"
      {...props}
    >
      {children ?? <Plus className="size-6" aria-hidden />}
    </button>
  )
}
