import { Logo } from './logo';
import { MobileSidebar } from './mobile-sidebar';

export const Navbar = () => {
    return (
        <div className="p-4 gap-x-4 h-full flex items-center bg-white border-b shadow-sm">
            <MobileSidebar />
            <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
                <Logo />
            </div>
        </div>
    )
}