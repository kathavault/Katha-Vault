
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { UserPlus, Send } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge'; // Added Badge for notification

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader>
        <Logo collapsed={!open} />
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
              <AvatarImage src="https://placehold.co/40x40/E62E9A/FFFFFF?text=U" alt="User" data-ai-hint="user avatar" />
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
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1 md:flex md:justify-center">
        {/* Logo for mobile, centered on desktop */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Logo collapsed={true}/> {/* Always show collapsed (icon only) logo in header */}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isHomePage && (
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/chat">
              <Send className="h-5 w-5" />
              <span className="sr-only">Chat</span>
              {/* Static Notification Badge Placeholder */}
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center rounded-full text-xs">
                {/* For a number: 1, or leave empty for a dot */}
              </Badge>
            </Link>
          </Button>
        )}
        <ThemeToggleButton />
        <Button asChild>
            <Link href="/signup"> {/* Placeholder link */}
                <UserPlus className="mr-2 h-4 w-4 md:hidden" /> {/* Icon for mobile */}
                <span className="hidden md:inline">Sign Up</span> {/* Text for desktop */}
            </Link>
        </Button>
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
