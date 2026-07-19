import { fetchApi } from "../lib/api";
import { User, Role, AdminAnalytics } from "../types";

export const adminService = {
  async getUsers(role?: Role | "rider" | "driver"): Promise<{ users: User[] }> {
    const query = role ? `?role=${role.toUpperCase()}` : "";
    const res = await fetchApi(`/admin/users${query}`, {
      method: "GET",
    });
    return { users: res.data || [] };
  },

  async banUser(userId: string): Promise<{ message: string; user: User }> {
    const res = await fetchApi(`/admin/ban/${userId}`, {
      method: "PATCH",
    });
    return { message: res.message, user: res.data };
  },

  async unbanUser(userId: string): Promise<{ message: string; user: User }> {
    const res = await fetchApi(`/admin/unban/${userId}`, {
      method: "PATCH",
    });
    return { message: res.message, user: res.data };
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await fetchApi("/admin/analytics", {
      method: "GET",
    });
    return res.data;
  },

  async getSurge(zoneId: string): Promise<{ zoneId: string; surgeMulti: number }> {
    return fetchApi(`/surge/${zoneId}`, {
      method: "GET",
    });
  },

  async updateSurge(zoneId: string, surgeMulti: number): Promise<{ message: string; surgeZone: any }> {
    return fetchApi(`/surge/${zoneId}`, {
      method: "PATCH",
      body: JSON.stringify({ surgeMulti }),
    });
  },
};
