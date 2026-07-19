import { fetchApi } from "../lib/api";
import { Ride, RouteType } from "../types";

export interface RideRequestPayload {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupAddress: string;
  dropoffAddress: string;
  routeType: RouteType;
}

export const rideService = {
  async requestRide(payload: RideRequestPayload): Promise<Ride> {
    return fetchApi("/ride/request", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async acceptRide(rideId: string): Promise<Ride> {
    return fetchApi("/ride/accept", {
      method: "PATCH",
      body: JSON.stringify({ rideId }),
    });
  },

  async startRide(rideId: string): Promise<Ride> {
    return fetchApi("/ride/start", {
      method: "PATCH",
      body: JSON.stringify({ rideId }),
    });
  },

  async completeRide(rideId: string): Promise<Ride> {
    return fetchApi("/ride/complete", {
      method: "PATCH",
      body: JSON.stringify({ rideId }),
    });
  },

  async getRideHistory(): Promise<{ rideHistory: Ride[] }> {
    return fetchApi("/ride/history", {
      method: "GET",
    });
  },
};
