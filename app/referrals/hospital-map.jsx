"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function HospitalMap({ onSelectHospital }) {
  const hospitals = [
    {
      id: 1,
      name: "Government District Hospital",
      type: "Government",
      lat: 17.385,
      lng: 78.486,
      distance: 3.2,
      address: "1-2-345, Main Road, Hyderabad",
      phone: "040-12345678",
    },
    {
      id: 2,
      name: "Mother & Child Care Center",
      type: "Private",
      lat: 17.395,
      lng: 78.496,
      distance: 5.7,
      address: "5-6-789, Hospital Road, Hyderabad",
      phone: "040-87654321",
    },
    {
      id: 3,
      name: "Rural Primary Health Center",
      type: "Government",
      lat: 17.375,
      lng: 78.476,
      distance: 2.1,
      address: "9-8-765, Village Road, Hyderabad",
      phone: "040-23456789",
    },
  ];

  const handleSendSOS = () => {
    toast({
      title: "SOS Sent",
      description: "Emergency services have been notified. An ambulance is on the way.",
      variant: "destructive",
    });
  };

  // Fix Leaflet icon issue
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="relative h-full">
      <MapContainer
        center={[17.385, 78.486]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.lat, hospital.lng]}
            eventHandlers={{
              click: () => {
                onSelectHospital(hospital);
              },
            }}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              {hospital.address}
              <br />
              {hospital.phone}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        className="absolute bottom-4 right-4 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium text-sm"
        onClick={handleSendSOS}
      >
        Send SOS for Ambulance
      </button>
    </div>
  );
}
