import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getKindergartens = (): Observable<Feature[]> => {
  return from(
    api.get<Feature[]>('/kindergartens').then((response) => response.data)
  );
};

export const getKindergartenById = (id: number): Observable<Feature> => {
  return from(
    api.get<Feature>(`/kindergartens/${id}`).then((response) => response.data)
  );
};
