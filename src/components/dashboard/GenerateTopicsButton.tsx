'use client';

import { StartCronTasks } from '@/actions/dashboard/jobs/startCronTasks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2Icon, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const GenerateTopicsButton = ({ role }: { role: string }) => {

    const HandleGenerateMutation = useMutation({
        mutationFn: () => StartCronTasks(role),
        onSuccess: () => toast.success('Successfully queued all tasks!'),
        onError: (error) => toast.error(error.message),
    });

    return (
        <Button
            size={'lg'}
            variant={'secondary'}
            className="gap-2 px-6 py-3 text-base font-semibold shadow-lg cursor-pointer"
            onClick={() => HandleGenerateMutation.mutate()}
            disabled={HandleGenerateMutation.isPending}
        >
            {!HandleGenerateMutation.isPending ? (
                <>
                    <Sparkles className="w-5 h-5 text-primary-2" />
                    Generate Topics
                </>
            ) : (
                <>
                    <Loader2Icon className='size-4 animate-spin' />
                    Generate Topics
                </>
            )}
        </Button>
    )
}

export default GenerateTopicsButton
