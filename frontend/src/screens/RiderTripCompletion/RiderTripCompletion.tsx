import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star as StarIcon, CircleCheck as CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ratingService } from "../../services/rating.service";

const tipAmounts = [20, 50, 100];
const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export const RiderTripCompletion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rideId = location.state?.rideId;
  const fare = Number(location.state?.fare || 180);
  const distance = location.state?.distance || 12.4;
  const destination = location.state?.destination || "Dropoff Destination";
  const driverName = location.state?.driverName || "Driver Partner";
  const vehicleInfo = location.state?.vehicleInfo || "SwiftRide Partner Car";

  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rideId) {
      setError("No ride session found to submit a rating.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await ratingService.submitRating({
        rideId,
        score: rating,
        comment: `Excellent ride. Tip added: ₹${tip ?? 0}`,
        safetyScore: rating * 20 // Map 0-5 scale to 0-100 scale for safetyScore
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit rating:", err);
      setError(err.message || "Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center px-4 py-8 text-center animate-fade-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">Trip Complete!</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Thanks for riding with SwiftRide. See you on your next trip!
        </p>
        <Button
          onClick={() => navigate("/rider")}
          className="mt-8 h-12 rounded-xl bg-black px-8 font-sans text-base font-bold text-white shadow-lg hover:bg-gray-800"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-serif text-2xl font-normal text-charcoal">Rate Your Trip</h1>
      <p className="mt-1 font-sans text-sm text-muted-foreground">
        {destination.split(',')[0]} · {distance} km · ₹{fare}
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-red-600 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-sans text-sm">{error}</span>
        </div>
      )}

      {/* Driver */}
      <div className="mt-6 flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-bold text-white">
          {driverName.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <p className="mt-3 font-sans text-base font-bold text-charcoal">{driverName}</p>
        <p className="font-sans text-xs text-muted-foreground">{vehicleInfo}</p>

        {/* Stars */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="tap-scale"
            >
              <StarIcon
                className={`h-8 w-8 transition-colors ${
                  star <= rating ? "fill-yellow-500 text-yellow-500" : "text-cream-400"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-2 font-sans text-sm font-bold text-charcoal animate-fade-in">
            {ratingLabels[rating]}
          </p>
        )}
      </div>

      {/* Tip */}
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <p className="font-sans text-sm font-bold text-charcoal">Add a tip</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {tipAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(tip === amount ? null : amount)}
              className={`rounded-xl border py-3 font-sans text-base font-bold transition-all duration-200 tap-scale ${
                tip === amount
                  ? "border-black bg-black text-white"
                  : "border-cream-400 bg-white text-charcoal hover:bg-cream-200"
              }`}
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between font-sans text-sm text-muted-foreground">
          <span>Fare</span><span>₹{fare}</span>
        </div>
        {tip !== null && (
          <div className="mt-1 flex items-center justify-between font-sans text-sm text-muted-foreground">
            <span>Tip</span><span>₹{tip}</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 font-sans text-base font-bold text-charcoal">
          <span>Total</span><span>₹{fare + (tip ?? 0)}</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || loading}
        className="mt-5 h-12 w-full rounded-xl bg-black text-white font-sans text-base font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Submitting...
          </span>
        ) : (
          "Submit & Pay"
        )}
      </Button>
    </div>
  );
};
export default RiderTripCompletion;
