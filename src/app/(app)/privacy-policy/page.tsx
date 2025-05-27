
// src/app/(app)/privacy-policy/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <FileText className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
      </header>
      <p className="text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()} (Placeholder Date)
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle>
          <CardDescription>This is a placeholder privacy policy for Katha Vault.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
          <p>
            Welcome to Katha Vault! We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, 
            please contact us at privacy@kathavault.example.com (placeholder email).
          </p>
          
          <h2 className="text-xl font-semibold">1. Information We Collect (Placeholder)</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Website, 
            express an interest in obtaining information about us or our products and Services, when you participate 
            in activities on the Website or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the Website, 
            the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul>
            <li>Names</li>
            <li>Email addresses</li>
            <li>Usernames</li>
            <li>Passwords (hashed)</li>
            <li>Contact preferences</li>
            <li>User-generated content (stories, comments - placeholder)</li>
          </ul>

          <h2 className="text-xl font-semibold">2. How We Use Your Information (Placeholder)</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. 
            We process your personal information for these purposes in reliance on our legitimate business interests, 
            in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials.</li>
            <li>Request feedback.</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Will Your Information Be Shared? (Placeholder)</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, 
            to protect your rights, or to fulfill business obligations. (This section would be much more detailed in a real policy).
          </p>
          
          <h2 className="text-xl font-semibold">4. Cookies and Tracking Technologies (Placeholder)</h2>
          <p>
            We may use cookies and similar tracking technologies to access or store information. Specific information about 
            how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy (placeholder).
          </p>

          <h2 className="text-xl font-semibold">5. Your Privacy Rights (Placeholder)</h2>
          <p>
            In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. 
            These may include the right (i) to request access and obtain a copy of your personal information, 
            (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and 
            (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object 
            to the processing of your personal information. To make such a request, please use the contact details provided below.
          </p>

          <h2 className="text-xl font-semibold">6. Updates to This Notice (Placeholder)</h2>
          <p>
            We may update this privacy notice from time to time. The updated version will be indicated by an updated 
            "Revised" date and the updated version will be effective as soon as it is accessible.
          </p>

          <h2 className="text-xl font-semibold">7. Contact Us (Placeholder)</h2>
          <p>
            If you have questions or comments about this notice, you may email us at privacy@kathavault.example.com (placeholder email) 
            or by post to: Katha Vault Legal Department, 123 Story Lane, Fictionville, USA (Placeholder Address).
          </p>
          <p className="text-sm text-muted-foreground italic">
            This is a template/placeholder privacy policy. For a real application, consult with a legal professional 
            to ensure compliance with all applicable laws and regulations.
          </p>
        </CardContent>
      </Card>
       <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" asChild>
            <Link href="/account/settings">Back to Settings</Link>
        </Button>
      </div>
    </div>
  );
}

    