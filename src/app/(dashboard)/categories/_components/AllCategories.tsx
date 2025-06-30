"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteCategory } from "@/actions/dashboard/category/deleteCategory";
import { UpdateCategory } from "@/actions/dashboard/category/updateCategory";
import { EditIcon, TrashIcon, FolderOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TypeGetCategoriesWithPosts } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
    categories: TypeGetCategoriesWithPosts
    viewMode?: "table" | "grid"
}

const AllCategories = ({ categories, viewMode = "table" }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<TypeGetCategoriesWithPosts[number]>()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    if (viewMode === "grid") {
        return (
            <>
                <CategoryDeleteDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} category={selectedCategory} />

                <CategoryEditDialog open={showEditDialog} setOpen={setShowEditDialog} category={selectedCategory} />

                <div className="px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Card key={category.id} className="group hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <FolderOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/content?category=${category.slug}`}
                                                    target="_blank"
                                                    className="font-semibold hover:underline"
                                                >
                                                    {category.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">/{category.slug}</p>
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCategory(category)
                                                    setShowEditDialog(true)
                                                }}
                                            >
                                                <EditIcon size={16} className="text-primary" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCategory(category)
                                                    setShowDeleteDialog(true)
                                                }}
                                            >
                                                <TrashIcon size={16} className="text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {category.description || "No description available."}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{category.posts.length} posts</span>
                                        </div>

                                        <Badge variant={category.posts.length > 0 ? "default" : "secondary"} className="text-xs">
                                            {category.posts.length > 0 ? "Active" : "Empty"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <CategoryDeleteDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} category={selectedCategory} />

            <CategoryEditDialog open={showEditDialog} setOpen={setShowEditDialog} category={selectedCategory} />

            <div className="w-full border-t border-separate">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20px] !text-sm !text-muted-foreground">Sr.</TableHead>
                            <TableHead className="!text-sm !text-muted-foreground">Category</TableHead>
                            <TableHead className="w-[128px] text-left !text-sm !text-muted-foreground">Slug</TableHead>
                            <TableHead className="w-[64px] text-left !text-sm !text-muted-foreground">Posts</TableHead>
                            <TableHead className="w-[80px] text-left !text-sm !text-muted-foreground">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow key={category.id} className="group h-[82px]">
                                <TableCell className="border-r border-separate text-muted-foreground">{index + 1}.</TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                                        <span className="flex flex-col items-start gap-2 w-full">
                                            <Link
                                                className="text-md font-semibold truncate hover:underline"
                                                href={`/content?category=${category.slug}`}
                                                target="_blank"
                                            >
                                                {category.name}
                                            </Link>

                                            <p className="text-sm text-muted-foreground truncate transition-all">
                                                {category?.description || "No description available."}
                                            </p>
                                        </span>

                                        <div className="hidden group-hover:flex items-center gap-2 transition-all pt-[4px]">
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                onClick={() => {
                                                    setSelectedCategory(category)
                                                    setShowEditDialog(true)
                                                }}
                                            >
                                                <EditIcon size={16} className="size-[16px] stroke-primary" />
                                            </Button>

                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                onClick={() => {
                                                    setSelectedCategory(category)
                                                    setShowDeleteDialog(true)
                                                }}
                                            >
                                                <TrashIcon size={16} className="size-[16px] stroke-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{category.posts.length}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant={category.posts.length > 0 ? "default" : "secondary"} className="text-xs">
                                        {category.posts.length > 0 ? "Active" : "Empty"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default AllCategories;

interface DeleteProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    category?: TypeGetCategoriesWithPosts[number],
}

const CategoryDeleteDialog = ({ open, setOpen, category }: DeleteProps) => {
    const [text, setText] = useState('');

    const DeleteCategoryMutation = useMutation({
        mutationFn: ({ slug, id }: { slug: string, id: number }) => DeleteCategory(slug, id),
        onSuccess: () => {
            toast.success(`Category successfully deleted!`, { id: 'update-category' });
            setText('');
        },
        onError: (error) => {
            toast.error(`${error}`, { id: 'update-category' });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. This will delete
                        &nbsp;
                        <span className="text-destructive font-semibold">{category?.name}</span>
                        &nbsp;
                        and
                        &nbsp;
                        <span className="text-destructive font-semibold">{category?.posts.length} posts</span>
                        &nbsp;
                        permanently.
                        <span className="flex flex-col py-4 gap-2">
                            <span>
                                If you&apos;re sure, Enter category <b>{category?.slug}</b> below:
                            </span>

                            <Input
                                type='name'
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
                        disabled={text !== category?.slug || DeleteCategoryMutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/80 cursor-pointer"
                        onClick={() => {
                            if (!category?.slug || !category?.id) {
                                toast.error(`Category data is missing`, { id: 'update-category' });
                                return;
                            };
                            toast.loading(`Deleting category...`, { id: 'update-category' });
                            DeleteCategoryMutation.mutate({ slug: category?.slug, id: category?.id });
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const CategoryEditDialog = ({ open, setOpen, category }: DeleteProps) => {
    const [desc, setDesc] = useState(category?.description || '');
    const [name, setName] = useState(category?.name || '');

    const UpdateCategoryMutation = useMutation({
        mutationFn: ({ slug, id, name, desc }: { slug: string, id: number, name: string, desc?: string }) => UpdateCategory(slug, id, name, desc),
        onSuccess: () => {
            toast.success(`Category successfully updated!`, { id: 'update-category' });
            setName('');
            setDesc('');
        },
        onError: (error) => {
            toast.error(`${error}`, { id: 'update-category' });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This may change the category name and slug.
                        <span className="flex flex-col py-4 gap-2">
                            <span>
                                If you&apos;re sure, Enter name below:
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
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setName(''); setDesc('') }}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!name || UpdateCategoryMutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                            if (!category?.slug || !category?.id) {
                                toast.error(`Category data is missing`, { id: 'update-category' });
                                return;
                            };
                            toast.loading(`Updating category...`, { id: 'update-category' });
                            UpdateCategoryMutation.mutate({ slug: category?.slug, id: category?.id, name });
                        }}
                    >
                        Update
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};