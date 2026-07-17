import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star as StarIcon, CircleCheck as CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";

const tipAmounts = [2, 5, 10];
const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export const RiderTripCompletion = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center px-4 py-8 text-center animate-bounce-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-500 text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-normal text-charcoal">Trip Complete!</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Thanks for riding with SwiftRide. See you on your next trip!
        </p>
        <Button
          onClick={() => navigate("/rider")}
          className="mt-8 h-auto rounded-2xl bg-sage-500 px-8 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600"
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
        Riverside Park · 18 min · $24.50
      </p>

      {/* Driver */}
      <div className="mt-6 flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-xl font-bold text-white">
          JB
        </div>
        <p className="mt-3 font-sans text-base font-bold text-charcoal">Jordan Blake</p>
        <p className="font-sans text-xs text-muted-foreground">Silver Toyota Camry</p>

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
                  star <= rating ? "fill-terracotta-500 text-terracotta-500" : "text-cream-400"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-2 font-sans text-sm font-bold text-terracotta-600 animate-fade-in">
            {ratingLabels[rating]}
          </p>
        )}
      </div>

      {/* Tip */}
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <p className="font-sans text-sm font-bold text-charcoal">Add a tip</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {tipAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(tip === amount ? null : amount)}
              className={`rounded-xl border py-3 font-sans text-base font-bold transition-colors tap-scale ${
                tip === amount
                  ? "border-sage-500 bg-sage-500 text-white"
                  : "border-cream-400 bg-cream-100 text-charcoal hover:border-sage-500/40"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 rounded-2xl bg-cream-200 p-5">
        <div className="flex items-center justify-between font-sans text-sm text-muted-foreground">
          <span>Fare</span><span>$24.50</span>
        </div>
        {tip !== null && (
          <div className="mt-1 flex items-center justify-between font-sans text-sm text-muted-foreground">
            <span>Tip</span><span>${tip}.00</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-cream-400 pt-2 font-sans text-base font-bold text-charcoal">
          <span>Total</span><span>${(24.5 + (tip ?? 0)).toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={() => setSubmitted(true)}
        disabled={rating === 0}
        className="mt-5 h-auto w-full rounded-2xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600 disabled:opacity-50"
      >
        Submit & Pay
      </Button>
    </div>
  );
};
