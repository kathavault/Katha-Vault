
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  // Placeholder functions for admin actions
  const handleManageUsers = () => alert("User management UI would be here.");
  const handleManageStories = () => alert("Story management UI (CRUD operations) would be here.");
  const handleSiteSettings = () => alert("General site settings UI would be here.");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
      </header>
      <p className="text-muted-foreground">
        Manage users, stories, and site settings. This is a placeholder UI. Full functionality requires backend implementation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, edit, or suspend user accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageUsers} className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Story Management</CardTitle>
            <CardDescription>Add, edit, or delete stories and chapters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageStories} className="w-full">Manage Stories</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Configure general site parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSiteSettings} className="w-full">Site Settings</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-destructive bg-destructive/10">
        <CardHeader className="flex-row items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
                <CardTitle className="text-destructive">Developer Note</CardTitle>
                <CardDescription className="text-destructive/80">
                This admin panel is a UI concept. All management actions (creating, editing, deleting data) require backend development and database integration to be functional.
                </CardDescription>
            </div>
        </CardHeader>
      </Card>
       <Button variant="outline" asChild className="mt-6">
          <Link href="/">Go Back to Site</Link>
        </Button>
    </div>
  );
}
