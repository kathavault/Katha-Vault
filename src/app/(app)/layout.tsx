
"use client";
import type { NavItem, UserProfile } from '@/types'; // Added UserProfile
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
import { Send, UserCircle2 } from 'lucide-react'; 
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
  // isAuthenticated and currentUserProfile are no longer needed here if the sign-in button/avatar is removed from the header
}

function AppHeader({}: AppHeaderProps) {
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
        {/* Sign In / User Avatar button removed from here */}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Partial<UserProfile> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const userStored = localStorage.getItem('currentUser'); 
    const profileStored = localStorage.getItem('userProfileData');
    
    if (userStored) {
      setIsAuthenticated(true);
      if (profileStored) {
        try {
          setCurrentUserProfile(JSON.parse(profileStored));
        } catch (e) {
          console.error("Failed to parse userProfileData for layout", e);
          // Fallback to minimal profile from currentUser if profile data is corrupt
          try {
             const parsedUser = JSON.parse(userStored);
             setCurrentUserProfile({ 
                 email: parsedUser.email, 
                 username: parsedUser.email?.split('@')[0] || 'User',
                 name: parsedUser.email?.split('@')[0] || 'User',
                 avatarUrl: `https://placehold.co/40x40/B4317B/FFFFFF?text=${(parsedUser.email?.substring(0,1) || 'U').toUpperCase()}`,
             });
          } catch (parseError) {
             setCurrentUserProfile(null);
          }
        }
      } else {
         // If only 'currentUser' exists but no 'userProfileData', create a minimal profile
         try {
            const parsedUser = JSON.parse(userStored);
            setCurrentUserProfile({ 
                email: parsedUser.email, 
                username: parsedUser.email?.split('@')[0] || 'User',
                name: parsedUser.email?.split('@')[0] || 'User',
                avatarUrl: `https://placehold.co/40x40/B4317B/FFFFFF?text=${(parsedUser.email?.substring(0,1) || 'U').toUpperCase()}`,
            });
         } catch(e) {
            setCurrentUserProfile(null);
         }
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserProfile(null);
    }
  }, [pathname]);

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
