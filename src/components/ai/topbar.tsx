import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "../ThemeToggle";
import { MobileAISidebar } from "./sidebar";
import { User } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-separate bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-6">
        <div className="flex items-center gap-4">
          <MobileAISidebar />
          <div className="flex items-center space-x-4 text-lg font-bold">
            I<span className="text-rose-600 dark:text-rose-500">T</span>LAA - ا<span className="text-rose-600 dark:text-rose-500">ط</span>لاع
            <Badge variant="secondary" className="text-xs">
              AI Studio
            </Badge>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
