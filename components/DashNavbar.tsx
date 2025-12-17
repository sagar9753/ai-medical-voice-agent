"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

const menu = [
  { id: 1, name: 'Home', path: '/dashboard' },
  { id: 2, name: 'Pricing', path: '/dashboard/pricing' },
  { id: 3, name: 'History', path: '/dashboard/history' },
  { id: 4, name: 'Profile', path: '/profile' },
]

const DashNavbar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-20 lg:px-40">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={38} />
          <span className="font-bold text-xl hidden sm:block">
            MediTalk AI
          </span>
        </Link>

        {/* Desktop Menu */}
        {isSignedIn && (
          <nav className="hidden md:flex items-center gap-10">
            {menu.map((op) => (
              <Link key={op.id} href={op.path}>
                <span
                  className={`text-base cursor-pointer transition-all
                    ${pathname === op.path
                      ? 'font-semibold text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:font-medium'
                    }`}
                >
                  {op.name}
                </span>
              </Link>
            ))}
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <UserButton />
              <button
                className="md:hidden"
                onClick={() => setOpen(!open)}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <Button size="lg">Login</Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-5 space-y-4">
          {menu.map((op) => (
            <Link
              key={op.id}
              href={op.path}
              onClick={() => setOpen(false)}
            >
              <div
                className={`rounded-lg px-4 py-3 text-base transition
                  ${pathname === op.path
                    ? 'bg-muted font-semibold'
                    : 'hover:bg-muted'
                  }`}
              >
                {op.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default DashNavbar
