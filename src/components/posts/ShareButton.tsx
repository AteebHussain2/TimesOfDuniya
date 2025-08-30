'use client';

import { Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: "ITLAA Article",
                url: window.location.href,
            });
            toast.info('Link Copied to Clipboard!', { id: 'toast-copy' });
        } catch (err) {
            console.log("Error sharing:", err)
        }
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast.info('Link Copied to Clipboard!', { id: 'toast-copy' });
    }
}

const ShareButton = () => {
    return (
        <Button
            variant={'default'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleShare}
        >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
        </Button>
    )
}

export default ShareButton
