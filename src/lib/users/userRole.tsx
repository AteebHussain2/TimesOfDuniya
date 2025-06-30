import { Crown, EditIcon, ShieldCheck, User2 } from "lucide-react";

export const userRoleColor = {
    "ADMIN": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    "MODERATOR": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    "EDITOR": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    "MEMBER": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
};

export const getRoleIcon = (role: string) => {
    switch (role) {
        case UserRoles.ADMIN:
            return <Crown className="h-3 w-3" />
        case UserRoles.MODERATOR:
            return <ShieldCheck className="h-3 w-3" />
        case UserRoles.EDITOR:
            return <EditIcon className="h-3 w-3" />
        default:
            return <User2 className="h-3 w-3" />
    }
}

export const getRoleColor = (role: string) => {
    switch (role) {
        case UserRoles.ADMIN:
            return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        case UserRoles.MODERATOR:
            return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        case UserRoles.EDITOR:
            return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
}

export const UserRoles = {
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
    EDITOR: "EDITOR",
    MEMBER: "MEMBER",
};