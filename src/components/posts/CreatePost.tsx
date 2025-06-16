'use client';

import { PlusIcon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link';

const CreatePost = () => {
    return (
        <Button
            variant={'outline'}
            className='rounded-full flex items-center gap-1 !px-4'
            asChild
        >
            <Link href={'/content/create'}>
                <PlusIcon />
                <span className='font-semibold pb-[2px]'>Create</span>
            </Link>
        </Button>
    )
}

export default CreatePost;