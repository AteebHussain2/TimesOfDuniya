import { Check, Settings, Database, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

interface AnimatedSetupLoaderProps {
    onComplete?: () => void;
}

const setupSteps = [
    { id: 1, title: "Initializing", icon: Settings, duration: 2000 },
    { id: 2, title: "Setting up database", icon: Database, duration: 3000 },
    { id: 3, title: "Configuring security", icon: Shield, duration: 2500 },
    { id: 4, title: "Finalizing setup", icon: Sparkles, duration: 1500 }
];

export const AnimatedSetupLoader = ({ onComplete }: AnimatedSetupLoaderProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentStep < setupSteps.length) {
            const timer = setTimeout(() => {
                setCompletedSteps(prev => [...prev, currentStep]);

                if (currentStep === setupSteps.length - 1) {
                    setTimeout(() => {
                        setIsComplete(true);
                        onComplete?.();
                    }, 1000);
                } else {
                    setCurrentStep(prev => prev + 1);
                }
            }, setupSteps[currentStep].duration);

            return () => clearTimeout(timer);
        }
    }, [currentStep, onComplete]);

    return (
        <div className="flex flex-col bg-background items-center space-y-8 p-8">
            {/* Main loading animation */}
            <div className="relative">
                {/* Animated rings */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/20 w-32 h-32"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    }}
                />

                <motion.div
                    className="absolute inset-2 rounded-full border-2 border-primary-glow/40 w-28 h-28"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />

                {/* Center icon */}
                <motion.div
                    className="relative w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            "0 0 20px hsl(var(--primary) / 0.3)",
                            "0 0 40px hsl(var(--primary) / 0.6)",
                            "0 0 20px hsl(var(--primary) / 0.3)"
                        ]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    }}
                >
                    {isComplete ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                        >
                            <Check className="w-12 h-12 text-primary" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentStep}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        >
                            {setupSteps[currentStep] && (() => {
                                const IconComponent = setupSteps[currentStep].icon;
                                return <IconComponent className="w-12 h-12 text-primary" />;
                            })()}
                        </motion.div>
                    )}
                </motion.div>

                {/* Floating particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary-glow rounded-full"
                        style={{
                            left: `${50 + 60 * Math.cos((i * Math.PI * 2) / 8)}%`,
                            top: `${50 + 60 * Math.sin((i * Math.PI * 2) / 8)}%`,
                        }}
                        animate={{
                            scale: [0.5, 1, 0.5],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Progress steps */}
            <div className="space-y-6 w-full max-w-md">
                {setupSteps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = completedSteps.includes(index);
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Step icon */}
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                        ? 'bg-gradient-success border-green-500'
                                        : isActive
                                            ? 'bg-gradient-primary border-primary animate-pulse-glow'
                                            : 'bg-muted border-muted-foreground/20'
                                    }`}
                                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", damping: 15 }}
                                    >
                                        <Check className="w-6 h-6 text-white" />
                                    </motion.div>
                                ) : (
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'
                                        }`} />
                                )}
                            </motion.div>

                            {/* Step content */}
                            <div className="flex-1">
                                <motion.h3
                                    className={`font-semibold transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'
                                        }`}
                                    animate={isActive ? {
                                        color: ["hsl(var(--foreground))", "hsl(var(--primary))", "hsl(var(--foreground))"]
                                    } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    {step.title}
                                </motion.h3>

                                {/* Progress bar */}
                                {isActive && (
                                    <motion.div
                                        className="mt-2 h-1 bg-muted rounded-full overflow-hidden"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-loading bg-[length:200%_100%] animate-progress-loading rounded-full"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: step.duration / 1000,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Status text */}
            <motion.div
                className="text-center space-y-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <motion.p
                    className="text-lg font-medium text-foreground"
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                >
                    {isComplete
                        ? "🎉 Setup complete! Welcome aboard!"
                        : `${setupSteps[currentStep]?.title || "Processing"}...`
                    }
                </motion.p>

                <motion.p
                    className="text-sm text-muted-foreground"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    {isComplete
                        ? "You're all set to get started"
                        : "This will just take a moment"
                    }
                </motion.p>
            </motion.div>

            {/* Background particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, -40],
                            opacity: [0, 0.6, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};