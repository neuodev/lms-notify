import { useState } from "react";
import { Link } from "wouter";
import {
  useSchools,
  useCreateSchool,
  useDeleteSchool,
  useUpdateSchool,
} from "@/hooks/use-schools";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  Building2,
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import type {
  CreateSchoolPayload,
  School,
  UpdateSchoolPayload,
} from "@/types/school";

export default function Schools() {
  const { data, isLoading } = useSchools();
  console.log({ data });

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

function CreateSchoolDialog({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateSchool();
  const form = useForm<CreateSchoolPayload>({
    defaultValues: { name: "", password: "", lmsType: "LERNOVIA" },
  });

  const onSubmit = async (values: CreateSchoolPayload) => {
    await createMutation.mutateAsync(values);
    onClose();
    form.reset();
  };

  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>Add New School</DialogTitle>
        <DialogDescription>
          Configure a new LMS connection. They will use these credentials to
          authenticate.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Academy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lmsType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LMS Provider</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LERNOVIA">Lernovia</SelectItem>
                    <SelectItem value="CLASSERA">Classera</SelectItem>
                    <SelectItem value="TEAMS">MS Teams</SelectItem>
                    <SelectItem value="COLIGO">Coligo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create School
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function EditSchoolDialog({ school }: { school: School }) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateSchool();
  const form = useForm<UpdateSchoolPayload>({
    defaultValues: {
      name: school.name,
      password: school.password || "",
      lmsType: school.lmsType,
    },
  });

  const onSubmit = async (values: UpdateSchoolPayload) => {
    await updateMutation.mutateAsync({ id: school.id, data: values });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>
            Update configuration for {school.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave empty to keep current"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lmsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LMS Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LERNOVIA">Lernovia</SelectItem>
                      <SelectItem value="CLASSERA">Classera</SelectItem>
                      <SelectItem value="TEAMS">MS Teams</SelectItem>
                      <SelectItem value="COLIGO">Coligo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteSchoolDialog({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteSchool();

  const onDelete = async () => {
    await deleteMutation.mutateAsync(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-red-500">Delete School</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{name}</strong>? This will
            also delete all associated message logs and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
