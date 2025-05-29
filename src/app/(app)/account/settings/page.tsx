
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Palette, ShieldCheck, LogOut, Save, UserCog, VenetianMask, Mail, KeyRound, Ban, UserX, Trash2, EyeOff } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { updatePassword, verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential, type User } from "firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address."),
  currentPasswordForEmail: z.string().min(1, "Current password is required for email change."),
}).refine(data => data.newEmail !== auth.currentUser?.email, {
  message: "New email must be different from the current one.",
  path: ["newEmail"],
});
type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
  confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});
type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;


export default function AccountSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkModeSystem, setDarkModeSystem] = useState(true);
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [isEmailHidden, setIsEmailHidden] = useState(false);

  const [isChangeEmailDialogOpen, setIsChangeEmailDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isBlockedAccountsDialogOpen, setIsBlockedAccountsDialogOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  
  const mockBlockedUsers = [{id: 'userBlock1', name: 'TroubleMakerX'}, {id: 'userBlock2', name: 'SpamBot007'}];

  const emailForm = useForm<EmailChangeFormData>({ resolver: zodResolver(emailChangeSchema) });
  const passwordForm = useForm<PasswordChangeFormData>({ resolver: zodResolver(passwordChangeSchema) });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmailNotifications = localStorage.getItem('settings_emailNotifications');
      if (storedEmailNotifications !== null) setEmailNotifications(JSON.parse(storedEmailNotifications));

      const storedPushNotifications = localStorage.getItem('settings_pushNotifications');
      if (storedPushNotifications !== null) setPushNotifications(JSON.parse(storedPushNotifications));
      
      const storedIsProfilePrivate = localStorage.getItem('settings_isProfilePrivate');
      if (storedIsProfilePrivate !== null) setIsProfilePrivate(JSON.parse(storedIsProfilePrivate));

      const storedIsEmailHidden = localStorage.getItem('settings_isEmailHidden');
      if (storedIsEmailHidden !== null) setIsEmailHidden(JSON.parse(storedIsEmailHidden));
    }
  }, []);

  const handleSaveChanges = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings_emailNotifications', JSON.stringify(emailNotifications));
      localStorage.setItem('settings_pushNotifications', JSON.stringify(pushNotifications));
      localStorage.setItem('settings_isProfilePrivate', JSON.stringify(isProfilePrivate));
      localStorage.setItem('settings_isEmailHidden', JSON.stringify(isEmailHidden));
    }
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated and saved locally.",
    });
  };

  const handleChangeEmailSubmit: SubmitHandler<EmailChangeFormData> = async (data) => {
    if (!currentUser || !currentUser.email) {
      toast({ title: "Error", description: "No user logged in or current email not found.", variant: "destructive" });
      return;
    }

    try {
      // Re-authenticate user before sensitive operations
      const credential = EmailAuthProvider.credential(currentUser.email, data.currentPasswordForEmail);
      await reauthenticateWithCredential(currentUser, credential);

      // Proceed with email update
      await verifyBeforeUpdateEmail(currentUser, data.newEmail);
      toast({ 
        title: "Verification Email Sent", 
        description: `A verification link has been sent to ${data.newEmail}. Please check your inbox to complete the email change. You may need to log in again after verifying.`,
        duration: 7000 
      });
      emailForm.reset();
      setIsChangeEmailDialogOpen(false);
      // Update local storage if you want to reflect the attempt, though profile page will use Firebase's email
      const userProfileData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
      localStorage.setItem('userProfileData', JSON.stringify({...userProfileData, emailPendingVerification: data.newEmail}));

    } catch (error: any) {
      console.error("Error changing email:", error);
      let errorMessage = "Failed to change email. Please ensure your current password is correct.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect current password. Please try again.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use by another account.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "This operation is sensitive and requires recent authentication. Please log out and log back in to change your email.";
      }
      toast({ title: "Email Change Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const handleChangePasswordSubmit: SubmitHandler<PasswordChangeFormData> = async (data) => {
    if (!currentUser || !currentUser.email) {
      toast({ title: "Error", description: "No user logged in.", variant: "destructive" });
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, data.newPassword);
      toast({ title: "Password Changed", description: "Your password has been successfully updated." });
      passwordForm.reset();
      setIsChangePasswordDialogOpen(false);
    } catch (error: any) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password. Ensure your current password is correct.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect current password. Please try again.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The new password is too weak. Please choose a stronger one.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "This operation is sensitive and requires recent authentication. Please log out and log back in to change your password.";
      }
      toast({ title: "Password Change Failed", description: errorMessage, variant: "destructive" });
    }
  };
  
  const handleUnblockUser = (userId: string, userName: string) => {
     toast({ title: "User Unblocked (Simulated)", description: `${userName} has been unblocked.` });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser'); 
        localStorage.removeItem('userProfileData');
        // Remove other settings from localStorage on logout
        localStorage.removeItem('settings_emailNotifications');
        localStorage.removeItem('settings_pushNotifications');
        localStorage.removeItem('settings_isProfilePrivate');
        localStorage.removeItem('settings_isEmailHidden');
      }
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      setIsLogoutConfirmOpen(false);
      router.push('/'); 
      setTimeout(() => window.location.reload(), 100); 
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <UserCog className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
      </header>
      <p className="text-muted-foreground">
        Manage your notification preferences, theme settings, account security, and privacy.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications from Katha Vault.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
            <Label htmlFor="email-notifications" className="font-medium">
              Email Notifications
              <p className="text-sm text-muted-foreground font-normal">Receive updates and news via email.</p>
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
            <Label htmlFor="push-notifications" className="font-medium">
              Push Notifications
              <p className="text-sm text-muted-foreground font-normal">Get real-time alerts on your device.</p>
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of Katha Vault.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
                <Label htmlFor="dark-mode-system" className="font-medium">
                Sync with System Theme
                <p className="text-sm text-muted-foreground font-normal">Automatically switch between light/dark mode based on your OS settings.</p>
                </Label>
                <Switch
                id="dark-mode-system"
                checked={darkModeSystem}
                onCheckedChange={setDarkModeSystem}
                disabled 
                />
            </div>
            <p className="text-sm text-muted-foreground px-4">
                Theme preferences can be managed using the theme toggle button in the header.
            </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Security & Privacy
          </CardTitle>
          <CardDescription>Manage your account security and privacy settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
                <Label htmlFor="profile-private" className="font-medium">
                Private Profile
                <p className="text-sm text-muted-foreground font-normal">If enabled, your profile and activity may not be publicly visible to non-followers.</p>
                </Label>
                <Switch
                id="profile-private"
                checked={isProfilePrivate}
                onCheckedChange={setIsProfilePrivate}
                />
            </div>
             <div className="flex items-center justify-between space-x-2 p-4 rounded-md border">
                <Label htmlFor="email-hidden" className="font-medium">
                  Hide Email on Public Profile
                  <p className="text-sm text-muted-foreground font-normal">If enabled, your email address will not be visible on your public profile page (if one exists).</p>
                </Label>
                <Switch
                  id="email-hidden"
                  checked={isEmailHidden}
                  onCheckedChange={setIsEmailHidden}
                />
              </div>

            <Dialog open={isChangeEmailDialogOpen} onOpenChange={setIsChangeEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" /> Change Email Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Email Address</DialogTitle>
                  <DialogDescription>Enter your new email address and current password. A verification link will be sent to the new email.</DialogDescription>
                </DialogHeader>
                <form onSubmit={emailForm.handleSubmit(handleChangeEmailSubmit)} className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="newEmail">New Email</Label>
                    <Input id="newEmail" type="email" {...emailForm.register("newEmail")} />
                    {emailForm.formState.errors.newEmail && <p className="text-destructive text-sm mt-1">{emailForm.formState.errors.newEmail.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="currentPasswordForEmail">Current Password</Label>
                    <Input id="currentPasswordForEmail" type="password" {...emailForm.register("currentPasswordForEmail")} />
                    {emailForm.formState.errors.currentPasswordForEmail && <p className="text-destructive text-sm mt-1">{emailForm.formState.errors.currentPasswordForEmail.message}</p>}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsChangeEmailDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={emailForm.formState.isSubmitting}>Request Change</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>Enter your current and new password.</DialogDescription>
                </DialogHeader>
                <form onSubmit={passwordForm.handleSubmit(handleChangePasswordSubmit)} className="space-y-4 py-2">
                   <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                    {passwordForm.formState.errors.currentPassword && <p className="text-destructive text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                     {passwordForm.formState.errors.newPassword && <p className="text-destructive text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" {...passwordForm.register("confirmNewPassword")} />
                    {passwordForm.formState.errors.confirmNewPassword && <p className="text-destructive text-sm mt-1">{passwordForm.formState.errors.confirmNewPassword.message}</p>}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsChangePasswordDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={passwordForm.formState.isSubmitting}>Change Password</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isBlockedAccountsDialogOpen} onOpenChange={setIsBlockedAccountsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <Ban className="mr-2 h-4 w-4" /> Blocked Accounts
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Blocked Accounts</DialogTitle>
                        <DialogDescription>Manage users you've blocked. (Simulated)</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
                        {mockBlockedUsers.length > 0 ? mockBlockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                                <span className="text-sm font-medium">{user.name}</span>
                                <Button variant="outline" size="sm" onClick={() => handleUnblockUser(user.id, user.name)}>
                                    <UserX className="mr-1 h-3 w-3" /> Unblock
                                </Button>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center">You haven't blocked any users.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                             <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/privacy-policy">
                    <VenetianMask className="mr-2 h-4 w-4" /> Privacy Policy
                </Link>
            </Button>

            <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
                <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will log you out of your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">Log Out</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" asChild>
            <Link href="/account">Cancel</Link>
        </Button>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
