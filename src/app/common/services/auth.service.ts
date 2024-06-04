import { from, Observable } from 'rxjs';
import api from '../utils/api';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';

export const register = (email: string, password: string): Observable<User> => {
  return from(
    api
      .post<User>('/auth/register', { email, password })
      .then((response) => response.data)
      .catch((error) => {
        // Handle error appropriately here
        throw error;
      })
  );
};

export const login = (
  email: string,
  password: string
): Observable<{ message: string }> => {
  return from(
    api
      .post<{ message: string }>('/auth/login', {
        email,
        password,
      })
      .then((response) => response.data)
  );
};

export const logout = (): Observable<Message> => {
  return from(api.get<Message>(`/auth/user`).then((response) => response.data));
};

export const getUser = (): Observable<User> => {
  return from(api.get<User>(`/auth/user`).then((response) => response.data));
};
