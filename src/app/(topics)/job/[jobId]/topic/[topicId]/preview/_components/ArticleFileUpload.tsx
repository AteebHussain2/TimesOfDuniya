'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { UpdateJobArticle } from '@/actions/dashboard/jobs/updateJobArticle';
import { CheckCircle, Loader2Icon, SaveIcon, Upload } from 'lucide-react';
import FileUpload from '@/components/image-kit/FileUpload';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Image } from '@imagekit/next';
import { useState } from 'react';
import { toast } from 'sonner';

const ArticleFileUpload = ({ id, thumbnail, published }: { id: number, thumbnail: string | null, published: boolean }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [filePath, setFilePath] = useState("");
    const [open, setOpen] = useState(false);

    const fileUploadMutation = useMutation({
        mutationFn: ({ id, filePath }: { id: number, filePath: string }) => UpdateJobArticle(id, filePath),
        onSuccess: () => {
            toast.success("Article saved successfully!", { id: "file-upload" });
            setFilePath("");
            setFiles([]);
            setOpen(false);
        },
        onError: (error) => {
            toast.error(`Error saving article: ${error}`, { id: "file-upload" });
        },
    });

    return (
        <>
            {thumbnail ? (
                <>
                    <Image
                        className="aspect-video object-cover rounded-sm"
                        src={thumbnail}
                        alt={'Article Thumbnail'}
                        width={1920}
                        height={1080}
                    />

                    {!published && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
                                    <Upload className="mr-2 size-4" />
                                    Change Image
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Article</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <FileUpload
                                        id="fileInput"
                                        setFilePath={setFilePath}
                                        setFiles={setFiles}
                                        files={files}
                                    />
                                    <Button
                                        disabled={fileUploadMutation.isPending || !filePath}
                                        type="button"
                                        variant={'outline'}
                                        onClick={() => {
                                            toast.loading("Saving article ...", { id: "file-upload" });
                                            fileUploadMutation.mutate({ id, filePath });
                                        }}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        {!fileUploadMutation.isPending && !fileUploadMutation.isSuccess ? (
                                            <>
                                                <SaveIcon className="size-[18px]" />
                                                <p>Save Article</p>
                                            </>
                                        ) : fileUploadMutation.isSuccess ? (
                                            <>
                                                <CheckCircle className="text-green-600 size-[18px]" />
                                                <p>Saved Article</p>
                                            </>
                                        ) : (
                                            <>
                                                <Loader2Icon className="animate-spin size-[18px]" />
                                                <p>Saving...</p>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    <FileUpload id="fileInput" setFilePath={setFilePath} setFiles={setFiles} files={files} />
                    <Button
                        disabled={fileUploadMutation.isPending || !filePath}
                        type="button"
                        variant={'outline'}
                        onClick={() => {
                            toast.loading("Saving article...", { id: "file-upload" });
                            fileUploadMutation.mutate({ id, filePath });
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {!fileUploadMutation.isPending && !fileUploadMutation.isSuccess ? (
                            <>
                                <SaveIcon className="size-[18px]" />
                                <p>Save Article</p>
                            </>
                        ) : fileUploadMutation.isSuccess ? (
                            <>
                                <CheckCircle className="text-green-600 size-[18px]" />
                                <p>Saved Article</p>
                            </>
                        ) : (
                            <>
                                <Loader2Icon className="animate-spin size-[18px]" />
                                <p>Saving...</p>
                            </>
                        )}
                    </Button>
                </div>
            )}
        </>
    )
}

export default ArticleFileUpload;


export const ArticleUploadImageButton = ({ id, thumbnail, published }: { id: number, thumbnail: string | null, published: boolean }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [filePath, setFilePath] = useState("");
    const [open, setOpen] = useState(false);

    const fileUploadMutation = useMutation({
        mutationFn: ({ id, filePath }: { id: number, filePath: string }) => UpdateJobArticle(id, filePath),
        onSuccess: () => {
            toast.success("Article saved successfully!", { id: "file-upload" });
            setFilePath("");
            setFiles([]);
            setOpen(false);
        },
        onError: (error) => {
            toast.error(`Error saving article: ${error}`, { id: "file-upload" });
        },
    });

    return (
        <>
            {thumbnail ? !published && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="w-[150px] flex items-center justify-center gap-2">
                            <Upload className="mr-2 size-4" />
                            Change Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Article Image</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <FileUpload
                                id="fileInput"
                                setFilePath={setFilePath}
                                setFiles={setFiles}
                                files={files}
                            />
                            <Button
                                disabled={fileUploadMutation.isPending || !filePath}
                                type="button"
                                variant={'outline'}
                                onClick={() => {
                                    toast.loading("Saving article ...", { id: "file-upload" });
                                    fileUploadMutation.mutate({ id, filePath });
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {!fileUploadMutation.isPending && !fileUploadMutation.isSuccess ? (
                                    <>
                                        <SaveIcon className="size-[18px]" />
                                        <p>Save Article</p>
                                    </>
                                ) : fileUploadMutation.isSuccess ? (
                                    <>
                                        <CheckCircle className="text-green-600 size-[18px]" />
                                        <p>Saved Article</p>
                                    </>
                                ) : (
                                    <>
                                        <Loader2Icon className="animate-spin size-[18px]" />
                                        <p>Saving...</p>
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="w-[150px] flex items-center justify-center gap-2">
                            <Upload className="mr-2 size-4" />
                            Upload Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Article Image</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <FileUpload
                                id="fileInput"
                                setFilePath={setFilePath}
                                setFiles={setFiles}
                                files={files}
                            />
                            <Button
                                disabled={fileUploadMutation.isPending || !filePath}
                                type="button"
                                variant={'outline'}
                                onClick={() => {
                                    toast.loading("Saving article ...", { id: "file-upload" });
                                    fileUploadMutation.mutate({ id, filePath });
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {!fileUploadMutation.isPending && !fileUploadMutation.isSuccess ? (
                                    <>
                                        <SaveIcon className="size-[18px]" />
                                        <p>Save Article</p>
                                    </>
                                ) : fileUploadMutation.isSuccess ? (
                                    <>
                                        <CheckCircle className="text-green-600 size-[18px]" />
                                        <p>Saved Article</p>
                                    </>
                                ) : (
                                    <>
                                        <Loader2Icon className="animate-spin size-[18px]" />
                                        <p>Saving...</p>
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
