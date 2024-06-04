import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSocialTeenagerProjects = (): Observable<Feature[]> => {
  return from(
    api
      .get<Feature[]>('/social-teenager-projects')
      .then((response) => response.data)
  );
};

export const getSocialTeenagerProjectById = (
  id: number
): Observable<Feature> => {
  return from(
    api
      .get<Feature>(`/social-teenager-projects/${id}`)
      .then((response) => response.data)
  );
};
