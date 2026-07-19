import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing Leaflet marker icons in React/Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { PublicLayout } from "./components/PublicLayout";
import { RiderLayout } from "./components/RiderLayout";
import { DriverLayout } from "./components/DriverLayout";
import { AdminLayout } from "./components/AdminLayout";

import { HomePage } from "./screens/HomePage";
import { HowItWorksPage } from "./screens/HowItWorksPage";
import { SafetyPage } from "./screens/SafetyPage";
import { AboutPage } from "./screens/AboutPage";
import { ContactPage } from "./screens/ContactPage";
import { LoginPage } from "./screens/LoginPage";
import { RegisterPage } from "./screens/RegisterPage";
import { NotFoundPage } from "./screens/NotFoundPage";
import { AdminLoginPage } from "./screens/AdminLoginPage";

import { RiderHome } from "./screens/RiderHome";
import { RiderRouteSelection } from "./screens/RiderRouteSelection";
import { RiderMatching } from "./screens/RiderMatching";
import { RiderRideInProgress } from "./screens/RiderRideInProgress";
import { RiderTripCompletion } from "./screens/RiderTripCompletion";
import { RiderHistory } from "./screens/RiderHistory";
import { RiderSafety } from "./screens/RiderSafety";
import { RiderProfile } from "./screens/RiderProfile";
import { RiderRideDetail } from "./screens/RiderRideDetail/RiderRideDetail";

import { DriverDashboard } from "./screens/DriverDashboard";
import { DriverKYC } from "./screens/DriverKYC";
import { DriverIncomingRequest } from "./screens/DriverIncomingRequest";
import { DriverNavigation } from "./screens/DriverNavigation";
import { DriverEarnings } from "./screens/DriverEarnings";
import { DriverProfile } from "./screens/DriverProfile/DriverProfile";

import { AdminDashboard } from "./screens/AdminDashboard";
import { AdminUserManagement } from "./screens/AdminUserManagement";
import { AdminKYCReview } from "./screens/AdminKYCReview";
import { AdminLiveMonitoring } from "./screens/AdminLiveMonitoring";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/adminlogin" element={<AdminLoginPage />} />

          {/* Rider (mobile-first) */}
          <Route element={<RiderLayout />}>
            <Route path="/rider" element={<RiderHome />} />
            <Route path="/rider/route" element={<RiderRouteSelection />} />
            <Route path="/rider/matching" element={<RiderMatching />} />
            <Route path="/rider/ride" element={<RiderRideInProgress />} />
            <Route path="/rider/complete" element={<RiderTripCompletion />} />
            <Route path="/rider/history" element={<RiderHistory />} />
            <Route path="/rider/history/:rideId" element={<RiderRideDetail />} />
            <Route path="/rider/safety" element={<RiderSafety />} />
            <Route path="/rider/profile" element={<RiderProfile />} />
          </Route>

          {/* Driver */}
          <Route element={<DriverLayout />}>
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/kyc" element={<DriverKYC />} />
            <Route path="/driver/request" element={<DriverIncomingRequest />} />
            <Route path="/driver/active" element={<DriverNavigation />} />
            <Route path="/driver/earnings" element={<DriverEarnings />} />
            <Route path="/driver/profile" element={<DriverProfile />} />
          </Route>

          {/* Admin (desktop-first) */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/kyc" element={<AdminKYCReview />} />
            <Route path="/admin/monitoring" element={<AdminLiveMonitoring />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
