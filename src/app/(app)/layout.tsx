
"use client";
import type { NavItem, UserProfile } from '@/types';
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
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Send, UserCircle2, LogIn, UserPlus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error("Failed to parse userProfileData for sidebar", e);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    }
  }, [pathname, open]); // Re-check if pathname or sidebar open state changes

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
              <AvatarImage src={userProfile?.avatarUrl || "https://placehold.co/40x40/E62E9A/FFFFFF?text=U"} alt={userProfile?.username || "User"} data-ai-hint="user avatar"/>
              <AvatarFallback>{userProfile?.name?.substring(0,1) || userProfile?.username?.substring(0,1) || 'U'}</AvatarFallback>
            </Avatar>
            {!open ? null : (
              <div className="flex flex-col text-sm truncate">
                <span className="font-medium text-sidebar-foreground truncate">{userProfile?.name || userProfile?.username || "User Name"}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{userProfile?.email || "user@example.com"}</span>
              </div>
            )}
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}

interface AppHeaderProps {
  isAuthenticated: boolean;
}

function AppHeader({ isAuthenticated }: AppHeaderProps) {
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
          <div className="h-10 w-10" /> 
        )}
        <ThemeToggleButton />
        {isClient ? (
          isAuthenticated ? (
            <Link
              href="/account"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="My Account"
            >
              <UserCircle2 className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="Sign In"
            >
              <UserCircle2 className="h-5 w-5" />
            </Link>
          )
        ) : (
          // SSR placeholder for the user icon/button
          <div className="h-10 w-10 inline-flex items-center justify-center" aria-label="User actions">
            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // currentUserProfile state is removed as AppHeader no longer needs detailed profile, just auth state
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for authentication status
    const userStored = localStorage.getItem('currentUser');
    if (userStored) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [pathname]); // Re-check on pathname change (e.g., after login/logout redirect)

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader isAuthenticated={isAuthenticated} />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}
