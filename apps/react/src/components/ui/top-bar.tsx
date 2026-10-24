import { Bell, Search } from 'lucide-react'
import topBarDivider from '@/assets/figma/top-bar-divider.svg'
import topBarLogo from '@/assets/figma/top-bar-logo.svg'
import topBarWallet from '@/assets/figma/top-bar-wallet.svg'
import { cn } from '@/lib/utils'

export function TopBar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        'flex h-[134px] w-full items-center justify-between bg-[#fff8e6] px-8',
        className,
      )}
      data-name="top bar"
    >
      <div className="flex items-center gap-6">
        <img alt="Tsheen" src={topBarLogo} width={175.4} height={84.4} />
        <div className="flex items-center gap-2 text-active-subtitle">
          <Bell className="size-8" aria-hidden />
          <img alt="" src={topBarWallet} width={32} height={32} />
          <Search className="size-8" aria-hidden />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="type-page-title-24-sb flex size-[70px] items-center justify-center rounded-corner-full border border-[rgba(77,61,42,0.5)] text-text-neutral">
              20
            </div>
            <div className="type-body-14-r flex w-12 flex-col items-center text-text-neutral">
              <span dir="auto">اسفند</span>
              <span dir="auto">1403</span>
            </div>
          </div>
          <img alt="" src={topBarDivider} width={56} height={1} className="rotate-90" />
          <div className="flex items-center gap-6 rounded-sds-400 bg-[#6b624d] px-4 py-[15px] text-[14px] leading-10 font-semibold text-text-on-neutral">
            <span dir="auto">6,000,000 ریال</span>
            <span dir="auto">قیمت طلا امروز:</span>
          </div>
        </div>
        <p className="text-[10px] leading-10 text-text-neutral" dir="auto">
          <span className="text-text-positive">+ 2% </span>
          <span>نسبت به دیروز</span>
        </p>
      </div>
    </header>
  )
}
