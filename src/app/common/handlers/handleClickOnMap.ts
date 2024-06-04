import { LatLng } from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { HomeAddress } from '../models/user.model'; // Ensure HomeAddress is imported

const handleClickOnMap = async (
  latlng: LatLng,
  setSearchResult: (location: HomeAddress | null) => void
) => {
  try {
    if (!latlng) {
      return;
    }

    const updatedHomeAddress: HomeAddress = {
      name: '',
      placeId: '',
      coordinates: [latlng.lat, latlng.lng],
    };

    const query = latlng.lat + ',' + latlng.lng;
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query });

    if (results.length > 0) {
      const { x, y, raw } = results[0];

      updatedHomeAddress.name = raw.display_name;
      updatedHomeAddress.placeId = raw.place_id;
      setSearchResult(updatedHomeAddress);
    } else {
      setSearchResult(null);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};

export default handleClickOnMap;
