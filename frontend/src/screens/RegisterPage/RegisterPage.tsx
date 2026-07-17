import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap as ZapIcon, Shield as ShieldIcon, ArrowRight, CircleCheck as CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth, type Role } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

// Backend roles are uppercase enums matching Prisma schema
const roleOptions: { value: Role; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: "RIDER", label: "Rider", icon: ZapIcon, description: "Book rides and track trips" },
  { value: "DRIVER", label: "Driver", icon: ShieldIcon, description: "Earn and manage your fleet" },
];

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("RIDER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend register: POST /api/auth/register { email, phone, password, role }
      await register(email, phone, password, role);
      // After successful registration, redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-normal text-charcoal">Create your account</h1>
        <p className="mt-3 font-sans text-base text-muted-foreground">
          Join SwiftRide and start riding smarter in under a minute.
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
              <label htmlFor="phone" className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1234567890"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-xl border border-cream-400 bg-cream-100 px-4 font-sans text-sm text-charcoal outline-none focus:border-sage-500 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="font-sans text-xs font-bold uppercase tracking-wider text-terracotta-600">
                I want to be a...
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors tap-scale ${
                        role === opt.value
                          ? "border-sage-500 bg-sage-500/5"
                          : "border-cream-400 bg-cream-100 hover:border-sage-500/40"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${role === opt.value ? "text-sage-500" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <span className={`font-sans text-sm font-bold ${role === opt.value ? "text-sage-500" : "text-charcoal"}`}>
                          {opt.label}
                        </span>
                        <p className="font-sans text-xs text-muted-foreground">{opt.description}</p>
                      </div>
                      {role === opt.value && <CheckCircle2 className="ml-auto h-5 w-5 text-sage-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !phone || !password}
              className="h-auto rounded-3xl bg-sage-500 py-4 font-sans text-base font-bold text-white shadow-lg hover:bg-sage-600 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-sage-500 hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
