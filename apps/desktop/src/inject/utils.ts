import { User } from "./types";

export class UserUtils {
  static resolvePhone(user: User): string | null {
    if (user.phone && user.phone !== "null") return user.phone;
    if (user.parent?.phone) return user.parent.phone;
    if (Array.isArray(user.parents)) {
      const p = user.parents.find((p) => p.phone);
      if (p?.phone) return p.phone;
    }
    return null;
  }

  static getInitials(user: User): string {
    const fullName =
      user.fullname || `${user.firstname || ""} ${user.lastname || ""}`.trim();
    if (!fullName) return "?";

    const parts = fullName.split(" ");
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (
      parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
    ).toUpperCase();
  }

  static getPrimaryRole(user: User): string {
    if (!user.roles || user.roles.length === 0) return "لا يوجد دور";
    const primaryRole = user.roles[0];
    return primaryRole?.name || "لا يوجد دور";
  }

  static getRoleId(user: User): number | null {
    if (!user.roles || user.roles.length === 0) return null;
    return user.roles[0]?.id || null;
  }

  static hasPhone(user: User): boolean {
    return this.resolvePhone(user) !== null;
  }
}

export class DOMUtils {
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    className?: string,
    innerHTML?: string,
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static addStyles(css: string): void {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  static loadFontAwesome(): Promise<void> {
    return new Promise((resolve) => {
      const fa = document.createElement("link");
      fa.rel = "stylesheet";
      fa.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
      fa.onload = () => resolve();
      document.head.appendChild(fa);
    });
  }
}
