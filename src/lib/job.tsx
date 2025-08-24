import { STATUS, TYPE } from "@prisma/client"
import { CheckCircle, Clock, Loader2Icon, XCircle } from "lucide-react"

export const getStatusIcon = (status: STATUS) => {
    switch (status) {
        case STATUS.COMPLETED:
            return <CheckCircle size={20} className="!w-4 !h-4 text-green-600" />
        case STATUS.FAILED:
            return <XCircle size={20} className="!w-4 !h-4 text-red-600" />
        case STATUS.PENDING:
            return <Clock size={20} className="!w-4 !h-4 text-yellow-600" />
        case STATUS.QUEUED:
            return <Clock size={20} className="!w-4 !h-4 text-blue-600" />
        case STATUS.PROCESSING:
            return <Loader2Icon size={20} className="!w-4 !h-4 text-gray-600 animate-spin" />
        default:
            return <Clock size={20} className="!w-4 !h-4 text-gray-600" />
    }
}

export const getStatusColor = (status: STATUS) => {
    switch (status) {
        case STATUS.COMPLETED:
            return "text-green-800 dark:text-green-600 border-green-800 dark:border-green-600"
        case STATUS.FAILED:
            return "text-[var(--color-destructive)] border-[var(--color-destructive)]"
        case STATUS.PENDING:
            return "text-yellow-800 dark:text-yellow-400 border-yellow-800 dark:border-yellow-400"
        case STATUS.QUEUED:
            return "text-blue-800 dark:text-blue-400 border-blue-800 dark:border-blue-400"
        case STATUS.PROCESSING:
            return "text-gray-800 dark:text-gray-400 border-gray-800 dark:border-gray-400"
        default:
            return "text-[var(--color-border)] border-[var(--color-border)]"
    }
}

export const getJobType = (type: TYPE) => {
    switch (type) {
        case TYPE.TOPIC_GENERATION:
            return "Topics"
        case TYPE.ARTICLE_GENERATION:
            return "Articles"
    };
};