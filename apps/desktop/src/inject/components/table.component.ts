import { User } from "../types";
import { UserUtils } from "../utils";
import { DOMUtils } from "../utils";

export class UserTableComponent {
  private table: HTMLTableElement;
  private tbody: HTMLTableSectionElement;
  private selectedIds: Set<number>;
  private onSelectionChange: (selectedIds: Set<number>) => void;
  private isPhoneOnlyFilter: boolean = false;

  private currentUsers: User[] = [];

  constructor(
    container: HTMLElement,
    selectedIds: Set<number>,
    onSelectionChange: (selectedIds: Set<number>) => void,
  ) {
    this.selectedIds = selectedIds;
    this.onSelectionChange = onSelectionChange;

    this.table = DOMUtils.createElement("table", "students-table");
    this.createHeader();

    this.tbody = DOMUtils.createElement("tbody");
    this.table.appendChild(this.tbody);

    const wrapper = DOMUtils.createElement("div", "students-table-wrapper");
    wrapper.appendChild(this.table);
    container.appendChild(wrapper);
  }

  private createHeader(): void {
    const thead = DOMUtils.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th class="select-cell">تحديد</th>
        <th class="avatar-cell">الصورة</th>
        <th class="name-cell">الاسم</th>
        <th class="role-cell">الدور</th>
        <th class="level-cell">المستوى</th>
        <th class="phone-cell">رقم الهاتف</th>
        <th class="email-cell">البريد الإلكتروني</th>
      </tr>
    `;
    this.table.appendChild(thead);
  }

  render(users: User[], isPhoneOnlyFilter: boolean = false): void {
    this.currentUsers = users; // Store users
    this.isPhoneOnlyFilter = isPhoneOnlyFilter;
    this.tbody.innerHTML = "";

    if (users.length === 0) {
      const noDataRow = DOMUtils.createElement("tr");
      noDataRow.innerHTML = `<td colspan="7" class="no-data">لا يوجد مستخدمين متاحين</td>`;
      this.tbody.appendChild(noDataRow);
      return;
    }

    const fragment = document.createDocumentFragment();
    users.forEach((user) => fragment.appendChild(this.createUserRow(user)));
    this.tbody.appendChild(fragment);
  }

  showLoading(message: string): void {
    this.tbody.innerHTML = `<tr><td colspan="7" class="loading-text">${message}</td></tr>`;
  }

  private createUserRow(user: User): HTMLTableRowElement {
    const row = DOMUtils.createElement("tr");
    const hasPhone = UserUtils.hasPhone(user);

    // Store data attributes
    row.dataset.id = String(user.id);
    row.dataset.name = (user.fullname || "").toLowerCase();
    row.dataset.hasPhone = String(hasPhone);

    // Apply disabled styling for phone filter
    if (this.isPhoneOnlyFilter && !hasPhone) {
      row.style.opacity = "0.5";
      row.style.pointerEvents = "none";
    }

    // Select cell
    const selectCell = DOMUtils.createElement("td", "select-cell");
    const checkbox = DOMUtils.createElement("input", "") as HTMLInputElement;
    checkbox.type = "checkbox";
    checkbox.checked = this.selectedIds.has(user.id);
    checkbox.disabled = this.isPhoneOnlyFilter && !hasPhone;

    checkbox.onchange = () => {
      if (checkbox.checked) {
        this.selectedIds.add(user.id);
        row.classList.add("selected");
      } else {
        this.selectedIds.delete(user.id);
        row.classList.remove("selected");
      }
      this.onSelectionChange(this.selectedIds);
    };
    selectCell.appendChild(checkbox);

    // Avatar cell
    const avatarCell = DOMUtils.createElement("td", "avatar-cell");
    const avatarDiv = DOMUtils.createElement(
      "div",
      "student-avatar placeholder",
    );
    avatarDiv.textContent = UserUtils.getInitials(user);
    avatarCell.appendChild(avatarDiv);

    // Name cell with phone indicator
    const nameCell = DOMUtils.createElement("td", "name-cell");
    const nameContainer = DOMUtils.createElement("div");
    nameContainer.style.display = "flex";
    nameContainer.style.alignItems = "center";
    nameContainer.style.gap = "8px";

    const nameText = DOMUtils.createElement("span");
    nameText.textContent =
      user.fullname || `${user.firstname} ${user.lastname}` || "لا يوجد اسم";
    nameContainer.appendChild(nameText);

    if (hasPhone) {
      const phoneIcon = DOMUtils.createElement("i", "fas fa-phone");
      phoneIcon.style.color = "#25d366";
      phoneIcon.style.fontSize = "12px";
      phoneIcon.title = "يوجد رقم هاتف";
      nameContainer.appendChild(phoneIcon);
    }
    nameCell.appendChild(nameContainer);

    // Role cell
    const roleCell = DOMUtils.createElement("td", "role-cell");
    roleCell.textContent = UserUtils.getPrimaryRole(user);

    // Level cell
    const levelCell = DOMUtils.createElement("td", "level-cell");
    levelCell.textContent = user.level || "غير محدد";

    // Phone cell
    const phoneCell = DOMUtils.createElement("td", "phone-cell");
    phoneCell.textContent =
      user.phone && user.phone !== "null" ? user.phone : "لا يوجد رقم";

    // Email cell
    const emailCell = DOMUtils.createElement("td", "email-cell");
    emailCell.textContent = user.email || "لا يوجد بريد إلكتروني";

    // Append all cells
    [
      selectCell,
      avatarCell,
      nameCell,
      roleCell,
      levelCell,
      phoneCell,
      emailCell,
    ].forEach((cell) => row.appendChild(cell));

    return row;
  }

  updateSelection(selectedIds: Set<number>): void {
    this.selectedIds = selectedIds;
    const checkboxes = this.tbody.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      if (row) {
        const userId = parseInt(row.dataset.id || "0", 10);
        checkbox.checked = selectedIds.has(userId);

        if (selectedIds.has(userId)) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }
      }
    });
  }

  getElement(): HTMLTableElement {
    return this.table;
  }
}
