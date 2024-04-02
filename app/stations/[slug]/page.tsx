import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { stations } from "@/lib/db/schema";
import { executeQueryWithSentry } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { MapPinned } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const parsedSlug = parseFloat(params.slug ?? "0");

  const stationQuery = db.query.stations.findFirst({
    where: eq(stations.id, parsedSlug),
    with: {
      prices: {
        // Trying to reduce the size returned as more prices are retrieved by ordering
        // by ID assuming the later prices are more recent and then limiting to 15.
        orderBy: (prices, { desc }) => [desc(prices.id)],
        limit: 10,
      },
    },
  });

  const station = await executeQueryWithSentry(stationQuery);

  const uniquePrices = station?.prices.reduce(
    (acc: { [key: string]: any }, price) => {
      if (
        !acc[price.fuelType] ||
        new Date(price.lastUpdatedUTC) >
          new Date(acc[price.fuelType].lastUpdatedUTC)
      ) {
        acc[price.fuelType] = price;
      }
      return acc;
    },
    {}
  );

  return {
    title: station ? station.name : "",
    description: station
      ? `Today's fuel prices for ${station.name}: ${
          uniquePrices
            ? Object.values(uniquePrices)
                .map((price) => `${price.fuelType}: ${price.price.toFixed(1)}`)
                .join(", ")
            : ""
        }`
      : "",
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const parsedSlug = parseFloat(params.slug ?? "0");

  const stationQuery = db.query.stations.findFirst({
    where: eq(stations.id, parsedSlug),
    with: {
      prices: {
        // Trying to reduce the size returned as more prices are retrieved by ordering
        // by ID assuming the later prices are more recent and then limiting to 15.
        orderBy: (prices, { desc }) => [desc(prices.id)],
        limit: 10,
      },
    },
  });

  const station = await executeQueryWithSentry(stationQuery);

  if (!station) {
    return (
      <div>
        <h1>Station {params.slug} not found</h1>
      </div>
    );
  }

  // TODO: Make reusable.
  const uniquePrices = station.prices.reduce(
    (acc: { [key: string]: any }, price) => {
      if (
        !acc[price.fuelType] ||
        new Date(price.lastUpdatedUTC) >
          new Date(acc[price.fuelType].lastUpdatedUTC)
      ) {
        acc[price.fuelType] = price;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col items-start bg-white p-6 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold tracking-tight">{station.name}</h1>
      <div className="flex flex-row mt-2 gap-x-2 items-center">
        <Button variant="default" size="sm" asChild>
          <a
            href={`https://maps.google.com/?saddr=Current+Location&daddr=${encodeURIComponent(
              station.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPinned className="mr-1 h-4 w-4" />
            Get Directions
          </a>
        </Button>
        <p className="text-base">{station.address}</p>
      </div>
      <div className="text-lg font-semibold mt-4 mb-2">
        Today&lsquo;s Fuel Prices
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fuel Type</TableHead>
            <TableHead>Per Litre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(uniquePrices).map((price) => (
            <TableRow key={price.fuelType}>
              <TableCell className="font-semibold">{price.fuelType}</TableCell>
              <TableCell>{price.price}c/L</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
