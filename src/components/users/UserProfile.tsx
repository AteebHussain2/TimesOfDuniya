'use client';

import { GetUserDataByUserId } from "@/actions/dashboard/getUserDataByUserId"
import UserProfileSkeleton from "./UserProfileSkeleton";
import { userRoleColor } from "@/lib/users/userRole";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils";
import Image from "next/image"

interface Props {
    width?: number,
    border?: boolean,
}

const UserProfile = ({ width, border }: Props) => {
    const { user } = useUser();
    const { data: userData, isPending } = useQuery({
        queryFn: GetUserDataByUserId,
        queryKey: ['userData', user?.id],
    })

    if (isPending || !userData) {
        return (
            <UserProfileSkeleton />
        );
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4 px-4 py-6",
            width ? `!w-[${width}px]` : '!w-full',
            border && 'border border-separate rounded-md',
        )}>
            <Image
                width={112}
                height={112}
                src={userData.imageUrl!}
                loading="eager"
                alt={`${userData.firstName} ${userData.lastName}`}
                className="rounded-full object-cover aspect-square"
            />
            <span className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-2 justify-center">
                    <h3 className="font-semibold">
                        {userData.firstName} {userData.lastName}
                    </h3>
                    <Badge
                        variant={'outline'}
                        className={cn("rounded-full text-[0.6rem] pb-[3px]",
                            userRoleColor[userData.role as Role]
                        )}>
                        {userData.role}
                    </Badge>
                </span>
                <h3 className="text-sm text-muted-foreground">
                    {userData.email}
                </h3>
                <h3 className="text-sm text-muted-foreground">
                    @{userData.username}
                </h3>
            </span>
        </div>
    )
}

export default UserProfile;
