import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    title: string
    value: number
    icon: LucideIcon
    iconClass?: string
    titleClass?: string
}

const CategoryStatsCard = (props: Props) => {
    return (
        <Card className="relative overflow-hidden h-full">
            <CardHeader className="flex pb-2">
                <CardTitle className={cn(props.titleClass)}>{props.title}</CardTitle>
                <props.icon
                    size={120}
                    className={cn("text-muted-foreground absolute -bottom-4 -right-8 opacity-10",
                        props.iconClass
                    )}
                />
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold text-primary">
                    <ReactCountUpWrapper value={props.value} />
                </div>
            </CardContent>
        </Card>
    )
}

export default CategoryStatsCard;
