import { User, FavoriteFacility } from "../models/user.model";
import { updateUserData } from "../services/user.service";
import { toast } from "react-hot-toast";

const handleMarkAsFavoriteClick = async (
  user: User | null,
  setUser: (user: User) => void,
  setFavoriteFacility: (facility: FavoriteFacility | null) => void,
  favoriteFacilityData: FavoriteFacility
) => {
  if (!user) {
    return;
  }

  user.favoriteFacility = favoriteFacilityData;
  setUser(user);
  setFavoriteFacility(favoriteFacilityData);

  try {
    await toast
      .promise(updateUserData(user), {
        loading: "Updating user...",
        success: "Marked as Favorite ❤️",
        error: "Failed to update user",
      })
      .then((userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        user.favoriteFacility = favoriteFacilityData;
        setUser(user);
        setFavoriteFacility(favoriteFacilityData);
      })
      .catch((error) => {
        console.error("updateUser failed:", error);
      });
  } catch (error) {
    console.error("Failed to update user:", error);
  }
};

export default handleMarkAsFavoriteClick;
