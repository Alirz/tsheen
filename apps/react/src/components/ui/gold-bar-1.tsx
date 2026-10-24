import goldBar1 from '@/assets/figma/gold-bar-1.png'
import { cn } from '@/lib/utils'

export function GoldBar1({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-[79px] w-[49px]', className)} data-name="gold bar1/Default">
      <img alt="" src={goldBar1} className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" />
    </div>
  )
}
