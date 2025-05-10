'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@stackframe/stack';
import { Button } from '@heroui/button';
import GradientText from '@/components/ui/GradientText';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/Arogyalogo.png"
            alt="logo"
            width={40}
            height={35}
          />
          <GradientText className="text-2xl md:text-3xl font-semibold">ArogyaMitra</GradientText>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/Docs">Docs</Link>
          </Button>
          <UserButton />
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden">
          <Button asChild variant="ghost">
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/Docs" onClick={() => setMenuOpen(false)}>Docs</Link>
          </Button>
          <UserButton />
        </div>
      )}
    </header>
  );
}

export default AppHeader;
