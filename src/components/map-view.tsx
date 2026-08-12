"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { PickupLocation } from "@prisma/client";

const pinIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 34px; height: 34px; border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: ${active ? "#55703a" : "#a4753f"};
      border: 3px solid #fdf8ee;
      box-shadow: 0 4px 10px rgba(60,44,28,0.35);
      display:flex; align-items:center; justify-content:center;
    "></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

function FlyToSelected({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

export function MapView({
  locations,
  selectedId,
  onSelect,
}: {
  locations: PickupLocation[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const center: [number, number] =
    locations.length > 0 ? [locations[0].lat, locations[0].lng] : [49.1951, 16.6068];

  const selected = locations.find((l) => l.id === selectedId);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full rounded-3xl"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={pinIcon(loc.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(loc.id) }}
        >
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            {loc.address}, {loc.city}
          </Popup>
        </Marker>
      ))}
      {selected && <FlyToSelected lat={selected.lat} lng={selected.lng} />}
    </MapContainer>
  );
}
