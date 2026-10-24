import { cn } from '@/lib/utils'

const cells = [0, 1, 2, 3, 4, 5] as const

export type OtpVariant = 'Default' | 'fill otp' | 'wrong otp'

export function Otp({
  className,
  variant = 'Default',
  value,
}: {
  className?: string
  variant?: OtpVariant
  value?: string
}) {
  const filled = variant !== 'Default'
  const digits = (value ?? (filled ? '555555' : '')).slice(0, 6)
  const wrong = variant === 'wrong otp'

  return (
    <div className={cn('flex items-center gap-[26px]', className)} data-name="OTP">
      {cells.map((index) => (
        <div
          key={index}
          className={cn(
            'flex h-14 w-[57px] items-center justify-center rounded-sds-200 border bg-background-default-hover type-button-14-m text-text-neutral',
            wrong ? 'border-border-danger' : 'border-border-default',
          )}
        >
          {digits[index] ?? ''}
        </div>
      ))}
    </div>
  )
}
