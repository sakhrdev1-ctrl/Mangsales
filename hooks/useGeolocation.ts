
import React from 'react';
import { useState, useCallback } from 'react';
import { Geolocation } from '../types';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  data: Geolocation | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Geolocation is not supported by this browser.
      // This is not a standard GeolocationPositionError, so we create a custom-like error.
      const error: GeolocationPositionError = {
        code: 0, // 0 is a custom code for not supported
        message: "Geolocation is not supported by your browser.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      };
      setState({ loading: false, error, data: null });
      return;
    }

    setState({ loading: true, error: null, data: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error,
          data: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { ...state, getLocation };
};
