'use client';

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { CheckCircle, CloudUpload, Loader2Icon, Paperclip, Trash2Icon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
    id?: string;
    setFilePath: (filePath: string) => void;
    setFiles: (files: File[]) => void;
    files: File[];
}

const FileUpload = ({ setFilePath, files, setFiles }: Props) => {
    const [uploaded, setUploaded] = useState(false)
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */
    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });

            // Saving file path for zod form
            if (uploadResponse.filePath) {
                setFilePath(uploadResponse.filePath)
                toast.success("File uploaded successfully!");
                setUploaded(true)
            };

        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    };

    const handleChange = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }
        setFiles(Array.from(fileInput.files));
    }

    return (
        <>
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                className="hidden"
                onChange={handleChange}
            />

            {!files || files.length === 0 ? (
                // <div>No files selected</div>
                <div
                    className="outline-dashed outline-1 outline-slate-500 relative bg-background rounded-lg p-2"
                    onClick={() => {
                        fileInputRef.current?.click();
                    }}
                >
                    <div className="flex items-center justify-center flex-col p-8 w-full h-[240px] cursor-pointer">
                        <CloudUpload className='text-gray-500 w-10 h-10' />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or WEBP
                        </p>
                    </div>
                </div>
            ) : (
                <div>
                    {files.length > 0 &&
                        files.map((file, i) => (
                            <Card key={i}>
                                <CardHeader className="group flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Paperclip className="size-[14px] stroke-primary" />
                                        <span className="text-muted-foreground text-sm">{file.name}</span>
                                    </CardTitle>

                                    <Button
                                        variant={'ghost'}
                                        className="flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            setFiles(files.filter((f) => f.name !== file.name));
                                            setProgress(0);
                                            setUploaded(false);
                                        }}
                                    >
                                        <Trash2Icon className="stroke-destructive" />
                                    </Button>
                                </CardHeader>

                                <CardContent>
                                    <Image
                                        className="aspect-video rounded-md"
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        height={280}
                                        width={540}
                                    />
                                </CardContent>

                                <CardFooter className="flex flex-col gap-2">
                                    <span className="w-full flex gap-2 justify-between">
                                        <span className="flex items-center gap-2">
                                            <CloudUpload className="stroke-muted-foreground size-[18px]" />
                                            <p className="text-sm text-muted-foreground">Upload progress:</p>
                                        </span>
                                        <Button
                                            className="text-sm text-muted-foreground"
                                            variant={'outline'}
                                            size={'sm'}
                                        >
                                            {progress} %
                                        </Button>
                                    </span>
                                    <progress
                                        value={progress}
                                        max={100}
                                        className="w-full h-[8px] rounded-sm bg-secondary"
                                    />
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div >
            )}

            <Button
                disabled={progress === 100 || uploaded}
                type="button"
                variant={'outline'}
                onClick={handleUpload}
                className="flex items-center gap-2 cursor-pointer"
            >
                {progress !== 100 && !uploaded ? (
                    <>
                        <CloudUpload className="size-[18px]" />
                        <p>Uploaded file</p>
                    </>
                ) : progress === 100 && uploaded ? (
                    <>
                        <CheckCircle className="text-green-600 size-[18px]" />
                        <p>Upload file</p>
                    </>
                ) : (
                    <>
                        <Loader2Icon className="animate-spin size-[18px]" />
                        <p>Loading...</p>
                    </>
                )}
            </Button>
        </>
    );
};

export default FileUpload;