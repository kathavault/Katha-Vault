
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Palette, ShieldCheck, LogOut, Save } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AccountSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkModeSystem, setDarkModeSystem] = useState(true);

  const handleSaveChanges = () => {
    // In a real app, you'd save these settings to a backend.
    console.log("Settings saved:", { emailNotifications, pushNotifications, darkModeSystem });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <SettingsIcon className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
      </header>
      <p className="text-muted-foreground">
        Manage your notification preferences, theme settings, and account security.
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
              <p className="text-sm text-muted-foreground font-normal">Get real-time alerts on your device (coming soon!).</p>
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              disabled 
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
                disabled // Theme is handled by ThemeProvider, this is a visual placeholder
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
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Privacy Policy</Button>
             <Button variant="destructive" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>
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
