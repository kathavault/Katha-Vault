
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Send, UserCircle2, LogIn } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);
  const [isClient, setIsClient] = useState(false);

  const adminEmails = ['kathavault@gmail.com', 'rajputkritika510@gmail.com'];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
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
  }, [pathname, open, isClient]);

  const getInitials = (name?: string, username?: string) => {
    if (name) {
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[1]) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, Math.min(name.length, 2)).toUpperCase();
    }
    if (username) return username.substring(0, Math.min(username.length, 2)).toUpperCase();
    return 'U';
  };

  if (!isClient) {
    return (
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="hidden md:block">
        <SidebarHeader>
          <Link href="/">
            <Logo collapsed={true} />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu>
              {siteConfig.mainNav.map((item) => {
                // Apply same admin link logic for SSR placeholder consistency
                const isAdminLink = item.href === '/admin';
                // During SSR, userProfile is effectively null, so an admin user cannot be determined this way.
                // We assume non-admin for the placeholder rendering to match client-side non-admin view.
                const isSsrAdminUser = false; 
                if (isAdminLink && !isSsrAdminUser) {
                  return null;
                }
                return <SidebarMenuItem key={item.href} className="h-8" />;
              })}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <div className="flex items-center gap-2 p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }


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
            {siteConfig.mainNav.map((item) => {
              const isAdminLink = item.href === '/admin';
              const isAdminUser = isClient && userProfile && userProfile.email && adminEmails.includes(userProfile.email);
              
              if (isAdminLink && !isAdminUser) {
                return null; 
              }
              
              return (
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
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         <div className="flex items-center gap-2 p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatarUrl || undefined} alt={userProfile?.username || "User"} data-ai-hint="user avatar"/>
              <AvatarFallback>{getInitials(userProfile?.name, userProfile?.username)}</AvatarFallback>
            </Avatar>
            {!open ? null : (
              <div className="flex flex-col text-sm truncate">
                <span className="font-medium text-sidebar-foreground truncate">{userProfile?.name || userProfile?.username || "Guest User"}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{userProfile?.email || "Not logged in"}</span>
              </div>
            )}
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}

interface AppHeaderProps {
  isAuthenticated: boolean;
  currentUserProfile: Partial<UserProfile> | null;
  isClient: boolean;
}

function AppHeader({ isAuthenticated, currentUserProfile, isClient }: AppHeaderProps) {
  const pathname = usePathname();
  const isHomePage = isClient ? pathname === '/' : false;

  const getInitials = (name?: string, username?: string) => {
    if (name) {
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[1]) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, Math.min(name.length, 2)).toUpperCase();
    }
    if (username) return username.substring(0, Math.min(username.length, 2)).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">{/* Ensure no whitespace here */}
        {isClient ? <SidebarTrigger /> : <div className="h-7 w-7" />}
      </div>
      <div className="flex-1 md:flex md:justify-center">
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link href="/">
            <Logo collapsed={true}/>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isClient && isHomePage && (
          <Link href="/chat" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Chat</span>
          </Link>
        )}
        {(!isClient || !isHomePage) && (
          <div className="h-10 w-10" /> // Placeholder to maintain layout consistency
        )}

        <ThemeToggleButton />
        {/* User icon / Sign In button removed from here */}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Partial<UserProfile> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      let authStatus = false;
      let profileData: Partial<UserProfile> | null = null;
      
      if (typeof window !== 'undefined') {
        const userStored = localStorage.getItem('currentUser');
        const profileStored = localStorage.getItem('userProfileData');

        if (userStored) {
          authStatus = true;
          if (profileStored) {
            try {
              profileData = JSON.parse(profileStored);
            } catch (e) {
              console.error("Failed to parse userProfileData from localStorage in AppLayout:", e);
              try { 
                const parsedCurrentUser = JSON.parse(userStored);
                profileData = { 
                  email: parsedCurrentUser.email, 
                  id: parsedCurrentUser.uid,
                  name: parsedCurrentUser.displayName || parsedCurrentUser.email?.split('@')[0] || 'User',
                  username: parsedCurrentUser.email?.split('@')[0] || 'User',
                  avatarUrl: parsedCurrentUser.photoURL || '' 
                };
              } catch (parseError) {
                console.error("Failed to parse currentUser (fallback) from localStorage in AppLayout:", parseError);
              }
            }
          } else { 
            try {
              const parsedCurrentUser = JSON.parse(userStored);
              profileData = { 
                id: parsedCurrentUser.uid, 
                email: parsedCurrentUser.email,
                username: parsedCurrentUser.email?.split('@')[0] || 'User',
                name: parsedCurrentUser.displayName || parsedCurrentUser.email?.split('@')[0] || 'User',
                avatarUrl: parsedCurrentUser.photoURL || '' 
              };
            } catch (parseError) {
              console.error("Failed to parse currentUser (for profile) from localStorage in AppLayout:", parseError);
            }
          }
        }
      }
      setIsAuthenticated(authStatus);
      setCurrentUserProfile(profileData);
    };

    if (isClient) { // Only run checkAuth if we are on the client
      checkAuth(); 
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser' || event.key === 'userProfileData') {
        if (isClient) checkAuth();
      }
    };
    
    if (isClient) {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', checkAuth); 
    }

    return () => {
      if (isClient) {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', checkAuth);
      }
    };
  }, [pathname, isClient]); // Re-run on pathname change and when isClient becomes true

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader isAuthenticated={isAuthenticated} currentUserProfile={currentUserProfile} isClient={isClient} />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}

