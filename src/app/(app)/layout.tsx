
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  }, [pathname, open, isClient]);

  const getInitials = (name?: string, username?: string) => {
    if (name) return name.substring(0,1).toUpperCase();
    if (username) return username.substring(0,1).toUpperCase();
    return 'U';
  };

  if (!isClient) {
    // Render a placeholder or null during SSR/initial client render to avoid hydration issues with localStorage
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
              {siteConfig.mainNav.map((item) => (
                <SidebarMenuItem key={item.href} className="h-8" />
              ))}
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
              <AvatarImage src={userProfile?.avatarUrl || undefined} alt={userProfile?.username || "User"} data-ai-hint="user avatar"/>
              <AvatarFallback>{getInitials(userProfile?.name, userProfile?.username)}</AvatarFallback>
            </Avatar>
            {!open ? null : (
              <div className="flex flex-col text-sm truncate">
                <span className="font-medium text-sidebar-foreground truncate">{userProfile?.name || userProfile?.username || "Guest User"}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{userProfile?.email || "No email"}</span>
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
}

function AppHeader({ isAuthenticated, currentUserProfile }: AppHeaderProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const pathname = usePathname();
  const isHomePage = isClient ? pathname === '/' : false;

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
        {/* Chat Button */}
        {isClient && isHomePage ? (
          <Link href="/chat" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Chat</span>
          </Link>
        ) : (
          <div className="h-10 w-10" /> // Placeholder for Chat button to maintain layout
        )}

        {/* Theme Toggle Button */}
        <ThemeToggleButton />

        {/* User Icon / Sign In Button was here - NOW REMOVED */}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Partial<UserProfile> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const userStored = localStorage.getItem('currentUser');
      let profileData = null;
      if (userStored) {
        setIsAuthenticated(true);
        const profileStored = localStorage.getItem('userProfileData');
        if (profileStored) {
          try {
            profileData = JSON.parse(profileStored);
          } catch (e) {
            console.error("Failed to parse userProfileData from localStorage in AppLayout:", e);
            try {
              profileData = { email: JSON.parse(userStored).email };
            } catch (parseError) {
              console.error("Failed to parse currentUser (fallback) from localStorage in AppLayout:", parseError);
            }
          }
        } else { // If only currentUser exists
          try {
            profileData = { email: JSON.parse(userStored).email };
          } catch (parseError) {
            console.error("Failed to parse currentUser (for profile) from localStorage in AppLayout:", parseError);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
      setCurrentUserProfile(profileData);
    };

    checkAuth(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser' || event.key === 'userProfileData') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('focus', checkAuth);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, [pathname]); 

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader isAuthenticated={isAuthenticated} currentUserProfile={currentUserProfile} />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}
