"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, LogIn } from "lucide-react"

interface GuestLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GuestLimitModal({ open, onOpenChange }: GuestLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generation Limit Reached</DialogTitle>
          <DialogDescription>
            You've used all 3 free generations. Sign up or log in to continue generating unlimited content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button className="w-full" size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up for Free
          </Button>

          <Button variant="outline" className="w-full bg-transparent" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>✨ Unlimited generations</p>
          <p>📊 Advanced analytics</p>
          <p>🚀 Priority processing</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
