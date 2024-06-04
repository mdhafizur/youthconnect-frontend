'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUser, updateUser, updateUserData } from '../common/services/user.service';
import { useAuth } from '../common/context/AuthContext';
import LoadingComponent from '../common/components/LoadingComponent';

import { toast } from 'react-hot-toast';

import { NextPage } from 'next';
import ProfileForm from '../common/components/forms/ProfileForm';

const Profile: NextPage = () => {
  const router = useRouter();
  const { user, setUser, loading, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/register');
    }
  }, [user, router]);

  const handleDelete = async () => {
    try {
      if (user && user._id) {
        await deleteUser(user._id);
        logout();
        router.push('/');
      } else {
        console.error('User ID not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!user) return;

    try {
      if (formData.email) {
        user.email = formData.email;
      }
      // if (formData.favoriteFacilityAddress) {
      //   user.favoriteFacility = formData.favoriteFacilityAddress;
      // }
      if (formData.homeAddress) {
        user.homeAddress = formData.homeAddress;
      }
      if (formData.oldPassword) {
        user.oldPassword = formData.oldPassword;
      }
      if (formData.newPassword) {
        user.newPassword = formData.newPassword;
      }

      await toast.promise(updateUserData(user), {
        loading: 'Updating user...',
        success: 'User info updated',
        error: 'Failed to update user info',
      })
        .then((userData) => {
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        })
        .catch((error) => {
          toast.error(` ${error.response.data.message}!`);
          console.error('updateUser failed:', error);

        });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ProfileForm user={user} onUpdate={handleUpdate} onDelete={handleDelete} />
  );
};

export default Profile;
