import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { Feature } from '../models/feature.model';

export const getSocialTeenagerProjects = (): Observable<Feature[]> => {
  return from(
    api
      .get<Feature[]>('data/social-teenager-projects')
      .then((response) => response.data)
  );
};
