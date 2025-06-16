'use client';


import CreateCategoryDialog from '@/components/category/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const CategoriesHeader = () => {
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);

    return (
        <>
            <CreateCategoryDialog
                open={showCategoryDialog}
                setOpen={setShowCategoryDialog}
            />

            <div className='w-full flex items-center justify-between gap-4 px-6 py-4 border-b border-separate'>
                <h1 className="text-3xl text-primary font-semibold px-6">
                    Manage Categories
                </h1>

                <Button
                    type="button"
                    variant={'outline'}
                    className="flex items-center justify-center gap-1"
                    onClick={() => setShowCategoryDialog(true)}
                >
                    <PlusIcon size={20} />
                    <span className="pb-[2px]">Category</span>
                </Button>
            </div>
        </>
    )
}

export default CategoriesHeader;
