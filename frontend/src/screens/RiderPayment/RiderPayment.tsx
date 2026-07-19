import { useState } from "react";
import { CreditCard as CardIcon, DollarSign as DollarIcon, Landmark as BankIcon, Plus as PlusIcon, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const RiderPayment = () => {
  const [walletBalance, setWalletBalance] = useState(150.00);
  const [selectedMethod, setSelectedMethod] = useState("card-1");
  const [addCardMode, setAddCardMode] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Card stub successfully linked!");
    setAddCardMode(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  };

  const handleAddFunds = () => {
    const amount = prompt("Enter amount to add to wallet ($):", "25");
    const num = parseFloat(amount || "");
    if (!isNaN(num) && num > 0) {
      setWalletBalance((b) => b + num);
      alert(`Successfully added $${num.toFixed(2)} to wallet!`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 w-full">
      <h1 className="font-serif text-2xl font-normal text-charcoal">Payment & Wallet</h1>
      <p className="mt-1 font-sans text-sm text-muted-foreground">Manage your payment methods and SwiftRide wallet.</p>

      {/* Wallet Balance */}
      <Card className="mt-6 rounded-2xl border-sage-500/30 bg-black/5 shadow-none">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Wallet Balance
            </span>
            <span className="font-serif text-3xl font-normal text-charcoal block mt-1">
              ${walletBalance.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={handleAddFunds}
            className="rounded-xl bg-black font-sans text-xs font-bold text-white hover:bg-gray-900 shadow-sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" /> Add Funds
          </Button>
        </CardContent>
      </Card>

      {/* Saved payment options */}
      <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Saved Payment Methods</h2>
      <div className="mt-4 space-y-3">
        <button
          onClick={() => setSelectedMethod("wallet")}
          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors tap-scale bg-white ${
            selectedMethod === "wallet" ? "border-sage-500" : "border-gray-200 hover:border-sage-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <DollarIcon className="h-5 w-5 text-sage-500" />
            <div>
              <p className="font-sans text-sm font-bold text-charcoal">SwiftRide Wallet</p>
              <p className="font-sans text-xs text-muted-foreground">Pay with balance (${walletBalance.toFixed(2)})</p>
            </div>
          </div>
          {selectedMethod === "wallet" && <CheckCircle2 className="h-5 w-5 text-sage-500" />}
        </button>

        <button
          onClick={() => setSelectedMethod("card-1")}
          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors tap-scale bg-white ${
            selectedMethod === "card-1" ? "border-sage-500" : "border-gray-200 hover:border-sage-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <CardIcon className="h-5 w-5 text-sage-500" />
            <div>
              <p className="font-sans text-sm font-bold text-charcoal">Visa ending in 4242</p>
              <p className="font-sans text-xs text-muted-foreground">Expires 12/28</p>
            </div>
          </div>
          {selectedMethod === "card-1" && <CheckCircle2 className="h-5 w-5 text-sage-500" />}
        </button>

        <button
          onClick={() => setSelectedMethod("bank")}
          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors tap-scale bg-white ${
            selectedMethod === "bank" ? "border-sage-500" : "border-gray-200 hover:border-sage-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <BankIcon className="h-5 w-5 text-sage-500" />
            <div>
              <p className="font-sans text-sm font-bold text-charcoal">Chase Checking Bank Account</p>
              <p className="font-sans text-xs text-muted-foreground">Direct Bank Transfer</p>
            </div>
          </div>
          {selectedMethod === "bank" && <CheckCircle2 className="h-5 w-5 text-sage-500" />}
        </button>
      </div>

      {addCardMode ? (
        <Card className="mt-6 rounded-2xl border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">Card Number</label>
              <input
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4000 1234 5678 9010"
                className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 font-sans text-sm outline-none focus:border-gray-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">Expiry Date</label>
                <input
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 font-sans text-sm outline-none focus:border-gray-500"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">CVV</label>
                <input
                  required
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-4 font-sans text-sm outline-none focus:border-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-900 rounded-xl py-3 font-sans text-sm font-bold">
                Link Card
              </Button>
              <Button type="button" onClick={() => setAddCardMode(false)} variant="outline" className="flex-1 rounded-xl py-3 border-cream-400 font-sans text-sm font-bold">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button
          onClick={() => setAddCardMode(true)}
          variant="outline"
          className="mt-6 h-auto w-full rounded-2xl border-cream-400 py-4 font-sans text-base font-bold text-sage-500 hover:bg-cream-200"
        >
          <PlusIcon className="h-5 w-5 mr-1" /> Add Payment Method
        </Button>
      )}
    </div>
  );
};
export default RiderPayment;
