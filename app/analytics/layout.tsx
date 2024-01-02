import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Analytics",
    description: "You see what I see.",
}

interface AnalyticsLayoutProps {
    children: React.ReactNode
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
    return <>{children}</>
}
