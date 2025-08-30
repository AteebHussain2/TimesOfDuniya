import { cn } from "@/lib/utils"
import Link from "next/link"

interface LogoProps {
    title?: string,
    fontSize?: string,
    // iconSize?: number,
}

const Logo = ({ title, fontSize = "text-2xl" }: LogoProps) => {
    return (
        <Link
            href="/"
            className={cn("text-xl sm:text-2xl font-bold text-foreground flex-shrink-0", fontSize)}
        >
            <h1 className="tracking-wide">
                {title ?? <>
                    I<span className="text-rose-600 dark:text-rose-500">T</span>LAA - ا<span className="text-rose-600 dark:text-rose-500">ط</span>لاع
                </>}
            </h1>
        </Link>
    )
}

export default Logo
