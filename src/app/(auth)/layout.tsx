
// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
// No React import needed if it becomes a server component without hooks

export default function AuthLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear(); // Get year directly

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
        <p>© {currentYear} Katha Vault. All rights reserved.</p>
      </footer>
    </div>
  );
}
