import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSocialChildProjects = (): Observable<Feature[]> => {
  return from(
    api
      .get<Feature[]>('data/social-child-projects')
      .then((response) => response.data)
  );
};


