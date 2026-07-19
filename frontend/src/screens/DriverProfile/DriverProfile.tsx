import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { kycService } from "../../services/kyc.service";
import { authService } from "../../services/auth.service";
import {
  LogOut as LogOutIcon,
  Star as StarIcon,
  Shield as ShieldIcon,
  Car as CarIcon,
  FileText as DocIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { User } from "../../types";

export const DriverProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [kycStatus, setKycStatus] = useState<"VERIFIED" | "PENDING" | "REJECTED" | "NOT_STARTED">("NOT_STARTED");
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileAndKyc = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, kycData] = await Promise.all([
        authService.getMe(),
        kycService.getMyDocs(),
      ]);

      setProfile(profileData);

      const docs = kycData.documents || [];
      setDocCount(docs.length);

      const approvedCount = docs.filter((d) => d.status === "APPROVED").length;
      const rejectedCount = docs.filter((d) => d.status === "REJECTED").length;

      if (approvedCount === 3) {
        setKycStatus("VERIFIED");
      } else if (rejectedCount > 0) {
        setKycStatus("REJECTED");
      } else if (docs.length > 0) {
        setKycStatus("PENDING");
      } else {
        setKycStatus("NOT_STARTED");
      }
    } catch (err: any) {
      console.error("Failed to load driver profile or KYC:", err);
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndKyc();
  }, [fetchProfileAndKyc]);

  const displayName = profile?.email?.split("@")[0] || "Driver Partner";
  const initials = displayName.slice(0, 2).toUpperCase();

  const getKycBadge = () => {
    switch (kycStatus) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-sans text-xs font-bold text-green-700">
            <CheckCircle className="h-3.5 w-3.5" /> Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-sans text-xs font-bold text-yellow-700">
            <Clock className="h-3.5 w-3.5" /> Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 font-sans text-xs font-bold text-red-600">
            <XCircle className="h-3.5 w-3.5" /> Rejected Documents
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1 font-sans text-xs font-bold text-muted-foreground">
            Not Completed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 w-full">
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm animate-pulse">
          <div className="h-20 w-20 rounded-full bg-cream-200" />
          <div className="mt-4 h-6 w-32 rounded bg-cream-200" />
          <div className="mt-2 h-4 w-48 rounded bg-cream-200" />
          <div className="mt-4 flex gap-6 w-full justify-center">
            <div className="h-10 w-16 rounded bg-cream-200" />
            <div className="h-10 w-16 rounded bg-cream-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 w-full">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-sm flex-1">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProfileAndKyc}
            className="text-red-600 hover:bg-red-100"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-200 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchProfileAndKyc}
          className="absolute right-4 top-4 text-muted-foreground hover:text-charcoal"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
          {initials}
        </div>
        <p className="mt-3 font-serif text-xl font-normal text-charcoal">
          {displayName} (Driver Partner)
        </p>
        <p className="font-sans text-sm text-muted-foreground">{profile?.email}</p>
        {profile?.phone && (
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {profile.phone}
          </p>
        )}

        <div className="mt-4 flex gap-6">
          <div className="text-center">
            <p className="font-serif text-2xl font-normal text-charcoal flex items-center justify-center gap-1">
              4.9 <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </p>
            <p className="font-sans text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl font-normal text-sage-500">
              {docCount}/3
            </p>
            <p className="font-sans text-xs text-muted-foreground">Docs Uploaded</p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <h2 className="mt-6 font-serif text-xl font-normal text-charcoal">
        Vehicle Details
      </h2>
      <Card className="mt-3 rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-charcoal">
            <CarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-sans text-sm font-bold text-charcoal">
              Silver Toyota Camry
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Plate No: 7XK-4291
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compliance / KYC verification status */}
      <h2 className="mt-6 font-serif text-xl font-normal text-charcoal">
        KYC Verification
      </h2>
      <Card className="mt-3 rounded-2xl border-gray-200 bg-white shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-charcoal">
              <DocIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-sans text-sm font-bold text-charcoal flex items-center gap-2">
                KYC Status: {getKycBadge()}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Status of compliance documents review
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/driver/kyc")}
            className="rounded-xl bg-black text-white hover:bg-gray-800 font-sans text-xs font-bold"
          >
            Review Docs
          </Button>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-6 h-auto w-full rounded-2xl bg-red-600 py-4 font-sans text-base font-bold text-white hover:bg-red-700 flex items-center justify-center gap-2"
      >
        <LogOutIcon className="h-5 w-5" /> Sign Out
      </Button>
    </div>
  );
};
export default DriverProfile;
