"use client";

import { Loader2, Lightbulb, AlertCircle } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { STATUS } from "@prisma/client";

export default function AIAnimatedLoader({ status, defaultNode }: { status: STATUS, defaultNode?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    useEffect(() => {
        if (status !== STATUS.COMPLETED && status !== STATUS.FAILED) {
            const container = containerRef.current
            if (!container) return

            const totalHeight = container.scrollHeight
            const visibleHeight = container.clientHeight

            controls.start({
                y: [0, -(totalHeight - visibleHeight)],
                transition: {
                    duration: Math.max(15, totalHeight / 50), // slower if more text
                    ease: "linear",
                    repeat: Infinity,
                },
            })
        }
    }, [controls, status])

    if (!status || status === STATUS.COMPLETED || status === STATUS.PENDING) {
        return defaultNode ? defaultNode : (
            <div className="text-center py-8 text-muted-foreground" >
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nothing generated yet. Use the form above to get started!</p>
            </div>
        )
    }

    if (status === STATUS.FAILED) {
        return (
            <div className="flex items-center gap-2 text-destructive font-medium">
                <AlertCircle className="h-5 w-5" />
                <span>Generation failed. Please try again!</span>
            </div>
        )
    }

    if (status === STATUS.PROCESSING || status === STATUS.QUEUED) {
        return (
            <div className="w-full">
                {/* Spinner with message */}
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating topics…</span>
                </div>

                {/* Simulated AI writing area */}
                <div className="relative w-full h-96 rounded-md bg-muted overflow-hidden">
                    {/* Scrolling dummy article */}
                    <motion.div
                        ref={containerRef}
                        animate={controls}
                        className="absolute inset-0 px-6 py-6 space-y-6"
                    >
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-0">
                            Germany's unemployment figures have surpassed the three million mark for the first time in ten years, reaching 3.025 million in August 2025. This marks a significant milestone, with the unemployment rate climbing to 6.4%. Experts attribute the rise partly to seasonal factors and anticipate a marginal increase in the coming months.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-300">
                            International organizations and the Pakistani government are mobilizing resources to assist communities in Punjab affected by recent devastating floods. Relief efforts include the distribution of essential supplies such as food, clean water, and medical assistance.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-600">
                            Researchers at the Massachusetts Institute of Technology (MIT) have developed an artificial intelligence system named VaxSeer, designed to enhance the process of selecting influenza vaccine strains. By leveraging machine learning, VaxSeer predicts dominant flu strains months in advance and identifies vaccine candidates offering superior protection.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            The globally acclaimed manga series *One Piece*, created by Eiichiro Oda, is currently on hiatus, leading to fan concern, largely attributed to potential health issues of the creator. While major international news outlets have not extensively detailed the reasons, fan communities suggest health-related breaks, referencing Oda's past health challenges. The manga's Chapter 1158 is anticipated around August 31, 2025. The series maintains immense cultural significance, evidenced by its successful Netflix live-action adaptation and its recognition for scale, such as being the longest single-volume book. Fan anxiety highlights the deep connection to both the narrative and its creator, awaiting further updates.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            Ukraine reported that Russia launched one of its most significant aerial assaults in weeks overnight, deploying 574 drones and missiles. The strikes, which hit multiple regions including Kyiv, primarily aimed at energy infrastructure, resulting in at least one fatality and several injuries.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            Alphabet's stock experienced a notable increase following reports suggesting that Apple plans to integrate Google's Gemini AI into its Siri virtual assistant. This development could signify a significant shift in the AI landscape and partnerships between major tech players.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            The U.S. government has officially taken a 10% equity stake in chipmaker Intel, representing an $8.9 billion investment in the company's common stock. Announced by President Trump and confirmed by Commerce Secretary Howard Lutnick, the deal is part of a broader initiative to bolster American technology firms.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            Artificial Intelligence (AI) is revolutionizing education by enabling personalized learning, enhancing teaching methods, and improving administrative efficiency. However, ethical challenges including bias, privacy, transparency, and equity must be carefully managed to ensure responsible implementation and equitable access for all students.
                        </p>
                        <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
                            As AI becomes more integrated into education, the role of teachers is evolving. Teachers are becoming facilitators, guiding students in using AI tools effectively and fostering critical thinking skills. Professional development and training are essential to prepare educators for this changing landscape.
                        </p>
                    </motion.div>

                    {/* Blur overlay for mystery */}
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-background/20" />
                </div>
            </div>
        )
    }

    return null
}
