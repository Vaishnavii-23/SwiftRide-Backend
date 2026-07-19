import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck as FileCheckIcon,
  Car as CarIcon,
  IdCard as IdCardIcon,
  CircleCheck as CheckCircle2,
  Upload as UploadIcon,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { kycService } from "../../services/kyc.service";
import { KYCDocumentType } from "../../types";

type DocSlotId = "license" | "insurance" | "registration";

interface DocSlot {
  id: DocSlotId;
  type: KYCDocumentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const docSlots: DocSlot[] = [
  {
    id: "license",
    type: "DRIVING_LICENSE",
    label: "Driver's License",
    icon: IdCardIcon,
    description: "Upload a valid driver's license image or PDF.",
  },
  {
    id: "registration",
    type: "VEHICLE_RC",
    label: "Vehicle Registration (RC)",
    icon: CarIcon,
    description: "Your vehicle's registration certificate document.",
  },
  {
    id: "insurance",
    type: "INSURANCE",
    label: "Vehicle Insurance",
    icon: FileCheckIcon,
    description: "Proof of current vehicle insurance coverage.",
  },
];

interface DocState {
  status: "not_uploaded" | "pending" | "approved" | "rejected";
  rejectionReason?: string;
  fileName?: string;
}

export const DriverKYC = () => {
  const navigate = useNavigate();

  const [docs, setDocs] = useState<Record<DocSlotId, DocState>>({
    license: { status: "not_uploaded" },
    insurance: { status: "not_uploaded" },
    registration: { status: "not_uploaded" },
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<DocSlotId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await kycService.getMyDocs();
      const documents = res.documents || [];

      const newDocs: Record<DocSlotId, DocState> = {
        license: { status: "not_uploaded" },
        insurance: { status: "not_uploaded" },
        registration: { status: "not_uploaded" },
      };

      documents.forEach((doc: any) => {
        let key: DocSlotId | null = null;
        if (doc.type === "DRIVING_LICENSE") key = "license";
        else if (doc.type === "INSURANCE") key = "insurance";
        else if (doc.type === "VEHICLE_RC") key = "registration";

        if (key) {
          // Extract filename from URL for cleaner display
          const filename = doc.fileUrl ? doc.fileUrl.substring(doc.fileUrl.lastIndexOf('/') + 1) : undefined;
          
          if (doc.status === "PENDING") {
            newDocs[key] = {
              status: "pending",
              fileName: filename,
            };
          } else if (doc.status === "APPROVED") {
            newDocs[key] = {
              status: "approved",
              fileName: filename,
            };
          } else if (doc.status === "REJECTED") {
            newDocs[key] = {
              status: "rejected",
              rejectionReason: doc.rejectionReason || "Document rejected during review",
              fileName: filename,
            };
          }
        }
      });

      setDocs(newDocs);
    } catch (err: any) {
      console.error("Failed to load KYC docs:", err);
      setError("Could not load your verification documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (id: DocSlotId, type: KYCDocumentType, file: File) => {
    setUploading(id);
    setError(null);
    try {
      await kycService.uploadDocument(type, file);
      await loadDocs();
    } catch (err: any) {
      console.error("Document upload failure:", err);
      setError(err.message || `Failed to upload document file.`);
    } finally {
      setUploading(null);
    }
  };

  const allApproved = Object.values(docs).every((d) => d.status === "approved");
  const uploadedCount = Object.values(docs).filter((d) => d.status !== "not_uploaded").length;
  const approvedCount = Object.values(docs).filter((d) => d.status === "approved").length;

  const getStatusColor = (status: DocState["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-400";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-cream-400";
    }
  };

  const getStatusBadge = (status: DocState["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-sans text-xs font-bold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-sans text-xs font-bold text-yellow-700">
            <Clock className="h-3.5 w-3.5" /> Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 font-sans text-xs font-bold text-red-600">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-cream-200 px-3 py-1 font-sans text-xs font-bold text-muted-foreground">
            Not Uploaded
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="h-8 w-48 rounded bg-cream-200 animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded bg-cream-200 animate-pulse" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full rounded-2xl bg-cream-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal text-charcoal">
              KYC & Compliance
            </h1>
            <p className="mt-2 font-sans text-base text-muted-foreground">
              Upload your documents to get verified and start earning.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDocs}
            className="text-muted-foreground hover:text-charcoal"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-sm flex-1">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-600 hover:bg-red-100"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-6 flex items-center gap-2">
          {docSlots.map((slot) => (
            <div key={slot.id} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-colors ${getStatusColor(
                  docs[slot.id].status
                )}`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 font-sans text-xs text-muted-foreground text-center">
          {approvedCount}/3 documents approved
        </p>

        <div className="mt-6 space-y-4">
          {docSlots.map((slot, i) => {
            const Icon = slot.icon;
            const docState = docs[slot.id];
            return (
              <Card
                key={slot.id}
                className="rounded-2xl border-gray-200 bg-white shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${
                        docState.status === "approved"
                          ? "bg-green-100"
                          : "bg-cream-200"
                      }`}
                    >
                      {docState.status === "approved" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-sans text-base font-bold text-charcoal">
                          {slot.label}
                        </h3>
                        {getStatusBadge(docState.status)}
                      </div>
                      <p className="mt-1 font-sans text-sm text-muted-foreground">
                        {slot.description}
                      </p>

                      {/* Rejection reason */}
                      {docState.status === "rejected" && docState.rejectionReason && (
                        <div className="mt-2 rounded-lg bg-red-50 p-2.5 border border-red-100">
                          <p className="font-sans text-xs text-red-600">
                            <strong>Reason:</strong> {docState.rejectionReason}
                          </p>
                        </div>
                      )}

                      {/* File Upload Selector */}
                      {(docState.status === "not_uploaded" || docState.status === "rejected") && (
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="file"
                            id={`file-${slot.id}`}
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUpload(slot.id, slot.type, file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-${slot.id}`}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 font-sans text-xs font-bold text-white hover:bg-gray-800 transition-colors"
                          >
                            <UploadIcon className="h-4 w-4" />
                            {docState.status === "rejected" ? "Re-upload File" : "Choose File"}
                          </label>
                          {uploading === slot.id && (
                            <span className="font-sans text-xs text-muted-foreground animate-pulse">
                              Uploading file...
                            </span>
                          )}
                        </div>
                      )}

                      {/* Display uploaded filename */}
                      {(docState.status === "pending" || docState.status === "approved") && docState.fileName && (
                        <p className="mt-2 font-sans text-xs text-muted-foreground truncate bg-white p-2 rounded-lg border border-cream-200">
                          File: {docState.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cannot go online warning */}
        {!allApproved && uploadedCount > 0 && (
          <div className="mt-6 rounded-2xl bg-yellow-50 p-4 flex items-start gap-3 border border-yellow-200 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-sm font-bold text-yellow-800">
                Cannot go online yet
              </p>
              <p className="font-sans text-xs text-yellow-700 mt-1">
                All three documents must be approved before you can go online and accept rides.
              </p>
            </div>
          </div>
        )}

        {allApproved && (
          <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center border border-green-200 animate-fade-up">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
            <h3 className="mt-3 font-serif text-xl font-normal text-charcoal">
              All Documents Verified!
            </h3>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              You're ready to go online and start accepting rides.
            </p>
            <Button
              onClick={() => navigate("/driver")}
              className="mt-4 rounded-2xl bg-black px-6 py-3 font-sans text-sm font-bold text-white hover:bg-gray-800"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DriverKYC;
