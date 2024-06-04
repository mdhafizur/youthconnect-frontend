import { useMapEvents } from 'react-leaflet';

const MapEvents = ({
  onMapClick,
}: {
  onMapClick: Function;
}) => {
  useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default MapEvents;
