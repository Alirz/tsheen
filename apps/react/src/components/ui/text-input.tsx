import { Eye } from 'lucide-react'
import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type TextInputVariant = 'Default' | 'wrong' | 'pass' | 'wrong pass'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: TextInputVariant
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, variant = 'Default', type, ...props },
  ref,
) {
  const invalid = variant === 'wrong' || variant === 'wrong pass'
  const password = variant === 'pass' || variant === 'wrong pass'
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={cn(
        'flex h-14 w-full items-center gap-3 overflow-hidden rounded-sds-200 border bg-background-default-hover px-4',
        invalid ? 'border-border-danger' : 'border-border-default',
        className,
      )}
      data-name="text input"
    >
      <input
        ref={ref}
        type={password ? (visible ? 'text' : 'password') : type}
        className={cn(
          'type-body-14-r min-w-0 flex-1 bg-transparent text-text-neutral outline-none placeholder:text-text-tertiary',
          password ? 'text-start' : 'text-center',
        )}
        {...props}
      />
      {password ? (
        <button
          type="button"
          className="text-icon-default"
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
        >
          <Eye className="size-6" aria-hidden />
        </button>
      ) : null}
    </div>
  )
})
