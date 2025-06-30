import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleColor, getRoleIcon, UserRoles } from "@/lib/users/userRole";
import { GetAllUsersData } from "@/actions/dashboard/getAllUsersData";
import UserManagement from "./_components/UserManagement";
import UserProfile from "@/components/users/UserProfile";
import { ShieldAlertIcon } from "lucide-react";
import { getRole } from "@/lib/users/getRole";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UsersPage = async () => {
    const role = await getRole();
    const users = await GetAllUsersData();

    return (
        <div className="max-w-screen min-w-screen md:max-w-[calc(100vw-280px)] md:min-w-[calc(100vw-280px)] flex flex-col items-start gap-8 py-4">
            <h1 className="text-3xl text-primary font-semibold px-6">Manage Users</h1>

            {role !== UserRoles.EDITOR ? (
                <UserManagement users={users} />
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
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
                                        variant="outline"
                                        className={cn("rounded-full text-xs pb-[3px] flex", getRoleColor(role))}
                                    >
                                        {getRoleIcon(role)}
                                        {role}
                                    </Badge>
                                </span>
                                <p>
                                    You are not authorized to access this page.
                                </p>
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default UsersPage;