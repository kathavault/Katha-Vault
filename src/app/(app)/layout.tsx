
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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Send, UserCircle2, LogIn, UserPlus, Home, Library, Search, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, type User as FirebaseUser } from "firebase/auth";
import { toast } from '@/hooks/use-toast';

const defaultUserProfilePlaceholder: Partial<UserProfile> = {
  name: 'Katha User',
  username: 'katha_user',
  bio: "Welcome to Katha Vault!",
  avatarUrl: 'https://placehold.co/150x150/7E3AF2/FFFFFF?text=KU',
};

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);


function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);
  const [isClient, setIsClient] = useState(false); // Sidebar's own isClient

  const adminEmails = ['kathavault@gmail.com', 'rajputkritika510@gmail.com'];

  useEffect(() => {
    setIsClient(true);
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

      // Listen for storage changes to update sidebar avatar
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'userProfileData') {
          const newProfile = localStorage.getItem('userProfileData');
          if (newProfile) {
            try {
              setUserProfile(JSON.parse(newProfile));
            } catch (e) {
              setUserProfile(null);
            }
          } else {
            setUserProfile(null);
          }
        } else if (event.key === 'currentUser' && !localStorage.getItem('userProfileData')) {
          // If currentUser is set but no userProfileData (e.g. after social login before profile completion if that flow existed)
          // or if userProfileData is cleared (logout)
          setUserProfile(null);
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

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
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader>
        <Link href="/">
          <Logo collapsed={!open} className="py-2" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          {isClient ? (
            <SidebarMenu>
              {siteConfig.mainNav.map((item) => {
                const isAdminLink = item.href === '/admin';
                const isAdminUser = userProfile && typeof userProfile.email === 'string' && adminEmails.includes(userProfile.email);
                
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
          ) : (
            <div className="p-2 space-y-1">
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         <div className="flex items-center gap-2 p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
              {isClient && userProfile?.avatarUrl ? (
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username || "User"} data-ai-hint="user avatar"/>
              ) : null}
              <AvatarFallback>{isClient ? getInitials(userProfile?.name, userProfile?.username) : 'U'}</AvatarFallback>
            </Avatar>
            {!open ? null : (
              <div className="flex flex-col text-sm truncate">
                <span className="font-medium text-sidebar-foreground truncate">{isClient ? (userProfile?.name || userProfile?.username || "Guest User") : "Loading..."}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{isClient ? (userProfile?.email || "Not logged in") : ""}</span>
              </div>
            )}
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}

interface AppHeaderProps {
  isAuthenticated: boolean;
  isClient: boolean;
}

function AppHeader({ isAuthenticated, isClient }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = isClient ? pathname === '/' : false;
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSocialSubmitting(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if profile data already exists to avoid overwriting more complete data
        let existingProfileData = null;
        const storedProfile = localStorage.getItem('userProfileData');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile) as UserProfile;
                if (parsed.id === user.uid) {
                    existingProfileData = parsed;
                }
            } catch (e) {
                console.error("Error parsing existing profile data on header login", e);
            }
        }
        
        const userProfileToStore: UserProfile = existingProfileData || {
            id: user.uid,
            email: user.email || 'unknown@example.com',
            name: user.displayName || user.email?.split('@')[0] || defaultUserProfilePlaceholder.name,
            username: existingProfileData?.username || user.email?.split('@')[0] || defaultUserProfilePlaceholder.username, // Prioritize existing username
            avatarUrl: user.photoURL || defaultUserProfilePlaceholder.avatarUrl,
            bio: existingProfileData?.bio || defaultUserProfilePlaceholder.bio, // Prioritize existing bio
            readingHistory: existingProfileData?.readingHistory || [],
            favorites: existingProfileData?.favorites || [],
            submittedStories: existingProfileData?.submittedStories || [],
            followers: existingProfileData?.followers || 0,
            following: existingProfileData?.following || 0,
            gender: existingProfileData?.gender || 'Prefer not to say',
        };

        localStorage.setItem('currentUser', JSON.stringify({ email: user.email, uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }));
        localStorage.setItem('userProfileData', JSON.stringify(userProfileToStore));

        toast({
            title: "Login Successful!",
            description: `Welcome back, ${user.displayName || user.email}!`,
            variant: "default"
        });
        // AppLayout useEffect listening to storage change should handle UI update
        // No explicit router.push('/') or router.refresh() needed here, as it might interrupt user flow if they are on other pages
    } catch (error: any) {
        let errorMessage = `Failed to sign in with Google.`;
        if (error.code) { // FirebaseError has a code property
            switch(error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = `Sign-in popup closed by user. Please try again.`;
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = `An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.`;
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Sign-in cancelled. Please try again.';
                    break;
                case 'auth/operation-not-allowed':
                     errorMessage = `Google sign-in is not enabled. Please contact support.`;
                     break;
                case 'auth/popup-blocked':
                    errorMessage = `Popup blocked by browser. Please allow popups for this site.`;
                    break;
                default:
                    errorMessage = error.message;
            }
        }
        console.error(`Google login error in header:`, error);
        toast({
            title: `Google Login Failed`,
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsSocialSubmitting(false);
    }
  };


  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
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
        {(!isClient || !isHomePage) && !(!isAuthenticated && isClient) && ( // Hide spacer if login button is shown
           <div className="h-10 w-10" />
        )}
        <ThemeToggleButton />
        {isClient && !isAuthenticated && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGoogleLogin} 
            disabled={isSocialSubmitting}
            className="ml-2"
          >
            {isSocialSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Login
          </Button>
        )}
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
                  avatarUrl: parsedCurrentUser.photoURL || undefined
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
                avatarUrl: parsedCurrentUser.photoURL || undefined 
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

    if (isClient) {
      checkAuth(); 
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentUser' || event.key === 'userProfileData') {
        if (isClient) checkAuth();
      }
    };
    
    if (isClient) {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', checkAuth); // Re-check auth on window focus
    }

    return () => {
      if (isClient) {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', checkAuth);
      }
    };
  }, [isClient, pathname]); // Rerun on pathname change if needed, though storage/focus should cover most auth changes

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader 
          isAuthenticated={isAuthenticated} 
          isClient={isClient} 
        />
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  );
}

    