import { useState } from "react";
import { useLogs } from "@/hooks/use-logs";
import { useSchools } from "@/hooks/use-schools";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Logs() {
  const [filters, setFilters] = useState({
    schoolId: "ALL",
  });

  const { data: schoolsData } = useSchools();
  const schools = schoolsData?.data.schools;
  const {
    data: logsData,
    isLoading,
    refetch,
  } = useLogs(
    filters.schoolId !== "ALL"
      ? {
          schoolId: filters.schoolId !== "ALL" ? filters.schoolId : undefined,
        }
      : undefined,
  );

  const logs = logsData?.data;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Message Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Audit trail of all WhatsApp messages sent across schools.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="hover-elevate"
        >
          Refresh Data
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <div className="p-4 border-b bg-card/50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          <Select
            value={filters.schoolId}
            onValueChange={(val) =>
              setFilters((prev) => ({ ...prev, schoolId: val }))
            }
          >
            <SelectTrigger className="w-full sm:w-62.5 bg-background">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Schools</SelectItem>
              {schools?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  School
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Recipient
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Message
                </TableHead>
                <TableHead className="font-semibold text-foreground text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : logs?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-muted-foreground"
                  >
                    No logs found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-sm whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.school?.name || (
                        <span className="text-muted-foreground text-xs">
                          Unknown (Deleted)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.recipient}
                    </TableCell>
                    <TableCell
                      className="max-w-75 truncate text-muted-foreground text-sm"
                      title={log.message}
                    >
                      {log.message}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
