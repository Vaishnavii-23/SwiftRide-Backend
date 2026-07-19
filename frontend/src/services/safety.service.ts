import { fetchApi } from "../lib/api";
import { SafetyScoreResponse } from "../types";

export const safetyService = {
  async getSafetyScore(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number
  ): Promise<SafetyScoreResponse> {
    return fetchApi(
      `/safety/score?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropoffLat=${dropoffLat}&dropoffLng=${dropoffLng}`,
      {
        method: "GET",
      }
    );
  },
};
