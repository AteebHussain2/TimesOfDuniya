import { GetPostByIdAndSlug } from "@/actions/dashboard/posts/getPostByIdAndSlug"

interface Props {
    params: Promise<{
        postId: string,
        slug: string
    }>,
};

const page = async ({ params }: Props) => {
    const { postId, slug } = await params;
    const post = await GetPostByIdAndSlug(Number(postId), slug);
    return (
        <pre>
            {JSON.stringify(post, null, 4)}
        </pre>
    )
}

export default page
