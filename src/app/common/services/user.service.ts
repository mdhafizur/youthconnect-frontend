import { Observable, Subscription, from } from 'rxjs';
import { User } from '../models/user.model';
import api from '../utils/api';

export const updateUser = (user: User): Observable<User> => {
  return from(
    api
      .put<User>('/users', {
        ...user,
      })
      .then((response) => response.data)
  );
};

export const deleteUser = (userId: string): Observable<void> => {
  return from(
    api.delete<void>(`/users/${userId}`).then((response) => {
      return response.data;
    })
  );
};


export const updateUserData = (user: User) => {
  return new Promise<User>((resolve, reject) => {
    const subscription: Subscription = updateUser(user).subscribe({
      next: (userData: User) => {
        if (userData) {
          resolve(userData);
        } else {
          reject(new Error('No user data returned'));
        }
      },
      error: (error) => {
        reject(error);
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });
  });
};