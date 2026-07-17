import { DollarSign as DollarSignIcon, Users as UsersIcon, Car as CarIcon, TrendingUp as TrendingUpIcon, Shield as ShieldIcon } from "lucide-react";
import { StatCard } from "../../components/RideDetailCard";
import { Card, CardContent } from "../../components/ui/card";

const revenueData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 67 },
  { month: "May", value: 72 },
  { month: "Jun", value: 89 },
  { month: "Jul", value: 95 },
];

const recentActivity = [
  { id: "a1", type: "New driver registration", user: "Jordan Blake", time: "2 min ago", status: "pending" },
  { id: "a2", type: "Ride completed", user: "Alex Rivera", time: "5 min ago", status: "completed" },
  { id: "a3", type: "KYC submitted", user: "Maya Chen", time: "12 min ago", status: "pending" },
  { id: "a4", type: "User reported", user: "Unknown", time: "18 min ago", status: "flagged" },
  { id: "a5", type: "Payout processed", user: "Driver #4821", time: "25 min ago", status: "completed" },
];

const statusColors: Record<string, string> = {
  pending: "bg-terracotta-500/10 text-terracotta-600",
  completed: "bg-sage-500/10 text-sage-500",
  flagged: "bg-red-50 text-red-600",
};

export const AdminDashboard = () => {
  const maxValue = Math.max(...revenueData.map((d) => d.value));

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">Admin Dashboard</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Platform overview and real-time metrics.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Revenue (MTD)" value="$95.2K" icon={DollarSignIcon} accent="sage" sublabel="+12% vs last month" />
          <StatCard label="Active Drivers" value="1,247" icon={CarIcon} accent="terracotta" sublabel="89% online now" />
          <StatCard label="Active Riders" value="8,432" icon={UsersIcon} accent="charcoal" sublabel="+340 this week" />
          <StatCard label="Avg Safety Score" value="92" icon={ShieldIcon} accent="sage" sublabel="Across all routes" />
        </div>

        {/* Revenue chart */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-cream-300 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-sm font-bold text-charcoal">Revenue Trend</h3>
                <TrendingUpIcon className="h-5 w-5 text-sage-500" />
              </div>
              <div className="mt-6 flex items-end justify-between gap-3" style={{ height: "180px" }}>
                {revenueData.map((d, i) => (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-sage-500 transition-all duration-500 animate-fade-up"
                      style={{
                        height: `${(d.value / maxValue) * 120}px`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                    <span className="font-sans text-xs text-muted-foreground">{d.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="rounded-2xl border-cream-300 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-sans text-sm font-bold text-charcoal">Recent Activity</h3>
              <div className="mt-4 space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-bold text-charcoal">{activity.type}</p>
                      <p className="font-sans text-xs text-muted-foreground">{activity.user} · {activity.time}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 font-sans text-xs font-bold capitalize ${statusColors[activity.status]}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick metrics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Rides Today</p>
            <p className="mt-2 font-serif text-3xl font-normal text-charcoal">3,847</p>
            <p className="mt-1 font-sans text-xs text-sage-500">+8% vs yesterday</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Wait Time</p>
            <p className="mt-2 font-serif text-3xl font-normal text-charcoal">3.2 min</p>
            <p className="mt-1 font-sans text-xs text-sage-500">-0.4 min improvement</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Completion Rate</p>
            <p className="mt-2 font-serif text-3xl font-normal text-charcoal">97.8%</p>
            <p className="mt-1 font-sans text-xs text-sage-500">+0.3% this week</p>
          </div>
        </div>
      </div>
    </div>
  );
};
