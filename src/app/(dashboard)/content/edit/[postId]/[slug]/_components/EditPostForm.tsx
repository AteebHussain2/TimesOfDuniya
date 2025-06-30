"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe2Icon, Loader2Icon, PlusIcon, SaveIcon, UploadCloud } from "lucide-react";
import { GetPostByIdAndSlug } from "@/actions/dashboard/posts/getPostByIdAndSlug";
import CreateCategoryDialog from "@/components/category/CreateCategoryDialog";
import { GetCategories } from "@/actions/dashboard/category/getCategories";
import { UpdatePost } from "@/actions/dashboard/posts/updatePost";
import { TypeGetAllTags, TypeGetCategories } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import FileUpload from "@/components/image-kit/FileUpload";
import { TagsInput } from "@/components/ui/tags-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema } from "@/lib/post/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Image } from "@imagekit/next";
import Markdown from "react-markdown";
import { toast } from "sonner";
import * as z from "zod";

export default function EditPostForm({ slug, postId }: { slug: string, postId: number }) {
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const { data: categories, isPending } = useQuery({
        queryFn: GetCategories,
        queryKey: ['categories', { type: 'form' }],
    });

    const { data: post } = useQuery({
        queryFn: async () => await GetPostByIdAndSlug(postId, slug),
        queryKey: ['post', postId, slug],
    });

    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: post ? {
            'thumbnail': post.thumbnail,
            'title': post.title,
            'content': post.content,
            'category': post.category?.slug || 'International',
            'tags': post.tags.map((tag: TypeGetAllTags[number]) => tag.name),
            'summary': post.summary || '',
            'published': post.published,
        } : {
            "thumbnail": "/ImagePlaceholder_50naaAnD0.png",
            "title": "",
            "content": "",
            "category": "",
            "tags": [],
            "summary": "",
            "published": false,
        },
    });

    useEffect(() => {
        if (post) {
            form.reset({
                title: post.title,
                tags: post.tags.map((tag: TypeGetAllTags[number]) => tag.name),
                content: post.content || '',
                summary: post.summary || '',
                category: post.category?.slug || 'International',
                thumbnail: post.thumbnail || '',
                published: post.published ?? false,
            });
        }
    }, [post, form]);

    const updatePostMutation = useMutation({
        mutationFn: UpdatePost,
        onSuccess: () => {
            form.reset();
            toast.success(`Successfully updated post`, { id: 'update-post' });
        },
        onError: (error) => {
            toast.error(`Failed to update post` + error, { id: 'update-post' });
        }
    })

    function onSubmit(values: z.infer<typeof createPostSchema>) {
        try {
            updatePostMutation.mutate({ id: postId, slug, formData: values });
            toast.loading(`Updating post...`, { id: 'update-post' });
        } catch (error) {
            toast.error("Form submission error" + error);
        };
    };

    const { isDirty, isSubmitting } = form.formState;
    const watchedFields = useWatch({
        control: form.control,
        name: ["title", "content", "summary", "thumbnail", "published", "category", "tags"]
    });
    const [title, content, summary, thumbnail, published, category, tags] = watchedFields;

    return (
        <>
            <CreateCategoryDialog
                open={showCategoryDialog}
                setOpen={setShowCategoryDialog}
            />

            <div className="w-screen md:w-[calc(100vw-280px)] flex flex-col lg:flex-row items-start gap-4 px-12">
                <Form {...form}>
                    <form
                        className="space-y-8 lg:max-w-[50%] mx-auto w-full"
                    >

                        {/* File Input */}
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pl-2">Thumbnail Image <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <FileUpload id="fileInput" setFilePath={field.onChange} setFiles={setFiles} files={files} />
                                    </FormControl>
                                    <FormDescription>Select a file to upload.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Title Input */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pl-2">Title <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter title here..."
                                            className="h-[50px]"
                                            type="text"
                                            {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Content Input */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pl-2">Content <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Start writing here..."
                                            className="resize-none min-h-[300px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Plain text or markdown</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category Input */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="pl-2">Category <span className="text-destructive">*</span></FormLabel>
                                    <div className="w-full flex items-center justify-between gap-2">
                                        {!isPending ? (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((category: TypeGetCategories[number]) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.slug}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="border border-separate rounded-md w-full h-full px-3 flex items-center gap-2 text-muted-foreground text-sm">
                                                <Loader2Icon size={14} className="animate-spin" />
                                                <span>Fetching Categories</span>
                                            </div>
                                        )}
                                        <Button
                                            type="button"
                                            variant={'outline'}
                                            className="flex items-center gap-1"
                                            onClick={() => setShowCategoryDialog(true)}
                                        >
                                            <PlusIcon />
                                            <span className="text-sm">Create</span>
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Summary Input */}
                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pl-2">Summary</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Start writing here (optional)..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Short description of your post (optional)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tags Input */}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="pl-2">Tags</FormLabel>
                                    <FormControl>
                                        <TagsInput
                                            value={field.value ?? []}
                                            onValueChange={field.onChange}
                                            placeholder="Enter your tags"
                                        />
                                    </FormControl>
                                    <FormDescription>Press enter after each tag</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex flex-1/3 items-center justify-start gap-4">
                            <Button
                                type="button"
                                variant={'outline'}
                                disabled={!isDirty || isSubmitting}
                                className="max-w-[calc(50%-8px)] w-full cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                    form.handleSubmit((values) => onSubmit({ ...values, published: false }))();
                                }}
                            >
                                {!updatePostMutation.isPending ? (
                                    <>
                                        <SaveIcon className="size-[18px]" />
                                        Update Draft
                                    </>
                                ) : (
                                    <>
                                        <Loader2Icon className="animate-spin size-[18px]" />
                                        Updating...
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                disabled={(!isDirty && published) || isSubmitting || updatePostMutation.isPending}
                                className="max-w-[calc(50%-8px)] w-full cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                    form.handleSubmit((values) => onSubmit({ ...values, published: true }))();
                                }}
                            >
                                {!updatePostMutation.isPending ? (
                                    <>
                                        <UploadCloud className="size-[18px]" />
                                        Publish Changes
                                    </>
                                ) : (
                                    <>
                                        <Loader2Icon className="animate-spin size-[18px]" />
                                        Updating...
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="lg:w-[50%] hidden md:flex flex-col items-start gap-4">
                    <h1 className="md:text-xl lg:text-2xl font-bold">
                        Preview
                    </h1>

                    <Image
                        className="aspect-video object-cover rounded-md"
                        src={thumbnail}
                        alt={title || 'Post thumbnail'}
                        width={560}
                        height={240}
                    />

                    <h2 className="sm:text-lg md:text-xl lg:text-2xl font-semibold text-left">
                        {title || "Your title will be shown here..."}
                    </h2>

                    <div className="rich-text-editor">
                        <Markdown>
                            {content || ""}
                        </Markdown>
                    </div>

                    <p className="text-sm text-muted-foreground font-normal">
                        {summary || 'Your summary or short description here...'}
                    </p>

                    <div className="w-full flex items-center gap-3 text-muted-foreground">
                        <h2 className="text-lg text-left text-primary font-bold">Status</h2>
                        {published ? (
                            <>
                                <Globe2Icon size={18} />
                                <h2 className="text-lg text-left font-semibold">Publish</h2>
                            </>
                        ) : (
                            <>
                                <SaveIcon size={18} />
                                <h2 className="text-lg text-left font-semibold">Draft</h2>
                            </>
                        )}
                    </div>

                    <div className="w-full flex items-start gap-6">
                        <h2 className="text-lg text-left font-bold">Category</h2>
                        <p className="text-lg font-normal text-muted-foreground">
                            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'}
                        </p>
                    </div>

                    <div className="w-full flex flex-col items-start gap-3">
                        <h2 className="text-lg text-left font-bold">Related Tags</h2>
                        <div className="flex items-center flex-1 flex-wrap text-muted-foreground gap-2">
                            {tags?.length ?
                                tags?.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant={'outline'}
                                        className="!p-6 !py-1 rounded-full !text-muted-foreground"
                                    >
                                        {tag}
                                    </Badge>
                                )) : ('tags will shown here...')
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};