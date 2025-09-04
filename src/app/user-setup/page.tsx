"use client"

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSetup } from "@/actions/dashboard/userSetup";
import { useMutation } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSetupLoader } from "./_components/AnimatedSetupLoader";

function SetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";

    const setupMutation = useMutation({
        mutationFn: async () => await UserSetup(),
        onSuccess: () => {
            setTimeout(() => {
                router.replace(redirectTo);
            }, 1500);
        },
    });

    useEffect(() => {
        setupMutation.mutate();
    }, [setupMutation]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-4"
            >
                {setupMutation.isPending && (
                    <AnimatedSetupLoader />
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
    );
}

export default function UserSetupPage() {
    return (
        <Suspense fallback={<div>Loading search params...</div>}>
            <SetupContent />
        </Suspense>
    );
}
