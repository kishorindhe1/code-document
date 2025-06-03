import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'

const Navbar = () => {
    return (
        <nav className="flex border  h-16 z-40 w-full px-4 items-center justify-end gap-3 data-[menu-open=true]:border-none sticky top-0 inset-x-0 backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-white/[.90] dark:bg-black/[.65]">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <ModeToggle />

        </nav>
    )
}

export default Navbar