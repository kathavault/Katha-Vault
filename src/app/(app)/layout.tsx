
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
import { Send, LogIn, UserCircle2, UserPlus } from 'lucide-react'; 
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
  }, [pathname]); // Re-check if pathname changes, e.g., after login/logout

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
  currentUserProfile: Partial<UserProfile> | null;
}

function AppHeader({ isAuthenticated, currentUserProfile }: AppHeaderProps) {
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
          isAuthenticated && currentUserProfile ? (
            <Link 
              href="/account"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "flex items-center gap-2 px-2 sm:px-3 py-1 h-auto rounded-full hover:bg-accent"
              )}
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border">
                <AvatarImage src={currentUserProfile.avatarUrl || undefined} alt={currentUserProfile.username || "User"} data-ai-hint="user initial"/>
                <AvatarFallback>{currentUserProfile.name?.substring(0,1) || currentUserProfile.username?.substring(0,1) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                {currentUserProfile.name || currentUserProfile.username}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "default", size: "default" }))}
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )
        ) : (
          // Basic placeholder for SSR and initial client render
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground"
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </a>
        )}
      </div>
    </header>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Partial<UserProfile> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for user data to determine auth state
    const userStored = localStorage.getItem('currentUser'); // This indicates basic login
    setIsAuthenticated(!!userStored);

    if (userStored) {
      const profileStored = localStorage.getItem('userProfileData');
      if (profileStored) {
        try {
          setCurrentUserProfile(JSON.parse(profileStored));
        } catch (e) {
          console.error("Failed to parse userProfileData for header", e);
          setCurrentUserProfile(null); // Fallback if parsing fails
        }
      } else {
         // If only 'currentUser' exists but no 'userProfileData', create a minimal profile
         try {
            const parsedUser = JSON.parse(userStored);
            setCurrentUserProfile({ 
                email: parsedUser.email, 
                username: parsedUser.email?.split('@')[0] || 'User',
                avatarUrl: `https://placehold.co/40x40/B4317B/FFFFFF?text=${(parsedUser.email?.substring(0,1) || 'U').toUpperCase()}`,
            });
         } catch(e) {
            setCurrentUserProfile(null);
         }
      }
    } else {
      setCurrentUserProfile(null);
    }
  }, [pathname]); // Re-run when pathname changes, ensuring updates after login/logout redirects

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
