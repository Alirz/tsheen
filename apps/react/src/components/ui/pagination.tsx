import { ChevronLeft, ChevronRight } from 'lucide-react'
import paginationEllipsis from '@/assets/figma/pagination-ellipsis.svg'
import { cn } from '@/lib/utils'

export function Pagination({ className }: { className?: string }) {
  return (
    <nav className={cn('flex items-center justify-center gap-[13px]', className)} data-name="pageination" aria-label="Pagination">
      <ChevronLeft className="size-4 text-on-surface" aria-hidden />
      <span className="text-[10px] leading-5 text-text-neutral-secondary">15</span>
      <img alt="" src={paginationEllipsis} width={13} height={3} />
      <span className="text-[10px] leading-5 text-text-neutral-secondary">3</span>
      <span className="text-[10px] leading-5 text-text-neutral-secondary">2</span>
      <span className="type-subtitle-16-r flex size-[25px] items-center justify-center rounded-sds-full bg-background-default text-text-default">
        1
      </span>
      <ChevronRight className="size-4 text-on-surface" aria-hidden />
    </nav>
  )
}
