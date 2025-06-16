'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, SendHorizontal, ShieldAlertIcon } from "lucide-react";
import UserProfile from "@/components/users/UserProfile";
import { userRoleColor } from "@/lib/users/userRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

const UnauthorizedAccess = ({ role }: { role: string }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen">
            <Card>
                <CardHeader className="flex items-center justify-center">
                    <CardTitle className="flex items-center gap-2 text-destructive text-[1.35rem] font-semibold">
                        <ShieldAlertIcon size={30} />
                        Unauthorized Access
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <UserProfile width={400} border={true} />
                </CardContent>

                <CardFooter>
                    <span className="flex flex-col items-start gap-1 text-muted-foreground text-sm">
                        <span className="flex items-center gap-2">
                            <p>
                                Your current role is:
                            </p>
                            <Badge
                                variant={'outline'}
                                className={cn("rounded-full text-[0.6rem] pb-[3px]",
                                    userRoleColor[role as Role]
                                )}>
                                {role}
                            </Badge>
                        </span>
                        <p>
                            You are not authorized to access this dashboard.
                        </p>

                        <span className="w-full flex flex-col sm:flex-row flex-1/2 items-center gap-2 pt-4">
                            <Button
                                variant={"default"}
                                size={'sm'}
                                className="flex items-center w-full sm:w-[calc(50%-4px)]"
                                onClick={() => redirect("/")}
                            >
                                <ArrowLeft />
                                <p className="pb-[3px]">Go Back</p>
                            </Button>
                            <Button
                                variant={"outline"}
                                size={'sm'}
                                className="flex items-center w-full sm:w-[calc(50%-4px)]"
                            >
                                <p className="pb-[3px]">TODO: Request</p>
                                <SendHorizontal />
                            </Button>
                        </span>
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}

export default UnauthorizedAccess
