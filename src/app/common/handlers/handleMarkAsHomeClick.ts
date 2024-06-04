import { Subscription } from 'rxjs';
import { updateUser, updateUserData } from '../services/user.service';
import { User, HomeAddress } from '../models/user.model';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { toast } from 'react-hot-toast';

const handleMarkAsHomeClick = async (
  user: User | null,
  setUser: (user: User) => void,
  latlng: {
    lat: number;
    lng: number;
  },
  setHomeLocation: (homelocation: HomeAddress | null) => void
) => {
  try {
    if (!user) {
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
      user.homeAddress = updatedHomeAddress;

      try {
        await toast
          .promise(updateUserData(user), {
            loading: 'Updating user...',
            success: 'Marked as Home 🏠',
            error: 'Failed to update user',
          })
          .then((userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setHomeLocation(user.homeAddress);
          })
          .catch((error) => {
            console.error('updateUser failed:', error);
          });
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    } else {
      // setSearchResult(null);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};

export default handleMarkAsHomeClick;
