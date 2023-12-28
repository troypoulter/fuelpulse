"use client";

import { Layout, Fuel } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const routes = [
    {
        icon: Layout,
        label: "Home",
        href: "/"
    },
    {
        icon: Fuel,
        label: "Find Fuel",
        href: "/search"
    }
]

export const SidebarRoutes = () => {
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}