import { fetchApi } from "../lib/api";
import { User, Role } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken?: string; user: User }> {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email: string, phone: string, password: string, role: Role): Promise<{ user: User }> {
    return fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, phone, password, role }),
    });
  },

  async getMe(): Promise<User> {
    return fetchApi("/auth/me", {
      method: "GET",
    });
  },
};
