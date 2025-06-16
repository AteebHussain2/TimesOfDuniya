import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GetAllPosts } from '@/actions/dashboard/posts/getAllPosts';
import { DeletePost } from '@/actions/dashboard/posts/deletePost';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (showDialog: boolean) => void;
    post: Awaited<ReturnType<typeof GetAllPosts>>[number] | undefined;
}

const PostDeleteDialog = ({ open, setOpen, post }: Props) => {
    const [text, setText] = useState('');

    const DeletePostMutation = useMutation({
        mutationFn: ({ slug, id }: { slug: string, id: number }) => DeletePost(slug, id),
        onSuccess: () => {
            toast.success(`Post successfully deleted!`, { id: 'delete-post' });
            setText('');
        },
        onError: (error) => {
            toast.error(`${error}`, { id: 'delete-post' });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. This will delete your post permanently.
                        <span className="flex flex-col py-4 gap-2">
                            <span>
                                If you&apos;re sure, Enter {post?.slug} below:
                            </span>

                            <Input
                                type='text'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder='Enter name here...'
                            />
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setText('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={DeletePostMutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                            if (!post?.slug || !post?.id) {
                                toast.error(`Post data is missing`, { id: 'delete-post' });
                                return;
                            };
                            toast.loading(`Deleting post...`, { id: 'delete-post' });
                            DeletePostMutation.mutate({ slug: post?.slug, id: post?.id });
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PostDeleteDialog;