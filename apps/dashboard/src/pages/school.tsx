import { useRoute } from "wouter";
import { useSchool, useSchoolMonthly } from "@/hooks/use-schools";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Key,
  BarChart3,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function SchoolDetail() {
  const [, params] = useRoute("/schools/:id");
  const id = params?.id || "";
  const { data: school, isLoading } = useSchool(id);
  const { data: monthlyData, isLoading: isMonthlyLoading } =
    useSchoolMonthly(id);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">School Not Found</h2>
        <Link href="/schools">
          <Button className="mt-4">Back to Schools</Button>
        </Link>
      </div>
    );
  }

  const logs = school.messageLogs || [];
  let totalSuccess = 0;
  let totalFailed = 0;
  logs.forEach((l: any) => {
    totalSuccess += l.successCount || 0;
    totalFailed += l.failedCount || 0;
  });

  const sessions = school.activeSessions || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/schools">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            {school.name}
            <Badge variant="secondary" className="text-sm font-medium">
              {school.lmsType}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Registered {format(new Date(school.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/50 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> System ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs p-2 bg-background border rounded-md break-all">
              {school.id}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-emerald-600">
              {totalSuccess}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" /> Total Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-red-600">
              {totalFailed}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="analytics">Monthly Data</TabsTrigger>
          <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Monthly Performance
              </CardTitle>
              <CardDescription>
                Message delivery trends over the last few months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMonthlyLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : monthlyData && monthlyData.length > 0 ? (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="success"
                        name="Success"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="failed"
                        name="Failed"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                  No monthly data available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Message Logs</CardTitle>
              <CardDescription>
                Recent message delivery attempts for this school.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                  No logs recorded yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Message Preview</TableHead>
                      <TableHead>Success</TableHead>
                      <TableHead>Failed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 50).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.recipient}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {log.message}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                            {log.successCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="destructive"
                            className="bg-red-500/10 text-red-600 border-red-200"
                          >
                            {log.failedCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Active WhatsApp Sessions</CardTitle>
              <CardDescription>
                Currently authenticated sending sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                  No active sessions found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">
                          {session.id || "Unknown"}
                        </TableCell>
                        <TableCell>Now</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Connected</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
