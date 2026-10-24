import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InputIconVariant = 'Default' | 'wrong'

export function InputIcon({
  className,
  variant = 'Default',
  text = 'تاریخ تولد',
}: {
  className?: string
  variant?: InputIconVariant
  text?: string
}) {
  return (
    <div
      className={cn(
        'flex h-14 w-full items-center justify-between rounded-sds-200 border bg-background-default-hover px-4',
        variant === 'wrong' ? 'border-border-danger' : 'border-border-default',
        className,
      )}
      data-name="input icon"
    >
      <Calendar className="size-6 text-icon-default" aria-hidden />
      <span className="type-body-14-r text-text-tertiary" dir="auto">
        {text}
      </span>
    </div>
  )
}
