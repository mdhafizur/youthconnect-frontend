import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import axios from "axios";
import { LatLngExpression, Icon, MarkerOptions } from "leaflet";

import {
  emptyHeartIcon,
  fullHeartIcon,
  homeSmallIcon,
} from "../../utils/CustomIcons";
import LoadingSpinner from "../LoadingSpinner";

interface LocationDetails {
  name: string;
  display_name: string;
  type: string;
  class: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
}

interface MarkerWithPopupProps {
  position: LatLngExpression;
  icon: Icon;
  popupContent: React.ReactNode;
  onMarkAsFavoriteClick?: (item: any) => void;
  onMarkAsHomeClick?: (item: any) => void;
  isMarkedFavorite?: boolean;
  item?: any;
  markerOptions?: MarkerOptions;
  onMarkerClick?: () => void;
}

const MarkerWithPopup: React.FC<MarkerWithPopupProps> = ({
  position,
  icon,
  popupContent,
  onMarkAsFavoriteClick,
  onMarkAsHomeClick,
  isMarkedFavorite,
  item,
  markerOptions,
  onMarkerClick,
}) => {
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(false); // State to track loading status

  const openPopupWithDetails = async () => {
    setLoading(true); // Set loading to true when fetching details
    const { coordinates } = item.geometry;
    const lat = coordinates[1];
    const lon = coordinates[0];
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    setLocationDetails(response.data);
    setLoading(false); // Set loading to false when details are fetched
  };

  return (
    <Marker
      position={position}
      icon={icon}
      {...markerOptions}
      eventHandlers={{
        click: () => {
          if (onMarkerClick) onMarkerClick();
        },
      }}
    >
      <Popup keepInView={true}>
        {popupContent}

        {locationDetails && (
          <div className="space-y-2">
            <strong>More details from Nominatim:</strong>
            <p>
              <strong>Name:</strong>{" "}
              {locationDetails.name !== ""
                ? locationDetails.name
                : locationDetails.display_name}
            </p>
            <p>
              <strong>Type:</strong> {locationDetails.type}
            </p>
            <p>
              <strong>Class:</strong> {locationDetails.class}
            </p>
            <p>
              <strong>Latitude:</strong> {locationDetails.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {locationDetails.lon}
            </p>
            <p>
              <strong>Address:</strong> {locationDetails.display_name}
            </p>
          </div>
        )}

        <br />

        {onMarkAsFavoriteClick && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onMarkAsFavoriteClick(item)}
              className={`heart-icon ${
                isMarkedFavorite ? "text-red-500" : "text-black"
              }`}
            >
              {isMarkedFavorite ? (
                <div dangerouslySetInnerHTML={{ __html: fullHeartIcon }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: emptyHeartIcon }} />
              )}
            </button>
            {!locationDetails && (
              <button
                onClick={openPopupWithDetails} // Call the function to open popup with details
                className="bg-blue-500 text-white px-4 py-2 rounded-md relative" // Added relative class for positioning spinner
              >
                More
                {loading && <LoadingSpinner />}{" "}
              </button>
            )}
          </div>
        )}

        {onMarkAsHomeClick && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onMarkAsHomeClick(item)}
              className="p-2 md:p-3 hover:bg-gray-200 rounded transition duration-300 ease-in-out"
            >
              <div dangerouslySetInnerHTML={{ __html: homeSmallIcon }} />
            </button>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default MarkerWithPopup;
