import { Logo } from './logo';
import { MobileSidebar } from './mobile-sidebar';
import { SidebarRoutes } from './sidebar-routes';

export const Navbar = () => {
    return (
        <div className="h-full flex bg-white border-b shadow-sm">
            <div className="container relative flex p-4 gap-x-4 h-full items-center">
                <MobileSidebar />
                <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                    <Logo />
                </div>
                <div className='hidden md:flex gap-x-4 h-full flex-col inset-y-0'>
                    <SidebarRoutes />
                </div>
            </div>

        </div>
    )
}