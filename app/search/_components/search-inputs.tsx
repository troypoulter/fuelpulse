"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LocateFixed } from "lucide-react";
import { useState } from 'react';

export const SearchInputs = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [loading, setLoading] = useState(false);

    const setGeolocationInURL = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const params = new URLSearchParams(searchParams);
                params.set('lat', latitude.toString());
                params.set('long', longitude.toString());
                router.push(`${pathname}?${params.toString()}`);
                setLoading(false);
            }, (error) => {
                console.log(error);
                setLoading(false);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchParams.get('useLocation') === 'true' && !searchParams.has('lat') && !searchParams.has('long')) {
            setGeolocationInURL();
        }
    }, []);

    return (
        <div className="flex items-center justify-center">
            <Button disabled={loading} variant="outline" onClick={() => setGeolocationInURL()}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />} Use my location
            </Button>
        </div>
    )
}