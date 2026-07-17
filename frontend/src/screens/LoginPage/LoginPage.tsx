import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const LoginPage = () => {
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

      // Backend returns role as uppercase: RIDER, DRIVER, ADMIN
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        navigate("/admin");
      } else if (user.role === "DRIVER") {
        navigate("/driver");
      } else {
        navigate("/rider");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-normal text-charcoal">Welcome back</h1>
        <p className="mt-3 font-sans text-base text-muted-foreground">
          Log in to continue your SwiftRide journey.
        </p>
      </div>

      <Card className="w-full max-w-md rounded-2xl border-cream-300 bg-white shadow-md animate-scale-in">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-sans text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 w-full rounded-xl border border-cream-400 bg-cream-100 px-4 font-sans text-sm text-charcoal outline-none focus:border-sage-500 placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-xl border border-cream-400 bg-cream-100 px-4 font-sans text-sm text-charcoal outline-none focus:border-sage-500 placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 h-auto rounded-3xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-sage-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
