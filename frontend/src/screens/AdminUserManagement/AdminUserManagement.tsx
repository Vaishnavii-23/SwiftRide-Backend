import { useMemo, useState } from "react";
import { Search as SearchIcon, Ban as BanIcon, CircleCheck as CheckCircle2, Users as UsersIcon, Car as CarIcon, Zap as ZapIcon, Shield as ShieldIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "rider" | "driver";
  status: "active" | "banned";
  trips: number;
  rating: number;
  joined: string;
}

const users: UserRow[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@swiftride.app", role: "rider", status: "active", trips: 47, rating: 4.9, joined: "Jan 2026" },
  { id: "u2", name: "Jordan Blake", email: "jordan@swiftride.app", role: "driver", status: "active", trips: 312, rating: 4.8, joined: "Nov 2025" },
  { id: "u3", name: "Maya Chen", email: "maya@swiftride.app", role: "rider", status: "active", trips: 23, rating: 4.7, joined: "Mar 2026" },
  { id: "u4", name: "Daniel Okafor", email: "dan@swiftride.app", role: "driver", status: "banned", trips: 89, rating: 3.2, joined: "Dec 2025" },
  { id: "u5", name: "Priya Sharma", email: "priya@swiftride.app", role: "rider", status: "active", trips: 156, rating: 5.0, joined: "Oct 2025" },
  { id: "u6", name: "Liam Murphy", email: "liam@swiftride.app", role: "driver", status: "active", trips: 201, rating: 4.9, joined: "Sep 2025" },
];

type Filter = "all" | "rider" | "driver";

export const AdminUserManagement = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [userStates, setUserStates] = useState<Record<string, "active" | "banned">>(
    Object.fromEntries(users.map((u) => [u.id, u.status])),
  );

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (filter !== "all" && u.role !== filter) return false;
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      }),
    [filter, search],
  );

  const toggleBan = (id: string) => {
    setUserStates((prev) => ({
      ...prev,
      [id]: prev[id] === "active" ? "banned" : "active",
    }));
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">User Management</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Manage riders and drivers, ban or unban accounts.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <UsersIcon className="h-6 w-6 text-sage-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{users.length}</p>
            <p className="font-sans text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ZapIcon className="h-6 w-6 text-terracotta-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{users.filter((u) => u.role === "rider").length}</p>
            <p className="font-sans text-xs text-muted-foreground">Riders</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CarIcon className="h-6 w-6 text-charcoal" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{users.filter((u) => u.role === "driver").length}</p>
            <p className="font-sans text-xs text-muted-foreground">Drivers</p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-cream-400 bg-white px-3 shadow-sm">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="h-10 flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "rider", "driver"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 font-sans text-sm font-bold capitalize transition-colors ${
                  filter === f ? "bg-sage-500 text-white" : "bg-cream-200 text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* User table */}
        <Card className="mt-4 overflow-hidden rounded-2xl border-cream-300 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-300 bg-cream-200">
                  <th className="px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="hidden px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">Role</th>
                  <th className="hidden px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Trips</th>
                  <th className="hidden px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Rating</th>
                  <th className="px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const status = userStates[user.id];
                  return (
                    <tr key={user.id} className="border-b border-cream-300 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-sans text-sm font-bold text-charcoal">{user.name}</p>
                            <p className="font-sans text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-bold ${
                          user.role === "rider" ? "bg-sage-500/10 text-sage-500" : "bg-terracotta-500/10 text-terracotta-600"
                        }`}>
                          {user.role === "rider" ? <ZapIcon className="h-3 w-3" /> : <CarIcon className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden px-5 py-4 font-sans text-sm text-muted-foreground md:table-cell">{user.trips}</td>
                      <td className="hidden px-5 py-4 font-sans text-sm text-muted-foreground md:table-cell">{user.rating} ★</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 font-sans text-xs font-bold ${
                          status === "active" ? "bg-sage-500/10 text-sage-500" : "bg-red-50 text-red-600"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          onClick={() => toggleBan(user.id)}
                          variant="outline"
                          size="sm"
                          className={`rounded-lg font-sans text-xs font-bold ${
                            status === "active"
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-sage-500/30 text-sage-500 hover:bg-sage-500/5"
                          }`}
                        >
                          {status === "active" ? (
                            <><BanIcon className="h-3.5 w-3.5" /> Ban</>
                          ) : (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> Unban</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
