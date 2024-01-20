"use client"

import Iframe from "react-iframe"

export default function AnalyticsPage() {
    return (
        <section className="container grid items-center py-2">
            <div className="flex flex-col items-start gap-2">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                    You see what I see.
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">
                    Transparency is a core principle which I highly prioritise. Visit the{" "}
                    <a
                        href="https://www.troypoulter.com/analytics/"
                        className="font-medium text-primary underline underline-offset-4"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Analytics
                    </a>{" "}
                    page on my website to learn more.
                </p>
            </div>
            <Iframe
                url="https://plausible.io/share/fuelpulse.troypoulter.com?auth=T-fgU_neEo-PRSSDsWtRh&embed=true&theme=light&background=transparent"
                width="100%"
                height="1800px"
                id="plausible-embed"
                display="block"
                position="relative"
                frameBorder={0}
                loading="lazy"
                styles={{ colorScheme: "normal" }}
            />
        </section>
    )
}
