"use client";

import { Layout, Search } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const routes = [
    {
        icon: Layout,
        label: "Home",
        href: "/"
    },
    {
        icon: Search,
        label: "Search",
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