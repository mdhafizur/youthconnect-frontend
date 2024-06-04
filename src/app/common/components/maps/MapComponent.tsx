import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
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
import MapEvents from "./MapEvents";
import {
  customMarkerIcon,
  homeMarkerIcon,
  favoriteMarkerIcon,
  homeSmallIcon,
  createCustomIcon,
} from "../../utils/CustomIcons";
import MarkAsFavoriteClickHandler from "../../handlers/handleMarkAsFavoriteClick";
import handleClickOnMap from "../../handlers/handleClickOnMap";
import haversine from "haversine-distance";
import handleMarkAsHomeClick from "../../handlers/handleMarkAsHomeClick";
import toast from "react-hot-toast";
import { updateUserData } from "../../services/user.service";
import FavoriteLocationPopupContent from "./popups/FavoriteLocationPopupContent";

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
  const [mapClickResult, setMapClickResult] = useState<HomeAddress | null>(
    null
  );
  const [mapSearchResult, setMapSearchResult] = useState<HomeAddress | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [showRouting, setShowRouting] = useState<boolean>(false);

  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

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
    L.Marker.prototype.options.icon = createCustomIcon("#ff0000"); // default icon color
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        const map = mapRef.current;
        const provider = new OpenStreetMapProvider();
        const searchControl = GeoSearchControl({
          notFoundMessage: "Sorry, that address could not be found.",
          provider,
          style: "button",
          showMarker: true,
          showPopup: true,
          autoClose: true,
          updateMap: true,
          retainZoomLevel: false,
          animateZoom: true,
          keepResult: true,
          searchLabel: "Enter address",
          marker: {
            icon: createCustomIcon("#0000ff"),
            draggable: false,
          },
        });
        map.addControl(searchControl);

        const handleGeosearchShowLocation = (event) => {
          let { location, marker } = event;

          const homeAddress = {
            name: location.label,
            placeId: location.raw.place_id,
            coordinates: [location.raw.lat, location.raw.lon],
          };

          setMapSearchResult(homeAddress);

          if (!marker) {
            marker = L.marker([location.raw.lat, location.raw.lon]).addTo(map);
          } else {
            marker.setLatLng([location.raw.lat, location.raw.lon]);
          }

          const popupContent = document.createElement("div");
          popupContent.innerHTML = `
            <strong>Location Found:</strong><br>
            <p class='mt-2'>
              <strong>Name:</strong> ${location.label}
            </p>
            <div class='flex items-center space-x-2'>
              <button id='markAsHomeBtn' class='p-2 md:p-3 hover:bg-gray-200 rounded transition duration-300 ease-in-out'>
                <div>${homeSmallIcon}</div>
              </button>
            </div>
          `;

          marker.bindPopup(popupContent).openPopup();

          const markAsHomeBtn = popupContent.querySelector("#markAsHomeBtn");
          markAsHomeBtn.addEventListener("click", () =>
            handleHomeMark(homeAddress)
          );
        };

        map.on("geosearch/showlocation", handleGeosearchShowLocation);

        return () => {
          map.off("geosearch/showlocation", handleGeosearchShowLocation);
        };
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const initializeRoutingControl = () => {
      if (showRouting && homeLocation && favoriteFacility?.geometry) {
        const distanceInMeters = haversine(
          {
            lat: homeLocation.coordinates[0],
            lon: homeLocation.coordinates[1],
          },
          {
            lat: favoriteFacility.geometry.coordinates[1],
            lon: favoriteFacility.geometry.coordinates[0],
          }
        );
        setDistance(distanceInMeters);

        if (mapRef.current) {
          if (routingControlRef.current) {
            mapRef.current.removeControl(routingControlRef.current);
          }
          routingControlRef.current = L.Routing.control({
            waypoints: [
              L.latLng(
                homeLocation.coordinates[0],
                homeLocation.coordinates[1]
              ),
              L.latLng(
                favoriteFacility.geometry.coordinates[1],
                favoriteFacility.geometry.coordinates[0]
              ),
            ],
            routeWhileDragging: true,
          }).addTo(mapRef.current);
        }
      } else {
        setDistance(null);
      }
    };

    if (showRouting) {
      initializeRoutingControl();
    } else if (routingControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  }, [showRouting]);

  useEffect(() => {
    if (homeLocation && favoriteFacility?.geometry) {
      const distanceInMeters = haversine(
        {
          lat: homeLocation.coordinates[0],
          lon: homeLocation.coordinates[1],
        },
        {
          lat: favoriteFacility.geometry.coordinates[1],
          lon: favoriteFacility.geometry.coordinates[0],
        }
      );
      setDistance(distanceInMeters);
    } else {
      setDistance(null);
    }
  }, [homeLocation, favoriteFacility]);

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
        {/* <MapEvents
          onMapClick={(latlng: L.LatLng) =>
            handleClickOnMap(latlng, setMapClickResult)
          }
        /> */}

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
                {distance && (
                  <p>
                    <strong>Distance from Favorite Place:</strong>{" "}
                    {distance.toFixed(2)} meters
                  </p>
                )}
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
                  distance={distance}
                />
              }
              item={favoriteFacility}
              isMarkedFavorite={true}
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
          />
        ))}

        {mapClickResult && (
          <MarkerWithPopup
            position={[
              mapClickResult.coordinates[0],
              mapClickResult.coordinates[1],
            ]}
            icon={customMarkerIcon}
            popupContent={
              <div className="text-left">
                <strong>Set Point</strong>
                <p className="mt-2">
                  <strong>Name:</strong> {mapClickResult.name}
                </p>
              </div>
            }
            onMarkAsHomeClick={(homeLocationData: HomeAddress) =>
              handleMarkAsHomeClick(
                user,
                setUser,
                {
                  lat: mapClickResult.coordinates[0],
                  lng: mapClickResult.coordinates[1],
                },
                setHomeLocation
              )
            }
          />
        )}
      </MapContainer>
    </>
  );
};

export default MapComponent;
