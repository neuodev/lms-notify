import {
  useCreateSchool,
  useDeleteSchool,
  useUpdateSchool,
} from "@/hooks/use-schools";
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
import { useForm } from "react-hook-form";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import type {
  CreateSchoolPayload,
  School,
  UpdateSchoolPayload,
} from "@/types/school";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function CreateSchoolDialog({ onClose }: { onClose: () => void }) {
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

export function EditSchoolDialog({ school }: { school: School }) {
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

export function DeleteSchoolDialog({ id, name }: { id: string; name: string }) {
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
