"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, LocateFixed } from "lucide-react";
import { useState } from 'react';
import { fuelTypes } from "@/lib/constants";

export const SearchInputs = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState<string | undefined>(undefined);
    const [longitude, setLongitude] = useState<string | undefined>(undefined);
    const [fuelType, setFuelType] = useState("E10");
    const [radius, setRadius] = useState([10]);

    const setGeolocationInURL = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
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
        const updateURLQueryParams = () => {
            const params = new URLSearchParams(searchParams);

            if (latitude && longitude) {
                params.set('lat', latitude);
                params.set('long', longitude);
            }

            if (fuelType) {
                params.set('fuelType', fuelType);
            }

            if (radius && radius.length > 0) {
                params.set('radius', (radius[0] ?? 10).toString());
            }

            router.push(`${pathname}?${params.toString()}`);
        }

        updateURLQueryParams();
    }, [fuelType, radius, latitude, longitude, pathname, router, searchParams]);

    useEffect(() => {
        if (!searchParams.has('lat') && !searchParams.has('long')) {
            setGeolocationInURL();
        }

        if (searchParams.has('fuelType')) {
            setFuelType(searchParams.get('fuelType')!);
        }

        if (searchParams.has('radius')) {
            setRadius([Number(searchParams.get('radius')!)]);
        }
    }, [searchParams]);

    // TODO: Move each input into its own component, maybe.
    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Button disabled={loading} variant="outline" onClick={() => setGeolocationInURL()}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />} Use my location
            </Button>
            <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select a fuel type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fuel Types</SelectLabel>
                        {fuelTypes.map((fuelType) => (
                            <SelectItem key={fuelType.code} value={fuelType.code}>{fuelType.name} ({fuelType.code})</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="grid gap-2 w-[160px]">
                <div className="flex items-center justify-between">
                    <Label htmlFor="radius">Radius</Label>
                    <span className="px-2 py-0.5 text-right text-sm text-muted-foreground">
                        {radius}km
                    </span>
                </div>
                <Slider defaultValue={radius} onValueChange={setRadius} max={50} min={2} step={2} aria-label="radius" />
            </div>
        </div>
    )
}