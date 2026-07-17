import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck as FileCheckIcon, Car as CarIcon, IdCard as IdCardIcon, CircleCheck as CheckCircle2, Upload as UploadIcon, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type DocStatus = "pending" | "uploaded" | "verified";

const docSteps = [
  { id: "license", label: "Driver's License", icon: IdCardIcon, description: "Upload a clear photo of your valid driver's license." },
  { id: "insurance", label: "Vehicle Insurance", icon: FileCheckIcon, description: "Proof of current vehicle insurance coverage." },
  { id: "registration", label: "Vehicle Registration", icon: CarIcon, description: "Your vehicle's registration document." },
];

export const DriverKYC = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, DocStatus>>({
    license: "pending",
    insurance: "pending",
    registration: "pending",
  });

  const allVerified = Object.values(statuses).every((s) => s === "verified");

  const handleUpload = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "uploaded" }));
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: "verified" }));
    }, 1500);
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">KYC & Compliance</h1>
        <p className="mt-2 font-sans text-base text-muted-foreground">
          Upload your documents to get verified and start earning.
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex items-center gap-2">
          {docSteps.map((step, i) => (
            <div key={step.id} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-colors ${
                  statuses[step.id] === "verified" ? "bg-sage-500" : statuses[step.id] === "uploaded" ? "bg-terracotta-400" : "bg-cream-400"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {docSteps.map((step, i) => {
            const Icon = step.icon;
            const status = statuses[step.id];
            return (
              <Card
                key={step.id}
                className="rounded-2xl border-cream-300 bg-white shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      status === "verified" ? "bg-sage-500/10" : "bg-cream-200"
                    }`}
                  >
                    {status === "verified" ? (
                      <CheckCircle2 className="h-6 w-6 text-sage-500" />
                    ) : (
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-base font-bold text-charcoal">{step.label}</h3>
                    <p className="font-sans text-sm text-muted-foreground">{step.description}</p>
                    {status === "uploaded" && (
                      <p className="mt-1 font-sans text-xs font-bold text-terracotta-600 animate-fade-in">
                        Verifying...
                      </p>
                    )}
                  </div>
                  {status === "verified" ? (
                    <span className="rounded-full bg-sage-500/10 px-3 py-1 font-sans text-xs font-bold text-sage-500">
                      Verified
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleUpload(step.id)}
                      size="sm"
                      className="rounded-xl bg-sage-500 px-4 font-sans text-xs font-bold text-white hover:bg-sage-600"
                    >
                      <UploadIcon className="h-3.5 w-3.5" /> Upload
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {allVerified && (
          <div className="mt-6 rounded-2xl bg-sage-500/5 p-6 text-center animate-bounce-in">
            <CheckCircle2 className="mx-auto h-10 w-10 text-sage-500" />
            <h3 className="mt-3 font-serif text-xl font-normal text-charcoal">All Documents Verified!</h3>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              You're ready to go online and start accepting rides.
            </p>
            <Button
              onClick={() => navigate("/driver")}
              className="mt-4 rounded-2xl bg-sage-500 px-6 py-3 font-sans text-sm font-bold text-white hover:bg-sage-600"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
