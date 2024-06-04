import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSocialChildProjects = (): Observable<Feature[]> => {
  return from(
    api
      .get<Feature[]>('/social-child-projects')
      .then((response) => response.data)
  );
};

export const getSocialChildProjectById = (id: number): Observable<Feature> => {
  return from(
    api
      .get<Feature>(`/social-child-projects/${id}`)
      .then((response) => response.data)
  );
};
