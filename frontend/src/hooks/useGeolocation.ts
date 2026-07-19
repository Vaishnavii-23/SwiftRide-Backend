import { useEffect, useState } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        lat: null,
        lng: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    // Get current position initially
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);

    // Start watching position for updates
    const watcherId = navigator.geolocation.watchPosition(successHandler, errorHandler, options);

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, []);

  return state;
};
export default useGeolocation;
