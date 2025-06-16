'use client';

import { assignRoleToUser } from '@/actions/dashboard/assignRoleToUser';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserRoles } from '@/lib/users/userRole';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
    username: string,
    userId: string,
}

const SetUserRole = ({ open, setOpen, username, userId }: Props) => {
    const [roleValue, setRoleValue] = useState('');
    const assignRoleMutation = useMutation({
        mutationFn: ({ userId, role, username }: { userId: string, role: string, username: string }) => assignRoleToUser(userId, role, username),
        onSuccess: () => {
            toast.success(`Successfully assigned ${roleValue.toLowerCase()} role to ${username}`, { id: userId });
            setRoleValue('');
        },
        onError: (error) => {
            toast.error(`${error}`, { id: userId });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action may give <span className='text-primary'>@{username}</span> access to many features of the app based on role.
                        <span className="flex flex-col py-4 gap-2">
                            <span>
                                If you&apos;re sure, select role below:
                            </span>

                            <Select onValueChange={setRoleValue} value={roleValue}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Assign New Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={UserRoles.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={UserRoles.MODERATOR}>Moderator</SelectItem>
                                    <SelectItem value={UserRoles.EDITOR}>Editor</SelectItem>
                                    <SelectItem value={UserRoles.MEMBER}>Member</SelectItem>
                                </SelectContent>
                            </Select>

                            {roleValue && (
                                <span>
                                    @{username} will get <span className='lowercase text-primary'>{roleValue}</span> role
                                </span>
                            )}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setRoleValue('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!roleValue || assignRoleMutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                            toast.loading(`Assigning ${roleValue.toLowerCase()} role to ${username}`, { id: userId })
                            assignRoleMutation.mutate({ userId, role: roleValue, username });
                        }}
                    >
                        Add Role
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SetUserRole;