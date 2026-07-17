import { useState } from "react";
import { CircleCheck as CheckCircle2, Circle as XCircle, FileCheck as FileCheckIcon, IdCard as IdCardIcon, Car as CarIcon, Clock as ClockIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface KYCSubmission {
  id: string;
  driverName: string;
  email: string;
  submittedAt: string;
  documents: { label: string; icon: React.ComponentType<{ className?: string }>; status: "pending" | "approved" | "rejected" }[];
}

const submissions: KYCSubmission[] = [
  {
    id: "kyc1",
    driverName: "Jordan Blake",
    email: "jordan@swiftride.app",
    submittedAt: "2 hours ago",
    documents: [
      { label: "Driver's License", icon: IdCardIcon, status: "pending" },
      { label: "Vehicle Insurance", icon: FileCheckIcon, status: "pending" },
      { label: "Vehicle Registration", icon: CarIcon, status: "pending" },
    ],
  },
  {
    id: "kyc2",
    driverName: "Maya Chen",
    email: "maya@swiftride.app",
    submittedAt: "5 hours ago",
    documents: [
      { label: "Driver's License", icon: IdCardIcon, status: "pending" },
      { label: "Vehicle Insurance", icon: FileCheckIcon, status: "pending" },
      { label: "Vehicle Registration", icon: CarIcon, status: "pending" },
    ],
  },
  {
    id: "kyc3",
    driverName: "Liam Murphy",
    email: "liam@swiftride.app",
    submittedAt: "1 day ago",
    documents: [
      { label: "Driver's License", icon: IdCardIcon, status: "pending" },
      { label: "Vehicle Insurance", icon: FileCheckIcon, status: "pending" },
      { label: "Vehicle Registration", icon: CarIcon, status: "pending" },
    ],
  },
];

export const AdminKYCReview = () => {
  const [reviewed, setReviewed] = useState<Record<string, "approved" | "rejected">>({});

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setReviewed((prev) => ({ ...prev, [id]: action }));
  };

  const pending = submissions.filter((s) => !reviewed[s.id]);
  const processed = submissions.filter((s) => reviewed[s.id]);

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">KYC Review Queue</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Review and approve driver document submissions.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ClockIcon className="h-6 w-6 text-terracotta-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{pending.length}</p>
            <p className="font-sans text-xs text-muted-foreground">Pending Review</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CheckCircle2 className="h-6 w-6 text-sage-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">
              {Object.values(reviewed).filter((v) => v === "approved").length}
            </p>
            <p className="font-sans text-xs text-muted-foreground">Approved Today</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <XCircle className="h-6 w-6 text-red-600" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">
              {Object.values(reviewed).filter((v) => v === "rejected").length}
            </p>
            <p className="font-sans text-xs text-muted-foreground">Rejected Today</p>
          </div>
        </div>

        {/* Pending queue */}
        {pending.length > 0 && (
          <>
            <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Pending Submissions</h2>
            <div className="mt-4 space-y-4">
              {pending.map((sub, i) => (
                <Card
                  key={sub.id}
                  className="rounded-2xl border-cream-300 bg-white shadow-sm animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-sm font-bold text-white">
                          {sub.driverName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-sans text-base font-bold text-charcoal">{sub.driverName}</p>
                          <p className="font-sans text-xs text-muted-foreground">{sub.email} · Submitted {sub.submittedAt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {sub.documents.map((doc) => {
                        const Icon = doc.icon;
                        return (
                          <div key={doc.label} className="flex items-center gap-2 rounded-xl bg-cream-200 p-3">
                            <Icon className="h-5 w-5 text-sage-500" />
                            <span className="font-sans text-xs font-bold text-charcoal">{doc.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        onClick={() => handleAction(sub.id, "approved")}
                        className="flex-1 rounded-xl bg-sage-500 py-3 font-sans text-sm font-bold text-white hover:bg-sage-600"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        onClick={() => handleAction(sub.id, "rejected")}
                        variant="outline"
                        className="flex-1 rounded-xl border-red-200 py-3 font-sans text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Processed */}
        {processed.length > 0 && (
          <>
            <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Recently Processed</h2>
            <div className="mt-4 space-y-3">
              {processed.map((sub) => (
                <Card key={sub.id} className="rounded-2xl border-cream-300 bg-white shadow-sm opacity-70">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
                        {sub.driverName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="font-sans text-sm font-bold text-charcoal">{sub.driverName}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-bold ${
                      reviewed[sub.id] === "approved" ? "bg-sage-500/10 text-sage-500" : "bg-red-50 text-red-600"
                    }`}>
                      {reviewed[sub.id] === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {reviewed[sub.id]}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {pending.length === 0 && processed.length === 0 && (
          <div className="mt-8 text-center font-sans text-sm text-muted-foreground">
            No KYC submissions to review.
          </div>
        )}
      </div>
    </div>
  );
};
