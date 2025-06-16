import { GetAllUsersData } from "@/actions/dashboard/getAllUsersData";
import UserFunctions from "@/components/users/UserFunctions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userRoleColor } from "@/lib/users/userRole";
import { TypeGetAllUsersData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

const page = async () => {
    const users = await GetAllUsersData();
    return (
        <div className="max-w-screen min-w-screen md:max-w-[calc(100vw-280px)] md:min-w-[calc(100vw-280px)] flex flex-col items-start gap-8 py-4">
            <h1 className="text-3xl text-primary font-semibold px-6">
                Manage Users
            </h1>

            <Separator />

            <div className="w-full px-6">
                TODO: Search wrt username, email
            </div>

            <Separator />

            <div className="w-full px-2 sm:px-8 flex flex-col flex-1 gap-4">
                {users.map((user: TypeGetAllUsersData[number], index: number) => (
                    <Card key={index} className="!py-4">
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image
                                        width={56}
                                        height={56}
                                        src={user.imageUrl!}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="rounded-full object-cover aspect-square !size-[42px] sm:!size-[56px]"
                                    />

                                    <span className="flex flex-col items-start">
                                        <span className="flex items-center gap-2">
                                            <h3 className="font-semibold">
                                                {user.firstName!} {user.lastName}
                                            </h3>
                                            <Badge
                                                variant={'outline'}
                                                className={cn("rounded-full text-[0.6rem] pb-[3px] flex sm:hidden",
                                                    userRoleColor[user.role as Role]
                                                )}>
                                                {user.role}
                                            </Badge>
                                        </span>

                                        <h3 className="text-sm font-normal text-muted-foreground">
                                            @{user.username}
                                        </h3>
                                        <h3 className="text-sm text-muted-foreground flex lg:hidden">
                                            {user.email}
                                        </h3>
                                    </span>
                                </div>

                                <h3 className="text-sm text-muted-foreground hidden lg:flex">
                                    {user.email}
                                </h3>

                                <h3 className="text-sm text-muted-foreground hidden lg:flex">
                                    Joined: {user.createdAt.toLocaleDateString()}
                                </h3>

                                <Badge
                                    variant={'outline'}
                                    className={cn("rounded-full text-[0.6rem] pb-[3px] hidden sm:flex",
                                        userRoleColor[user.role as Role]
                                    )}>
                                    {user.role}
                                </Badge>

                                <UserFunctions
                                    username={user.username}
                                    userId={user.id}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

    );
};

export default page;