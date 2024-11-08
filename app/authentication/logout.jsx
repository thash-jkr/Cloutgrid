import React, { useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { getCSRFToken } from '../getCSRFToken';

import Config from "../config"

const Logout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const refresh = await SecureStore.getItemAsync('refresh');
        const access = await SecureStore.getItemAsync('access');
        if (!refresh) {
          console.log('No refresh token found');
          return;
        }
        const csrfToken = await getCSRFToken();

        await axios.post(
          `${Config.BASE_URL}/logout/`,
          { refresh },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
              'Authorization': `Bearer ${access}`,
            },
          }
        );
        
        await SecureStore.deleteItemAsync('access');
        await SecureStore.deleteItemAsync('refresh');
        axios.defaults.headers.common['Authorization'] = null;
        navigation.navigate('Home');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed. Please try again.');
      }
    };

    handleLogout();
  }, [navigation]);

  return null;
};

export default Logout;
