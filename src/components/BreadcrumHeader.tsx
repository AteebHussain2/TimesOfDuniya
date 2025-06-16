'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { MobileSidebar } from './Sidebar'
import React from 'react'
import Logo from './Logo'

const BreadcrumbHeader = () => {
    const pathName = usePathname()
    const paths = pathName === "/" ? [""] : pathName.split("/")
    return (
        <div className='flex items-center flex-start gap-8'>
            <span className='flex items-center gap-1'>
                <MobileSidebar />
                <Logo title="Studio" fontSize="text-2xl font-bold" iconSize={16} />
            </span>
            <Breadcrumb className='hidden'>
                <BreadcrumbList>
                    {paths.map((path, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink className='capitalize' href={`/${path}`}>
                                    {path === "" ? "Home" : path}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index + 1 !== paths.length && <BreadcrumbSeparator className='size-[12px]' />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default BreadcrumbHeader
