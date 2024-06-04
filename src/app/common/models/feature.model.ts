import { Geometry } from './geometry.model';
import { Properties } from './properties.model';

export interface Feature {
  _id: number;
  type: string;
  category: string;
  properties: Properties;
  geometry: Geometry;
}
