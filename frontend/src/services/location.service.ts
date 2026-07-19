import { fetchApi } from "../lib/api";
import { NearestDriver } from "../types";

export const locationService = {
  async updateLocation(latitude: number, longitude: number): Promise<{ message: string }> {
    return fetchApi("/location/update", {
      method: "PATCH",
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  async getNearestDrivers(latitude: number, longitude: number): Promise<NearestDriver[]> {
    return fetchApi(`/location/nearest?latitude=${latitude}&longitude=${longitude}`, {
      method: "GET",
    });
  },

  async goOnline(): Promise<{ message: string }> {
    return fetchApi("/location/online", {
      method: "PATCH",
    });
  },

  async goOffline(): Promise<{ message: string }> {
    return fetchApi("/location/offline", {
      method: "PATCH",
    });
  },
};
