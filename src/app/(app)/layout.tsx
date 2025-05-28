
"use client";
import type { NavItem } from '@/types';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LogIn, Send } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader>
        <Link href="/">
          <Logo collapsed={!open} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {siteConfig.mainNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.title, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         <div className="flex items-center gap-2 p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40/E62E9A/FFFFFF?text=U" alt="User" data-ai-hint="user avatar"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {!open ? null : (
              <div className="flex flex-col text-sm">
                <span className="font-medium text-sidebar-foreground">User Name</span>
                <span className="text-xs text-sidebar-foreground/70">user@example.com</span>
              </div>
            )}
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate isHomePage only after client has mounted to ensure pathname is accurate
  const isHomePage = isClient ? pathname === '/' : false;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
        {/* SidebarTrigger is client-side interactive, ensure it renders consistently or only on client */}
        {isClient ? <SidebarTrigger /> : <div className="h-7 w-7" /> } 
      </div>
      <div className="flex-1 md:flex md:justify-center">
        {/* Logo for mobile, centered on desktop */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/">
            <Logo collapsed={true}/> {/* Always show collapsed (icon only) logo in header */}
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isClient && isHomePage ? ( 
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/chat">
              <Send className="h-5 w-5" />
              <span className="sr-only">Chat</span>
            </Link>
          </Button>
        ) : (
          // Consistent placeholder for SSR, especially if isHomePage might be false on server
          // or to ensure layout consistency if isHomePage calculation is deferred.
          // If isHomePage could be true on server, this still needs to be a consistent placeholder.
          <div className="h-10 w-10" /> // Placeholder to maintain layout
        )}
        <ThemeToggleButton />
        {isClient ? (
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </Link>
        ) : (
          // Basic placeholder for SSR and initial client render to avoid hydration mismatch on className
          // Using basic classes that affect layout similarly to buttonVariants default.
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground"
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Login</span>
          </a>
        )}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6"> {/* Added padding-bottom for bottom nav */}
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}
