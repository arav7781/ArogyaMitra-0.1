import React from 'react';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import IndiaGradient from '@/components/ui/IndiaGradient';
import { Button } from '@heroui/button';
import Link from 'next/link';
import GradientText from '@/components/ui/GradientText';

function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3  bg-gradient-to-r from-purple-300 via-fuchsia-200 to-blue-300 animate-fade-in">
      {/* Left Section: Logo and App Title */}
      <div className="flex items-center gap-3">
        <Image src="/f2881fdf-d2ac-41a3-8c0a-7e9c30219a74.png" alt="logo" width={40} height={35} />
        <GradientText className="text-3xl font-semibold">ArogyaMitra</GradientText>
      </div>

      {/* Right Section: Navigation and User */}
      <div className="flex items-center gap-4">
        <nav>
        <Button asChild variant="ghost">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/Docs">Docs</Link>
          </Button>
          
          
        </nav>
        <UserButton />
      </div>
    </header>
  );
}

export default Header;
