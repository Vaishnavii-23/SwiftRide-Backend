import { fetchApi } from "../lib/api";
import { RatingPayload } from "../types";

export const ratingService = {
  async submitRating(payload: RatingPayload): Promise<{ message: string }> {
    return fetchApi("/rating/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
