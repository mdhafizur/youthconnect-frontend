import { useRef } from "react";
import * as L from "leaflet";
import haversine from "haversine-distance";
import { HomeAddress } from "../models/user.model";

export const useRouting = (
  mapRef: React.RefObject<L.Map>,
  showRouting: boolean,
  homeLocation: HomeAddress | null,
  destination: L.LatLngExpression | null
) => {
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  const initializeRoutingControl = () => {
    if (showRouting && homeLocation && destination) {
      const distanceInMeters = haversine(
        {
          lat: homeLocation.coordinates[0],
          lon: homeLocation.coordinates[1],
        },
        {
          lat: destination[0],
          lon: destination[1],
        }
      );

      if (mapRef.current) {
        if (routingControlRef.current) {
          mapRef.current.removeControl(routingControlRef.current);
        }
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(homeLocation.coordinates[0], homeLocation.coordinates[1]),
            L.latLng(destination[0], destination[1]),
          ],
          routeWhileDragging: true,
        }).addTo(mapRef.current);
      }
    }
  };

  return { routingControlRef, initializeRoutingControl };
};
