import { useState } from "react";
import { DollarSign as DollarSignIcon, Car as CarIcon, Clock as ClockIcon, TrendingUp as TrendingUpIcon } from "lucide-react";
import { StatCard } from "../../components/RideDetailCard";
import { Card, CardContent } from "../../components/ui/card";

const weeklyData = [
  { day: "Mon", earnings: 142 },
  { day: "Tue", earnings: 186 },
  { day: "Wed", earnings: 98 },
  { day: "Thu", earnings: 210 },
  { day: "Fri", earnings: 245 },
  { day: "Sat", earnings: 188 },
  { day: "Sun", earnings: 120 },
];

const recentPayouts = [
  { id: "p1", date: "Jul 14, 2026", amount: "$184.50", trips: 8 },
  { id: "p2", date: "Jul 13, 2026", amount: "$210.00", trips: 9 },
  { id: "p3", date: "Jul 12, 2026", amount: "$156.50", trips: 7 },
];

export const DriverEarnings = () => {
  const [period, setPeriod] = useState<"daily" | "weekly">("weekly");

  const maxEarning = Math.max(...weeklyData.map((d) => d.earnings));
  const totalWeek = weeklyData.reduce((sum, d) => sum + d.earnings, 0);

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">Earnings Dashboard</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Track your daily and weekly performance.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="This Week" value={`$${totalWeek}`} icon={DollarSignIcon} accent="sage" sublabel="42 trips" />
          <StatCard label="Today" value="$184.50" icon={TrendingUpIcon} accent="terracotta" sublabel="8 trips" />
          <StatCard label="Avg / Trip" value="$23.20" icon={CarIcon} accent="charcoal" />
          <StatCard label="Hours Online" value="38.5h" icon={ClockIcon} accent="sage" />
        </div>

        {/* Period toggle */}
        <div className="mt-6 flex gap-2">
          {(["daily", "weekly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-5 py-2 font-sans text-sm font-bold capitalize transition-colors ${
                period === p ? "bg-sage-500 text-white" : "bg-cream-200 text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chart */}
        <Card className="mt-4 rounded-2xl border-cream-300 bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-sans text-sm font-bold text-charcoal">
              {period === "weekly" ? "Weekly Earnings" : "Today's Hourly Earnings"}
            </h3>
            <div className="mt-6 flex items-end justify-between gap-2" style={{ height: "200px" }}>
              {weeklyData.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-sans text-xs font-bold text-muted-foreground">${d.earnings}</span>
                  <div
                    className="w-full rounded-t-lg bg-sage-500 transition-all duration-500 animate-fade-up"
                    style={{
                      height: `${(d.earnings / maxEarning) * 140}px`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                  <span className="font-sans text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent payouts */}
        <h2 className="mt-8 font-serif text-xl font-normal text-charcoal">Recent Daily Totals</h2>
        <div className="mt-4 space-y-3">
          {recentPayouts.map((payout) => (
            <Card key={payout.id} className="rounded-2xl border-cream-300 bg-white shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="font-sans text-sm font-bold text-charcoal">{payout.date}</p>
                  <p className="font-sans text-xs text-muted-foreground">{payout.trips} trips</p>
                </div>
                <span className="font-sans text-lg font-bold text-sage-500">{payout.amount}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
