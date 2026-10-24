import goldBar3 from '@/assets/figma/gold-bar-3.png'
import { cn } from '@/lib/utils'

export function GoldBar3({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-[79px] w-[49px]', className)} data-name="gold bar 3/Default">
      <img alt="" src={goldBar3} className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" />
    </div>
  )
}
