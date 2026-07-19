import { useMemo, useState, useEffect } from "react";
import { Search as SearchIcon, Ban as BanIcon, CircleCheck as CheckCircle2, Users as UsersIcon, Car as CarIcon, Zap as ZapIcon, Shield as ShieldIcon, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { adminService } from "../../services/admin.service";
import { User, Role } from "../../types";

type Filter = "all" | "rider" | "driver";

export const AdminUserManagement = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch users based on filter role
      const roleParam = filter === "all" ? undefined : (filter === "rider" ? "RIDER" : "DRIVER") as Role;
      const res = await adminService.getUsers(roleParam);
      setUsers(res.users || []);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setError(err.message || "Failed to load users list. Showing offline simulation.");
      // Fallbacks
      setUsers([
        { id: "u1", email: "alex@swiftride.app", phone: "+15550192", role: "RIDER", isBanned: false, createdAt: "", updatedAt: "" },
        { id: "u2", email: "jordan@swiftride.app", phone: "+15550187", role: "DRIVER", isBanned: false, createdAt: "", updatedAt: "" },
        { id: "u4", email: "dan@swiftride.app", phone: "+15550143", role: "DRIVER", isBanned: true, createdAt: "", updatedAt: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const toggleBan = async (user: User) => {
    setActionLoading(user.id);
    setError(null);
    try {
      if (user.isBanned) {
        await adminService.unbanUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isBanned: false } : u))
        );
      } else {
        await adminService.banUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isBanned: true } : u))
        );
      }
    } catch (err: any) {
      console.error("Ban/Unban failed:", err);
      setError(err.message || "Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (search && !u.email.toLowerCase().includes(search.toLowerCase()) && !u.phone.includes(search))
          return false;
        return true;
      }),
    [users, search]
  );

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl font-normal text-charcoal">User Management</h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">Manage riders and drivers, ban or unban accounts.</p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-sans text-sm">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <UsersIcon className="h-6 w-6 text-sage-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">{users.length}</p>
            <p className="font-sans text-xs text-muted-foreground">Filtered Users</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <ZapIcon className="h-6 w-6 text-terracotta-500" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">
              {users.filter((u) => u.role === "RIDER").length}
            </p>
            <p className="font-sans text-xs text-muted-foreground">Riders</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CarIcon className="h-6 w-6 text-charcoal" />
            <p className="mt-2 font-serif text-2xl font-normal text-charcoal">
              {users.filter((u) => u.role === "DRIVER").length}
            </p>
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
              placeholder="Search by email or phone..."
              className="h-10 flex-1 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "rider", "driver"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 font-sans text-sm font-bold capitalize transition-colors ${
                  filter === f ? "bg-black text-white" : "bg-cream-200 text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* User table */}
        <Card className="mt-4 overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-cream-200">
                  <th className="px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">User Email</th>
                  <th className="px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</th>
                  <th className="hidden px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">Role</th>
                  <th className="px-5 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <div className="h-8 w-full rounded-lg skeleton" />
                        <div className="h-8 w-full rounded-lg skeleton" />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const status = user.isBanned ? "banned" : "active";
                    return (
                      <tr key={user.id} className="border-b border-gray-200 last:border-0">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-white">
                              {user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-sans text-sm font-bold text-charcoal">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-sans text-sm text-muted-foreground">{user.phone}</td>
                        <td className="hidden px-5 py-4 sm:table-cell">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-bold ${
                            user.role === "RIDER" ? "bg-black/10 text-sage-500" : "bg-terracotta-500/10 text-terracotta-600"
                          }`}>
                            {user.role === "RIDER" ? <ZapIcon className="h-3 w-3" /> : <CarIcon className="h-3 w-3" />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 font-sans text-xs font-bold ${
                            status === "active" ? "bg-black/10 text-sage-500" : "bg-red-50 text-red-600"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            onClick={() => toggleBan(user)}
                            disabled={actionLoading === user.id}
                            variant="outline"
                            size="sm"
                            className={`rounded-lg font-sans text-xs font-bold ${
                              status === "active"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-sage-500/30 text-sage-500 hover:bg-black/5"
                            }`}
                          >
                            {actionLoading === user.id ? (
                              "Updating..."
                            ) : status === "active" ? (
                              <><BanIcon className="h-3.5 w-3.5" /> Ban</>
                            ) : (
                              <><CheckCircle2 className="h-3.5 w-3.5" /> Unban</>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default AdminUserManagement;
