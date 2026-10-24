import type { ReactNode } from 'react'
import { CreditCard, Headphones, House, LogOut, User } from 'lucide-react'
import menuAvatar from '@/assets/figma/menu-avatar.png'
import menuBuySell from '@/assets/figma/menu-buy-sell.svg'
import menuBuySellActive from '@/assets/figma/menu-buy-sell-active.svg'
import menuSecurity from '@/assets/figma/menu-security.png'
import menuTransfer from '@/assets/figma/menu-transfer.svg'
import menuTransferActive from '@/assets/figma/menu-transfer-active.svg'
import menuVerified from '@/assets/figma/menu-verified.png'
import menuWallet from '@/assets/figma/menu-wallet.svg'
import menuWalletActive from '@/assets/figma/menu-wallet-active.svg'
import { cn } from '@/lib/utils'

export type MenuDashboardVariant =
  | 'Default'
  | 'menu-profie'
  | 'menu-wallet'
  | 'menu-credit'
  | 'menu-support'
  | 'menu-security'
  | 'menu-transfer'
  | 'menu-buy.sell'

type ItemId = 'dashboard' | 'profile' | 'security' | 'wallet' | 'buy-sell' | 'transfer' | 'credit' | 'support'

const activeItem: Record<MenuDashboardVariant, ItemId> = {
  Default: 'dashboard',
  'menu-profie': 'profile',
  'menu-wallet': 'wallet',
  'menu-credit': 'credit',
  'menu-support': 'support',
  'menu-security': 'security',
  'menu-transfer': 'transfer',
  'menu-buy.sell': 'buy-sell',
}

const submenus: Partial<Record<ItemId, readonly string[]>> = {
  wallet: ['افزایش موجودی', 'برداشت از کیف پول', 'موجودی من', 'کارت های شتابی ثبت شده'],
  'buy-sell': ['خرید شمش از تیشین', 'رزرو شمش در تیشین', 'فروش شمش به تیشین', 'بازار تیشین'],
  transfer: ['انتقال مالکیت شمش', 'دریافت مالکیت شمش'],
}

function AssetIcon({ src, width, height }: { src: string; width: number; height: number }) {
  return <img alt="" src={src} width={width} height={height} />
}

function itemIcon(id: ItemId, active: boolean): ReactNode {
  if (id === 'dashboard') return <House className="size-6" aria-hidden />
  if (id === 'profile') return <User className="size-6" aria-hidden />
  if (id === 'security') {
    return active ? (
      <AssetIcon src={menuSecurity} width={19} height={23} />
    ) : (
      <AssetIcon src={menuVerified} width={24} height={24} />
    )
  }
  if (id === 'wallet') {
    return <AssetIcon src={active ? menuWalletActive : menuWallet} width={24} height={24} />
  }
  if (id === 'buy-sell') {
    return (
      <AssetIcon
        src={active ? menuBuySellActive : menuBuySell}
        width={25.7173}
        height={25.7488}
      />
    )
  }
  if (id === 'transfer') {
    return <AssetIcon src={active ? menuTransferActive : menuTransfer} width={28} height={28} />
  }
  if (id === 'credit') return <CreditCard className="size-6" aria-hidden />
  return <Headphones className="size-6" aria-hidden />
}

const items: readonly { id: ItemId; label: string }[] = [
  { id: 'dashboard', label: 'داشبورد' },
  { id: 'profile', label: 'حساب کاربری' },
  { id: 'security', label: 'امنیت' },
  { id: 'wallet', label: 'کیف پول' },
  { id: 'buy-sell', label: 'خرید و فروش' },
  { id: 'transfer', label: 'نقل و انتقالات' },
  { id: 'credit', label: 'دریافت اعتبار' },
  { id: 'support', label: 'پشتیبانی' },
]

export function MenuDashboard({
  className,
  variant = 'Default',
}: {
  className?: string
  variant?: MenuDashboardVariant
}) {
  const active = activeItem[variant]

  return (
    <aside
      className={cn('flex w-[199px] flex-col bg-[#fff8e6] px-[18px] py-8 text-text-neutral', className)}
      data-name="menu-dashboard"
    >
      <div className="mb-8 flex items-center justify-end gap-2">
        <p className="type-body-14-r" dir="auto">
          نام و نام خانوادگی
        </p>
        <img
          alt=""
          src={menuAvatar}
          width={60}
          height={60}
          className="size-[60px] rounded-corner-lg object-cover"
        />
      </div>
      <nav className="flex flex-1 flex-col items-end gap-10">
        {items.map((item) => {
          const selected = item.id === active
          const submenu = selected ? submenus[item.id] : undefined
          return (
            <div key={item.id} className="flex w-full flex-col items-end gap-8">
              <div
                className={cn(
                  'flex w-full items-center justify-end gap-4',
                  selected
                    ? 'type-subtitle-16-m h-[49px] rounded-sds-200 bg-[#cc8627] px-4 text-text-on-neutral'
                    : 'type-body-14-r text-text-neutral',
                )}
              >
                <span dir="auto">{item.label}</span>
                {itemIcon(item.id, selected)}
              </div>
              {submenu ? (
                <ul className="type-caption-12-r flex flex-col items-end gap-8 text-text-neutral-secondary">
                  {submenu.map((entry) => (
                    <li key={entry} dir="auto">
                      {entry}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </nav>
      <div className="type-body-14-r mt-10 flex items-center justify-end gap-4">
        <span dir="auto">خروج از حساب کاربری</span>
        <LogOut className="size-6" aria-hidden />
      </div>
    </aside>
  )
}
