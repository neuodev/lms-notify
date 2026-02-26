import { useState } from "react";
import { Link } from "wouter";
import { useSchools } from "@/hooks/use-schools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, Eye, Plus, Search, Loader2 } from "lucide-react";
import {
  CreateSchoolDialog,
  DeleteSchoolDialog,
  EditSchoolDialog,
} from "@/components/dialogs/school";

export default function Schools() {
  const { data, isLoading } = useSchools();

  const schools = data?.data.schools;
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredSchools = schools?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lmsType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Schools
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage configured LMS connections.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <CreateSchoolDialog onClose={() => setCreateOpen(false)} />
        </Dialog>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-card/50 flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  LMS Type
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Created At
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Total Messages
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Active Sessions
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredSchools?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Building2 className="w-10 h-10 text-muted-foreground/30" />
                      <p>No schools found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchools?.map((school) => (
                  <TableRow
                    key={school.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {school.name.charAt(0)}
                        </div>
                        {school.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-medium bg-secondary text-secondary-foreground"
                      >
                        {school.lmsType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(school.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background">
                        {school.messageCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background">
                        {school.sessions || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/schools/${school.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <EditSchoolDialog school={school} />
                        <DeleteSchoolDialog id={school.id} name={school.name} />
                      </div>
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
