import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Fit({ live, ghost }) {
  const map = useMap();
  useEffect(() => {
    const pts = [...(live || []), ...(ghost || [])];
    if (pts.length < 2) {
      if (pts[0]) map.setView(pts[0], 16);
      return;
    }
    try {
      map.fitBounds(pts, { padding: [28, 28], maxZoom: 17 });
    } catch {
      /* ignore */
    }
  }, [map, live, ghost]);
  return null;
}

export default function NeonMap({
  live = [],
  ghost = [],
  drops = [],
  center,
  className = 'h-full w-full',
  zoom = 14,
}) {
  const last = live[live.length - 1];
  const c = center || last || ghost[ghost.length - 1] || [43.6532, -79.3832];

  return (
    <div className={className}>
      <MapContainer
        center={c}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: '#080A09' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM &copy; CARTO'
        />
        {ghost?.length > 1 && (
          <Polyline
            positions={ghost}
            pathOptions={{
              color: '#8B5CF6',
              weight: 5,
              opacity: 0.45,
              dashArray: '10 10',
            }}
          />
        )}
        {live?.length > 1 && (
          <Polyline
            positions={live}
            pathOptions={{
              color: '#22E06A',
              weight: 14,
              opacity: 0.22,
            }}
          />
        )}
        {live?.length > 1 && (
          <Polyline
            positions={live}
            pathOptions={{
              color: '#22E06A',
              weight: 6,
              opacity: 0.95,
            }}
          />
        )}
        {last && (
          <CircleMarker
            center={last}
            radius={8}
            pathOptions={{ color: '#38BDF8', fillColor: '#22E06A', fillOpacity: 1, weight: 2 }}
          />
        )}
        {drops.map((d) => (
          <CircleMarker
            key={d.id}
            center={[d.lat, d.lng]}
            radius={7}
            pathOptions={{ color: '#38BDF8', fillColor: '#8B5CF6', fillOpacity: 0.9, weight: 2 }}
          />
        ))}
        <Fit live={live} ghost={ghost} />
      </MapContainer>
    </div>
  );
}
