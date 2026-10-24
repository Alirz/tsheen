import { ArrowRight } from 'lucide-react'
import captchaPuzzle from '@/assets/figma/captcha-puzzle.png'
import { cn } from '@/lib/utils'

export function Captcha({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative h-[309px] w-[378px] overflow-hidden rounded-sds-400 bg-background-default-hover',
        className,
      )}
      data-name="CAPTCHA"
    >
      <img
        alt=""
        src={captchaPuzzle}
        width={328}
        height={196}
        className="absolute top-[25px] left-1/2 -translate-x-1/2 rounded-sds-200 object-cover"
      />
      <div className="absolute top-[237px] left-[25px] flex h-14 w-[328px] items-center gap-3 rounded-sds-200 bg-background-default px-[5px]">
        <span className="flex size-[46px] items-center justify-center rounded-sds-200 bg-[#cc8627] text-text-on-neutral">
          <ArrowRight className="size-6" aria-hidden />
        </span>
        <span className="type-button-14-m flex-1 text-end text-text-tertiary" dir="auto">
          برای کامل کردن پازل فلش را بکشید
        </span>
      </div>
    </div>
  )
}
