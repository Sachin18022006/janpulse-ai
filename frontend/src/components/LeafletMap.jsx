import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';
import { MapPin, ThumbsUp, ArrowRight } from 'lucide-react';

// Custom colored SVG pin markers based on severity
const createCustomIcon = (severity = 5) => {
  let color = '#356B52'; // Low: Forest green
  let border = '#234736';

  if (severity >= 9) {
    color = '#D63031'; // Critical: Red
    border = '#8E0000';
  } else if (severity >= 7) {
    color = '#D66A45'; // High: Terracotta
    border = '#9B3F21';
  } else if (severity >= 4) {
    color = '#E5B84B'; // Medium: Mustard
    border = '#A4781A';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.16 0 0 7.16 0 16c0 11.2 16 28 16 28s16-16.8 16-28c0-8.84-7.16-16-16-16z" fill="${color}" stroke="${border}" stroke-width="1.5" filter="url(#shadow)"/>
      <circle cx="16" cy="16" r="8" fill="#FFFFFF"/>
      <text x="16" y="20" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="${color}">${severity}</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -40],
  });
};

// Selection pin icon for report issue mode
const selectionIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="36" height="48">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 11.2 16 28 16 28s16-16.8 16-28c0-8.84-7.16-16-16-16z" fill="#D66A45" stroke="#282B27" stroke-width="2"/>
      <circle cx="16" cy="16" r="7" fill="#F8F6F0"/>
      <circle cx="16" cy="16" r="3" fill="#D66A45"/>
    </svg>
  `,
  className: 'custom-selection-marker animate-bounce',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -42],
});

// Component to handle map clicks for selecting coordinates
const LocationSelector = ({ onSelectLocation, selectedPos }) => {
  useMapEvents({
    click(e) {
      if (onSelectLocation) {
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return selectedPos ? <Marker position={selectedPos} icon={selectionIcon} /> : null;
};

// Map center controller
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

export const LeafletMap = ({
  complaints = [],
  center = [12.9716, 77.5946], // Bengaluru center
  zoom = 12,
  interactivePicker = false,
  selectedPosition = null,
  onSelectPosition = null,
  height = '500px',
}) => {
  return (
    <div style={{ height, width: '100%' }} className="rounded-2xl overflow-hidden border border-[#D5DFD1] shadow-warm relative z-10">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location Picker Mode */}
        {interactivePicker && (
          <LocationSelector
            onSelectLocation={onSelectPosition}
            selectedPos={selectedPosition}
          />
        )}

        {/* Markers for complaint collection */}
        {!interactivePicker &&
          complaints.map((item) => {
            const coords = item.location?.coordinates;
            if (!coords || coords.length < 2) return null;
            const lat = coords[1];
            const lon = coords[0];

            return (
              <Marker
                key={item._id || item.complaintId}
                position={[lat, lon]}
                icon={createCustomIcon(item.severity)}
              >
                <Popup className="janpulse-popup">
                  <div className="p-1 space-y-2 max-w-[240px]">
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-charcoal-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400';
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-charcoal-500">
                        #{item.complaintId}
                      </span>
                      <SeverityBadge severity={item.severity} size="sm" showText={false} />
                    </div>

                    <h4 className="font-bold text-xs text-charcoal-900 line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-charcoal-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[#E9EFE7] text-[11px]">
                      <span className="flex items-center space-x-1 text-terracotta font-semibold">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{item.upvotesCount || 0}</span>
                      </span>

                      <Link
                        to={`/complaints/${item._id}`}
                        className="font-bold text-forest hover:text-forest-700 flex items-center space-x-0.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
