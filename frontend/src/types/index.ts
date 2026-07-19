export type Role = "RIDER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  phone: string;
  role: Role;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RouteType = "FASTEST" | "SAFEST";

export type RideStatus = "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupAddress: string;
  dropoffAddress: string;
  routeType: RouteType;
  status: RideStatus;
  fare?: number;
  distance?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteOption {
  type: RouteType;
  estimatedTime: number; // in minutes
  distance: number; // in km
  safetyScore: number; // out of 100
  safetyLevel: "GREEN" | "YELLOW" | "RED";
  description: string;
}

export interface SafetyScoreResponse {
  fastestRoute: RouteOption;
  safestRoute: RouteOption;
}

export interface NearestDriver {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  status: "ONLINE" | "OFFLINE";
  user: {
    email: string;
    phone: string;
  };
}

export type KYCDocumentType = "DRIVING_LICENSE" | "VEHICLE_RC" | "INSURANCE";
export type KYCDocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface KYCDocument {
  id: string;
  driverId: string;
  type: KYCDocumentType;
  fileUrl: string;
  status: KYCDocumentStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPendingKYC {
  id: string;
  driverId: string;
  type: KYCDocumentType;
  fileUrl: string;
  status: KYCDocumentStatus;
  rejectionReason?: string;
  createdAt: string;
  driver: {
    id: string;
    userId: string;
    user: {
      email: string;
      phone: string;
    };
  };
}

export interface RatingPayload {
  rideId: string;
  score: number;
  comment?: string;
  safetyScore: number;
}

export interface AdminAnalytics {
  revenueMTD?: number;
  activeDriversCount?: number;
  activeRidersCount?: number;
  avgSafetyScore?: number;
  totalUsers?: number;
  totalRides?: number;
}

export interface WebSocketMessage {
  type: "auth" | "location" | "ride_request";
  status?: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
  // ride request fields
  rideId?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
}
