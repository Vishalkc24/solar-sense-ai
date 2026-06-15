import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude }) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Installation Location</h3>
      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '200px' }}>
        <MapContainer
          center={position}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <MapUpdater center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <strong className="text-emerald-600">Solar Installation</strong>
                <br />
                <span className="text-gray-600 text-xs">
                  {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-gray-500 text-xs">
        <span>{latitude.toFixed(4)}°N</span>
        <span className="text-gray-300">|</span>
        <span>{longitude.toFixed(4)}°E</span>
      </div>
    </div>
  );
};

export default LocationMap;
