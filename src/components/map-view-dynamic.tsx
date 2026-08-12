"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const MapViewDynamic = dynamic(
  () => import("./map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-green-50 text-green-700">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ),
  }
);
