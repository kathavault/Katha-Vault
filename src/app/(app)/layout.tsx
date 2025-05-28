
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
import { buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Send, UserPlus } from 'lucide-react'; // Changed LogIn to UserPlus
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

  const isHomePage = isClient ? pathname === '/' : false;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
        {isClient ? <SidebarTrigger /> : <div className="h-7 w-7" /> }
      </div>
      <div className="flex-1 md:flex md:justify-center">
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/">
            <Logo collapsed={true}/>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isClient && isHomePage ? (
          <Link href="/chat" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Chat</span>
          </Link>
        ) : (
          // Consistent placeholder for SSR if chat button isn't rendered or on non-home pages
          <div className="h-10 w-10" />
        )}
        <ThemeToggleButton />
        {isClient ? (
          <Link
            href="/auth/signup" // Changed to /auth/signup
            className={cn(buttonVariants({ variant: "default", size: "default" }))}
          >
            <UserPlus className="mr-2 h-4 w-4" /> {/* Changed to UserPlus */}
            <span>Sign Up</span> {/* Changed text to Sign Up */}
          </Link>
        ) : (
          // Basic link for SSR, full page reload if JS disabled
          <a
            href="/auth/signup" // Changed to /auth/signup
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground"
          >
            <UserPlus className="mr-2 h-4 w-4" /> {/* Changed to UserPlus */}
            <span>Sign Up</span> {/* Changed text to Sign Up */}
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
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}
