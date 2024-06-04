import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSchools = (): Observable<Feature[]> => {
  return from(api.get<Feature[]>('/schools').then((response) => response.data));
};

export const getSchoolById = (id: number): Observable<Feature> => {
  return from(
    api.get<Feature>(`/schools/${id}`).then((response) => response.data)
  );
};
