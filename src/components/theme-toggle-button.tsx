
"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a very simple, consistent placeholder during SSR and initial client render.
    // This div should have similar dimensions to the Button to avoid layout shift.
    return (
      <div className="inline-flex items-center justify-center h-10 w-10" aria-label="Toggle theme">
        <Moon className="h-5 w-5" /> {/* Consistently render Moon icon initially */}
      </div>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
