'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CreateCategory } from '@/actions/dashboard/category/createCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
}

const CreateCategoryDialog = ({ open, setOpen }: Props) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const createCategoryMutation = useMutation({
        mutationFn: ({ name, desc }: { name: string, desc: string }) => CreateCategory(name, desc),
        onSuccess: () => {
            toast.success(`Successfully created category`, { id: 'create-category' });
            queryClient.invalidateQueries({ queryKey: ['categories', { type: 'form' }] });
            setName('');
            setDesc('');
            setOpen(false);
        },
        onError: (error) => {
            toast.error(`${error}`, { id: 'create-category' });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. This will create a category in the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <span className="flex flex-col py-4 gap-2">
                    <span>
                        If you&apos;re sure, Enter category name below:
                    </span>

                    <Input
                        type='name'
                        value={name}
                        className="mb-4"
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter name here...'
                    />

                    <Label>Description (optional)</Label>
                    <Textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder='Write a description here (optional) ...'
                    />
                </span>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setName(''); setDesc(''); }}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!name || createCategoryMutation.isPending}
                        className="bg-primary text-black hover:bg-primarys/90 cursor-pointer"
                        onClick={() => {
                            toast.loading(`Creating category...`, { id: 'create-category' });
                            createCategoryMutation.mutate({ name, desc });
                        }}
                    >
                        Create
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateCategoryDialog;