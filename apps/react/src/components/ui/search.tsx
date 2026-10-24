import { Calendar, Search as SearchIcon } from 'lucide-react'
import { GoldBar1 } from '@/components/ui/gold-bar-1'
import { cn } from '@/lib/utils'

export function Search({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-10 items-center gap-2', className)} data-name="search">
      <div className="flex h-10 w-[296px] items-center gap-2 rounded-sds-200 bg-background-default px-3">
        <SearchIcon className="size-4 text-icon-secondary" aria-hidden />
        <span className="type-caption-12-r text-text-secondary" dir="auto">
          جستجو در جدول
        </span>
      </div>
      <div className="flex h-10 w-[122px] items-center gap-2 rounded-sds-200 bg-background-default px-3">
        <Calendar className="size-4 text-icon-default" aria-hidden />
        <span className="type-caption-12-r text-text-secondary" dir="auto">
          انتخاب بازه تاریخ
        </span>
      </div>
      <div className="flex h-10 w-[122px] items-center gap-2 rounded-sds-200 bg-background-default px-3">
        <GoldBar1 className="h-[26px] w-[16px]" />
        <span className="type-caption-12-r text-text-secondary" dir="auto">
          انتخاب وزن
        </span>
      </div>
    </div>
  )
}
