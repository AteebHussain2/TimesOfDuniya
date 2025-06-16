import EditPostForm from './_components/EditPostForm';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftIcon, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    params: Promise<{
        postId: number,
        slug: string
    }>,
};

const page = async ({ params }: Props) => {
    const { postId, slug } = await params;

    return (
        <div className="w-full flex flex-col items-start gap-4 bg-background hide-scrollbar">
            <div className="flex items-center gap-1 px-8 py-2">
                <Button
                    variant={"ghost"}
                    asChild
                >
                    <Link href={'/content'}>
                        <ArrowLeftIcon size={20} className="size-[20px] !p-0 !m-0" />
                    </Link>
                </Button>
                <h1 className="sm: text-lgmd:text-xl lg:text-2xl xl:text-3xl font-semibold">Update Post</h1>
            </div>

            <Separator />

            <EditPostForm slug={slug} postId={Number(postId)} />
        </div>
    )
}

export default page
