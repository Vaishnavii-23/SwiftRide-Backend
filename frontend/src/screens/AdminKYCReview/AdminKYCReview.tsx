import { useEffect, useState } from "react";
import { CircleCheck as CheckCircle2, Circle as XCircle, FileCheck as FileCheckIcon, IdCard as IdCardIcon, Car as CarIcon, Clock as ClockIcon, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { kycService } from "../../services/kyc.service";
import { AdminPendingKYC } from "../../types";

interface GroupedKYC {
  driverId: string;
  driverName: string;
  email: string;
  phone: string;
  documents: AdminPendingKYC[];
}

export const AdminKYCReview = () => {
  const [groupedPending, setGroupedPending] = useState<GroupedKYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // documentId or driverId

  const loadPendingDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await kycService.getPendingDocs();
      const rawDocs = res.documents || [];

      // Group flat document list by driver
      const grouped: Record<string, GroupedKYC> = {};
      rawDocs.forEach((doc) => {
        const driverId = doc.driverId;
        if (!grouped[driverId]) {
          grouped[driverId] = {
            driverId,
            driverName: doc.driver?.user?.email?.split('@')[0] || "Unknown Driver",
            email: doc.driver?.user?.email || "No Email",
            phone: doc.driver?.user?.phone || "No Phone",
            documents: [],
          };
        }
        grouped[driverId].documents.push(doc);
      });

      setGroupedPending(Object.values(grouped));
    } catch (err: any) {
      console.error("Failed to load pending KYC docs:", err);
      setError(err.message || "Failed to load pending documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingDocs();
  }, []);

  const handleAction = async (documentId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    setActionLoading(documentId);
    try {
      await kycService.reviewDocument(documentId, status, reason);
      // Reload queue
      await loadPendingDocs();
    } catch (err: any) {
      console.error(`Failed to review document ${documentId}:`, err);
      setError(err.message || "Failed to submit review.");
    } finally {
      setActionLoading(null);
    }
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case "DRIVING_LICENSE":
        return IdCardIcon;
      case "INSURANCE":
        return FileCheckIcon;
      default:
        return CarIcon;
    }
  };

  const getDocLabel = (type: string) => {
    switch (type) {
      case "DRIVING_LICENSE":
        return "Driver's License";
      case "INSURANCE":
        return "Vehicle Insurance";
      default:
        return "Vehicle Registration (RC)";
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">KYC Review Queue</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Review and approve driver document submissions.
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-sm">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ClockIcon className="h-6 w-6 text-terracotta-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{groupedPending.length}</p>
            <p className="font-sans text-xs text-muted-foreground">Drivers Awaiting Review</p>
          </div>
        </div>

        {/* Grouped submissions list */}
        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-44 w-full rounded-2xl skeleton" />
            <div className="h-44 w-full rounded-2xl skeleton" />
          </div>
        ) : groupedPending.length > 0 ? (
          <>
            <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Pending Submissions</h2>
            <div className="mt-4 space-y-4">
              {groupedPending.map((sub, i) => (
                <Card
                  key={sub.driverId}
                  className="rounded-2xl border-gray-200 bg-white shadow-sm animate-fade-up animate-delay-100"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-sm font-bold text-white">
                          {sub.driverName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-sans text-base font-bold text-charcoal">{sub.driverName}</p>
                          <p className="font-sans text-xs text-muted-foreground">{sub.email} · Phone: {sub.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pending Documents List */}
                    <div className="mt-6 space-y-4">
                      {sub.documents.map((doc) => {
                        const Icon = getDocIcon(doc.type);
                        const label = getDocLabel(doc.type);
                        return (
                          <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-white p-4 border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage-500 shadow-sm">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-sans text-sm font-bold text-charcoal block">{label}</span>
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-sans text-xs text-sage-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  View uploaded file <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                            
                            {/* Actions on document */}
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAction(doc.id, "APPROVED")}
                                disabled={actionLoading !== null}
                                size="sm"
                                className="rounded-xl bg-black px-4 font-sans text-xs font-bold text-white hover:bg-gray-900"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason:");
                                  if (reason) handleAction(doc.id, "REJECTED", reason);
                                }}
                                disabled={actionLoading !== null}
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-red-200 px-4 font-sans text-xs font-bold text-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 text-center font-sans text-sm text-muted-foreground py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            No KYC submissions to review.
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminKYCReview;
