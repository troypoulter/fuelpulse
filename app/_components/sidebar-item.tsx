"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = (
    { icon: Icon, label, href }: SidebarItemProps
) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/}`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-primary text-sm pl-6 md:p-4 rounded-lg transition-all hover:bg-muted",
                isActive && "bg-muted font-medium"
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={22}
                    className={cn(
                        "text-primary",
                        isActive && "font-medium")}
                />
                {label}
            </div>
        </button>
    )
}