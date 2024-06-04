import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getKindergartens = (): Observable<Feature[]> => {
  return from(
    api.get<Feature[]>('data/kindergartens').then((response) => response.data)
  );
};
