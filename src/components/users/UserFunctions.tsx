'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVerticalIcon, User2Icon } from "lucide-react";
import TooltipWrapper from "../TooltipWrapper";
import { Button } from "../ui/button";
import { useState } from "react";
import SetUserRole from "./SetUserRole";

const UserFunctions = ({ username, userId }: { username: string, userId: string }) => {
    const [showRoleDialog, setShowRoleDialog] = useState(false)

    return (
        <>
            <SetUserRole
                open={showRoleDialog}
                setOpen={setShowRoleDialog}
                username={username}
                userId={userId}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'outline'} size={'sm'} className="!p-0">
                        <TooltipWrapper content={"More actions"}>
                            <div className="flex items-center justify-center w-full h-full px-[10px]">
                                <MoreVerticalIcon size={18} />
                            </div>
                        </TooltipWrapper>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-muted-foreground group flex items-center gap-2 cursor-pointer outline-none hover:bg-accent transition-colors"
                        onSelect={() => setShowRoleDialog((prev) => !prev)}
                    >
                        <User2Icon size={16} className="group-hover:text-primary transition-colors" />
                        Role
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default UserFunctions;