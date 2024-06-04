import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { useAuth } from "../../context/AuthContext";
import { useMapData } from "../../hooks/useMapData.hook";
import { FavoriteFacility, HomeAddress } from "../../models/user.model";
import "../../styles/maps.css";

import MarkerWithPopup from "./MarkerWithPopup";
import MarkerPopupContent from "./popups/MarkerPopupContent";
import FavoriteLocationPopupContent from "./popups/FavoriteLocationPopupContent";
import {
  homeMarkerIcon,
  favoriteMarkerIcon,
  createCustomIcon,
} from "../../utils/CustomIcons";
import { setupGeoSearch } from "../../utils/geoSearchSetup";
import { useRouting } from "../../hooks/routingHooks";
import MarkAsFavoriteClickHandler from "../../handlers/handleMarkAsFavoriteClick";

import toast from "react-hot-toast";
import { updateUserData } from "../../services/user.service";

interface MapComponentProps {
  selectedCategories: string[];
  categoryColors: { [key: string]: string };
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedCategories,
  categoryColors,
}) => {
  const { user, setUser } = useAuth();
  const mapData = useMapData(selectedCategories);

  const [homeLocation, setHomeLocation] = useState<HomeAddress | null>(
    user?.homeAddress || null
  );
  const [favoriteFacility, setFavoriteFacility] =
    useState<FavoriteFacility | null>(user?.favoriteFacility || null);
  const [destination, setDestination] = useState<L.LatLngExpression | null>(
    null
  );

  const [showRouting, setShowRouting] = useState<boolean>(false);

  const mapRef = useRef<L.Map | null>(null);

  const { routingControlRef, initializeRoutingControl } = useRouting(
    mapRef,
    showRouting,
    homeLocation,
    destination
  );

  const handleHomeMark = async (address: HomeAddress) => {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = { ...user, homeAddress: address };

      await toast
        .promise(updateUserData(updatedUser), {
          loading: "Updating user...",
          success: "Marked as Home 🏠",
          error: "Failed to update user",
        })
        .then((userData) => {
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          setHomeLocation(userData.homeAddress);
        })
        .catch((error) => {
          console.error("updateUser failed:", error);
        });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  useEffect(() => {
    if (favoriteFacility) {
      setDestination([
        favoriteFacility.geometry.coordinates[1],
        favoriteFacility.geometry.coordinates[0],
      ]);
    }
    L.Marker.prototype.options.icon = createCustomIcon("#ff0000"); // default icon color
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        setupGeoSearch(mapRef.current, handleHomeMark);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (showRouting) {
      initializeRoutingControl();
    } else if (routingControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  }, [showRouting, homeLocation, destination]);

  return (
    <>
      <label className="flex items-center space-x-3 mb-4 text-white">
        <input
          type="checkbox"
          checked={showRouting}
          onChange={() => setShowRouting((prev) => !prev)}
          className="form-checkbox h-5 w-5 text-indigo-500 focus:ring-indigo-500"
        />
        <span className="text-lg">Show Routing</span>
      </label>

      <MapContainer
        center={[50.8278, 12.9214]}
        zoom={12}
        className="map-container rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {homeLocation && (
          <MarkerWithPopup
            position={[
              homeLocation.coordinates[0],
              homeLocation.coordinates[1],
            ]}
            icon={homeMarkerIcon}
            markerOptions={{ riseOnHover: true, riseOffset: 1000 }}
            popupContent={
              <div className="text-left">
                <strong>Home</strong>
                <p className="mt-2">
                  <strong>Name:</strong> {homeLocation.name}
                </p>
              </div>
            }
          />
        )}

        {favoriteFacility?.geometry &&
          favoriteFacility?.category &&
          favoriteFacility?.properties && (
            <MarkerWithPopup
              key={favoriteFacility.category + favoriteFacility.properties.id}
              markerOptions={{ riseOnHover: true, riseOffset: 1000 }}
              position={[
                favoriteFacility.geometry.coordinates[1],
                favoriteFacility.geometry.coordinates[0],
              ]}
              icon={favoriteMarkerIcon}
              popupContent={
                <FavoriteLocationPopupContent
                  favoriteFacility={favoriteFacility}
                />
              }
              item={favoriteFacility}
              isMarkedFavorite={true}
              onMarkerClick={() =>
                setDestination([
                  favoriteFacility.geometry.coordinates[1],
                  favoriteFacility.geometry.coordinates[0],
                ])
              }
            />
          )}

        {mapData.map((item) => (
          <MarkerWithPopup
            markerOptions={{ riseOnHover: false }}
            key={`${item.category}-${item._id}`}
            position={[
              item.geometry.coordinates[1],
              item.geometry.coordinates[0],
            ]}
            icon={createCustomIcon(categoryColors[item.category])}
            popupContent={
              <MarkerPopupContent
                properties={item.properties}
                geometry={item.geometry}
              />
            }
            item={item}
            onMarkAsFavoriteClick={(locationData) =>
              MarkAsFavoriteClickHandler(
                user,
                setUser,
                setFavoriteFacility,
                locationData
              )
            }
            isMarkedFavorite={
              item.category === user?.favoriteFacility?.category &&
              item.properties.id === user?.favoriteFacility?.properties?.id
            }
            onMarkerClick={() =>
              setDestination([
                item.geometry.coordinates[1],
                item.geometry.coordinates[0],
              ])
            }
          />
        ))}
      </MapContainer>
    </>
  );
};

export default MapComponent;
