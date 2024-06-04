// 'use client' -> 'use strict' is the correct directive
'use strict';

import { useState, useEffect } from 'react';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feature } from '../models/feature.model';
import { getSchools } from '../services/school.service';
import { getKindergartens } from '../services/kindergarten.service';
import { getSocialChildProjects } from '../services/social-child-project.service';
import { getSocialTeenagerProjects } from '../services/social-teenager-project.service';

export const useMapData = (selectedCategories: string[]): Feature[] => {
  const [mapData, setMapData] = useState<Feature[]>([]);

  useEffect(() => {
    const observables: Observable<Feature[]>[] = [];

    if (selectedCategories.includes('school')) {
      observables.push(
        getSchools().pipe(map((data) => addCategory(data, 'school')))
      );
    }
    if (selectedCategories.includes('kindergarten')) {
      observables.push(
        getKindergartens().pipe(
          map((data) => addCategory(data, 'kindergarten'))
        )
      );
    }
    if (selectedCategories.includes('social-child-project')) {
      observables.push(
        getSocialChildProjects().pipe(
          map((data) => addCategory(data, 'social-child-project'))
        )
      );
    }
    if (selectedCategories.includes('social-teenager-project')) {
      observables.push(
        getSocialTeenagerProjects().pipe(
          map((data) => addCategory(data, 'social-teenager-project'))
        )
      );
    }

    if (observables.length === 0) {
      setMapData([]); // If no categories are selected, set mapData to empty array
      return;
    }

    const combined$ = combineLatest(observables).pipe(
      map((responses) => responses.flat())
    );

    const subscription = combined$.subscribe((data) => {
      // console.log('Filtered Data:', data); // Log filtered data
      setMapData(data);
    });

    return () => subscription.unsubscribe();
  }, [selectedCategories]);

  // console.log('Selected Categories:', selectedCategories); // Log selected categories
  return mapData;
};

// Helper function to add category information to each feature object
const addCategory = (data: Feature[], category: string): Feature[] => {
  return data.map((feature) => ({ ...feature, category }));
};
