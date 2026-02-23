import { User } from "./types";

export interface Placeholder {
  key: string;
  label: string;
  resolver: (user: User) => string;
}

export const PLACEHOLDERS: Placeholder[] = [
  {
    key: "studentName",
    label: "اسم الطالب",
    resolver: (user) =>
      user.fullname || user.firstname + " " + user.lastname || "",
  },
  {
    key: "studentFirstName",
    label: "الاسم الأول للطالب",
    resolver: (user) => user.firstname || "",
  },
  {
    key: "studentLastName",
    label: "الاسم الأخير للطالب",
    resolver: (user) => user.lastname || "",
  },
  {
    key: "parentName",
    label: "اسم ولي الأمر",
    resolver: (user) => {
      const fullName = user.fullname?.split(" ");
      if (!fullName) return "";
      fullName.shift();
      const parentName = fullName.join(" ");
      return parentName || "";
    },
  },
  {
    key: "level",
    label: "المستوى",
    resolver: (user) => user.level || "",
  },
  {
    key: "email",
    label: "البريد الإلكتروني",
    resolver: (user) => user.email || "",
  },
  {
    key: "studentPhone",
    label: "رقم هاتف الطالب",
    resolver: (user) => user.phone || "",
  },
  {
    key: "parentPhone",
    label: "رقم هاتف ولي الأمر",
    resolver: (user) => {
      if (user.parent?.phone) return user.parent.phone;
      if (user.parents?.length) return user.parents[0]?.phone || "";
      return "";
    },
  },
];

export function resolveMessage(template: string, user: User): string {
  let message = template;
  for (const ph of PLACEHOLDERS) {
    const value = ph.resolver(user) || "";
    const regex = new RegExp(`\\{\\{${ph.key}\\}\\}`, "g");
    message = message.replace(regex, value);
  }
  return message;
}
