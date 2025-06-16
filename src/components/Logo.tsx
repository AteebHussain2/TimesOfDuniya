import { cn } from "@/lib/utils"
import { NewspaperIcon } from "lucide-react"
import Link from "next/link"

interface LogoProps {
    title?: string,
    fontSize?: string,
    iconSize?: number,
}

const Logo = ({ title, fontSize = "text-2xl", iconSize = 20 }: LogoProps) => {
    return (
        <Link
            href="/"
            className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)}
        >
            <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
                <NewspaperIcon size={iconSize} className="stroke-white" />
            </div>

            <div>
                <span className="text-stone-700 dark:text-stone-300">
                    {title ?? "Times Of Duniya"}
                </span>
            </div>
        </Link>
    )
}

export default Logo
