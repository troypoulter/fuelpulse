"use client";

import { Home, Fuel, LineChart } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Dispatch, SetStateAction } from "react";

const routes = [
    {
        icon: Home,
        label: "Home",
        href: "/"
    },
    {
        icon: Fuel,
        label: "Find Fuel",
        href: "/search"
    },
    {
        icon: LineChart,
        label: "Analytics",
        href: "/analytics"
    }
]

interface SidebarRoutesProps {
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const SidebarRoutes = ({ setOpen }: SidebarRoutesProps) => {
    return (
        <div className="flex flex-col pt-[56px] gap-y-2 p-3 md:gap-y-0 md:pt-0 md:p-0 md:flex-row md:gap-x-2 w-full h-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                    setOpen={setOpen}
                />
            ))}
        </div>
    )
}