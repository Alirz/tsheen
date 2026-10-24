import goldBar5 from '@/assets/figma/gold-bar-5.png'
import { cn } from '@/lib/utils'

export function GoldBar5({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-[79px] w-[49px]', className)} data-name="gold bar5/Default">
      <img alt="" src={goldBar5} className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" />
    </div>
  )
}
