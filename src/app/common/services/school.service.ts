import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSchools = (): Observable<Feature[]> => {
  return from(api.get<Feature[]>('data/schools').then((response) => response.data));
};
