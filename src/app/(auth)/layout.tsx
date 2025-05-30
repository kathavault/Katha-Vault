
// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="mb-8">
        <Link href="/">
            <Logo />
        </Link>
      </header>
      <main className="w-full max-w-md">
        {children}
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Katha Vault. All rights reserved.
      </footer>
    </div>
  );
}
