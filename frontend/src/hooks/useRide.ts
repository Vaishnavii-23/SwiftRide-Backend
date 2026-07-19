import { useState, useCallback } from "react";
import { rideService, RideRequestPayload } from "../services/ride.service";
import { Ride } from "../types";

export const useRide = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRide = useCallback(async (payload: RideRequestPayload): Promise<Ride> => {
    setLoading(true);
    setError(null);
    try {
      const ride = await rideService.requestRide(payload);
      return ride;
    } catch (err: any) {
      const msg = err.message || "Something went wrong while booking the ride";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRideHistory = useCallback(async (): Promise<Ride[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await rideService.getRideHistory();
      return response.rideHistory || [];
    } catch (err: any) {
      const msg = err.message || "Failed to load ride history";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    requestRide,
    getRideHistory,
  };
};
export default useRide;
