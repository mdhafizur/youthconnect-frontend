import { Geometry } from './geometry.model';
import { Properties } from './properties.model';

export interface User {
  _id: string | null;
  email: string;
  _password: string;
  oldPassword?: string;
  newPassword?: string;
  favoriteFacility: FavoriteFacility | null;
  homeAddress: HomeAddress | null;
}

export interface FavoriteFacility {
  _id: string | null;
  type: string | null;
  category: string | null;
  geometry: Geometry | null;
  properties: Properties | null;
}

export interface HomeAddress {
  name: string | null;
  placeId: string | null;
  coordinates: number[];
}
