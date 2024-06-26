"use client";

import { cn } from "@/lib/utils";
import { set } from "date-fns";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  setOpen,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`) ||
    (href === "/search" && pathname?.startsWith(`/stations/`));

  const onClick = () => {
    router.push(href);
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm pl-6 md:p-4 rounded-lg transition-all hover:bg-muted",
        isActive && "bg-muted font-medium text-primary"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "font-medium text-primary"
          )}
        />
        {label}
      </div>
    </button>
  );
};
