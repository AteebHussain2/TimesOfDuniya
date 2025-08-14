'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from './providers/theme-providers';
import { LayoutProvider } from "./layout/layout-context";
import { ImageKitProvider } from '@imagekit/next';
import NextTopProvider from 'nextjs-toploader';
import { useState } from 'react';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient())
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (!urlEndpoint) {
        throw new Error('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined');
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                <NextTopProvider color='#ff3b3b' showSpinner={false} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <LayoutProvider>
                        {children}
                    </LayoutProvider>
                </ThemeProvider>
            </ImageKitProvider>
        </QueryClientProvider>
    );
};

export default AppProvider;