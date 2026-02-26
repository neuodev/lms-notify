import { useDashboardStats } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MessageSquare,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  const stats = data?.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time metrics for your LMS integrations.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Schools"
          value={stats?.schoolsCount}
          icon={Building2}
          isLoading={isLoading}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard
          title="Messages Sent"
          value={stats?.messagesCount}
          icon={MessageSquare}
          isLoading={isLoading}
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate}%`}
          icon={CheckCircle2}
          isLoading={isLoading}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessionsCount}
          icon={Activity}
          isLoading={isLoading}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              Message Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorMessages"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group hover-elevate">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold group-hover:text-primary transition-colors">
                  Add New School
                </h4>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">
                Onboard a new LMS integration client.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
  color,
  bg,
}: {
  title: string;
  value?: number | string;
  icon: React.ElementType;
  isLoading: boolean;
  color: string;
  bg: string;
}) {
  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <h3 className="text-3xl font-display font-bold text-foreground">
              {value}
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
