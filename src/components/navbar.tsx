'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

const Navbar = () => {
    const { open, openMobile } = useSidebar()
    return (
        <nav className="flex border  h-16 z-40 w-full px-4 items-center justify-between gap-3 data-[menu-open=true]:border-none sticky top-0 inset-x-0 backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-white/[.90] dark:bg-black/[.65]">
            {!open || !openMobile ? <div className="text-center text-2xl font-bold py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">

                PinkBlue
            </div> : <div></div>}
            <div className='flex items-center gap-3'>

                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <ModeToggle />
                {/* <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:opacity-90 cursor-pointer"> */}
                <SidebarTrigger className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:opacity-90 cursor-pointer" />
                {/* </Button> */}


            </div>

        </nav >
    )
}

export default Navbar