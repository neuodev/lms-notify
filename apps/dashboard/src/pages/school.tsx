import { useSchool } from "@/hooks/use-schools";
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
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Key,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";

const SchoolDetail = () => {
  const params = useParams();
  const id = params?.id || "";
  const { data, isLoading } = useSchool(id);

  const school = data?.data;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  console.log({ school, data, isLoading });

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
  logs.forEach((l) => {
    if (l.status === "SENT") totalSuccess++;
    else totalFailed++;
  });

  const sessions = school.activeSessions;

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
        <Card className="shadow-sm border-border/50 bg-linear-to-br from-card to-primary/5">
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

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

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
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 50).map((log) => (
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
                            {log.status}
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
                    {sessions.map((session, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">
                          {session || "Unknown"}
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
};

export default SchoolDetail;
