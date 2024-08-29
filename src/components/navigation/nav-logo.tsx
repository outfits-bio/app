'use client'

import { showSlash } from '@/utils/nav-options.util'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PiArrowLeftBold } from 'react-icons/pi'
import { Logo } from '../ui/Logo'

export function NavLogo() {
  const pathname = usePathname()

  const title =
    pathname.split('/')[pathname.split('/').length - 1] ?? 'outfits.bio'
  const slash = showSlash(pathname)

  if (slash) {
    return (
      <>
        {pathname.startsWith('/settings/') && (
          <div className="flex md:hidden">
            <Link aria-label="Settings Button" href={'/settings'}>
              <PiArrowLeftBold className="w-5 h-5" />
            </Link>
          </div>
        )}
        <Link
          aria-label="Home Button"
          href="/"
          className="flex items-center gap-2 hover:scale-[102%] active:scale-[99%]"
        >
          <Logo size={'lg'} />
          <h1 className="flex items-center gap-4 text-xl font-black md:text-2xl font-clash">
            /{title.toLowerCase()}
          </h1>
        </Link>
      </>
    )
  }

  return (
    <>
      {pathname.startsWith('/settings/') && (
        <div className="flex md:hidden">
          <Link aria-label="Settings Button" href={'/settings'}>
            <PiArrowLeftBold className="w-5 h-5" />
          </Link>
        </div>
      )}
      <Link
        aria-label="Home Button"
        href={'/'}
        className="flex items-center sm:gap-2 hover:scale-[102%] active:scale-[99%]"
      >
        <Logo size={'lg'} />
        <h1 className="hidden text-xl font-black md:text-2xl font-clash sm:block">
          outfits.bio
        </h1>
      </Link>
    </>
  )
}
