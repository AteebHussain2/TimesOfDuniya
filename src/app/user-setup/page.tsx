"use client"

import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { UserSetup } from "@/actions/dashboard/userSetup"
import { motion } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { Suspense, useEffect } from "react"

export default function UserSetupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirectTo") || "/"

    const setupMutation = useMutation({
        mutationFn: async () => await UserSetup(),
        onSuccess: () => {
            setTimeout(() => {
                router.replace(redirectTo)
            }, 1500)
        },
    })

    // Run the setup as soon as this page loads
    useEffect(() => {
        setupMutation.mutate()
    }, [])

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-4"
                >
                    {setupMutation.isPending && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="flex flex-col items-center space-y-3"
                        >
                            <Loader2 className="h-12 w-12 text-blue-600" />
                            <p className="text-gray-700 text-lg font-medium">
                                Please wait, setting up your account...
                            </p>
                        </motion.div>
                    )}

                    {setupMutation.isSuccess && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center space-y-3"
                        >
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                            <p className="text-green-700 text-lg font-semibold">
                                Your account is ready! Redirecting...
                            </p>
                        </motion.div>
                    )}

                    {setupMutation.isError && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center space-y-3"
                        >
                            <AlertCircle className="h-12 w-12 text-red-600" />
                            <p className="text-red-600 text-lg font-semibold">
                                Failed to set up your account. Please try again.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </Suspense>
    )
}
