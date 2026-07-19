import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, ShieldAlert } from "lucide-react";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        navigate("/admin");
      } else {
        setError("Unauthorized access. Admin privileges required.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 py-16 sm:px-6">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border-none shadow-2xl animate-scale-in">
        <div className="bg-sage-600 p-6 text-center">
          <LayoutDashboard className="mx-auto h-12 w-12 text-black opacity-90" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-black">Admin Portal</h2>
          <p className="mt-1 font-sans text-sm text-sage-100">Sign in to manage SwiftRide operations</p>
        </div>

        <CardContent className="bg-white p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span className="font-sans text-sm font-semibold">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swiftride.app"
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 font-sans text-sm text-charcoal outline-none focus:border-sage-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 font-sans text-sm text-charcoal outline-none focus:border-sage-500 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-4 h-auto w-full rounded-xl bg-black py-4 font-sans text-base font-bold text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access System"}
              {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
