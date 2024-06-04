import * as L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { HomeAddress } from "../models/user.model";
import { createCustomIcon, homeSmallIcon } from "./CustomIcons";

export const setupGeoSearch = (
  map: L.Map,
  handleHomeMark: (address: HomeAddress) => void
) => {
    console.log("setupGeoSearch")
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
    markAsHomeBtn.addEventListener("click", () => handleHomeMark(homeAddress));
  };

  map.on("geosearch/showlocation", handleGeosearchShowLocation);

  return () => {
    map.off("geosearch/showlocation", handleGeosearchShowLocation);
  };
};
