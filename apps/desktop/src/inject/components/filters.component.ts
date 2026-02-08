import { FilterState } from "../types";
import { ROLES, LEVELS } from "../constants";
import { DOMUtils } from "../utils";

export class FiltersComponent {
  private container: HTMLElement;
  private onFilterChange: (filters: FilterState) => void;
  private filters: FilterState;

  private roleSelect!: HTMLSelectElement;
  private levelSelect!: HTMLSelectElement;
  private phoneButton!: HTMLButtonElement;
  private levelGroup!: HTMLElement;

  constructor(
    container: HTMLElement,
    initialFilters: FilterState,
    onFilterChange: (filters: FilterState) => void,
  ) {
    this.container = container;
    this.onFilterChange = onFilterChange;
    this.filters = { ...initialFilters };

    this.render();
  }

  private render(): void {
    const filtersSection = DOMUtils.createElement("div", "filters-section");

    // Role filter
    const roleFilterGroup = DOMUtils.createElement("div", "filter-group");
    const roleLabel = DOMUtils.createElement("label", "filter-label");
    roleLabel.textContent = "الدور";

    this.roleSelect = DOMUtils.createElement(
      "select",
      "filter-select",
    ) as HTMLSelectElement;
    this.roleSelect.id = "role-filter";

    const defaultRoleOption = DOMUtils.createElement("option");
    defaultRoleOption.value = "";
    defaultRoleOption.textContent = "جميع الأدوار";
    this.roleSelect.appendChild(defaultRoleOption);

    ROLES.forEach((role) => {
      const option = DOMUtils.createElement("option");
      option.value = role.id.toString();
      option.textContent = role.name;
      this.roleSelect.appendChild(option);
    });

    this.roleSelect.value = this.filters.roleId?.toString() || "";
    this.roleSelect.onchange = this.handleRoleChange.bind(this);

    roleFilterGroup.appendChild(roleLabel);
    roleFilterGroup.appendChild(this.roleSelect);

    // Level filter
    this.levelGroup = DOMUtils.createElement("div", "filter-group hidden");
    this.levelGroup.id = "level-filter-group";

    const levelLabel = DOMUtils.createElement("label", "filter-label");
    levelLabel.textContent = "المستوى";

    this.levelSelect = DOMUtils.createElement(
      "select",
      "filter-select",
    ) as HTMLSelectElement;
    this.levelSelect.id = "level-filter";

    const defaultLevelOption = DOMUtils.createElement("option");
    defaultLevelOption.value = "";
    defaultLevelOption.textContent = "جميع المستويات";
    this.levelSelect.appendChild(defaultLevelOption);

    LEVELS.forEach((level) => {
      const option = DOMUtils.createElement("option");
      option.value = level;
      option.textContent = level;
      this.levelSelect.appendChild(option);
    });

    this.levelSelect.value = this.filters.level || "";
    this.levelSelect.onchange = this.handleLevelChange.bind(this);

    this.levelGroup.appendChild(levelLabel);
    this.levelGroup.appendChild(this.levelSelect);

    // Phone filter button
    this.phoneButton = DOMUtils.createElement(
      "button",
      "phone-filter-button",
    ) as HTMLButtonElement;
    this.updatePhoneButton();
    this.phoneButton.title = "إظهار المستخدمين الذين لديهم أرقام هواتف فقط";
    this.phoneButton.onclick = this.handlePhoneFilterClick.bind(this);

    filtersSection.appendChild(roleFilterGroup);
    filtersSection.appendChild(this.levelGroup);
    filtersSection.appendChild(this.phoneButton);

    this.container.appendChild(filtersSection);
  }

  private handleRoleChange(): void {
    const value = this.roleSelect.value;
    this.filters.roleId = value ? parseInt(value) : null;

    // Show/hide level filter for Student (3) and Parent (7) roles
    if (this.filters.roleId && [3, 7].includes(this.filters.roleId)) {
      this.levelGroup.classList.remove("hidden");
    } else {
      this.levelGroup.classList.add("hidden");
      this.filters.level = null;
      this.levelSelect.value = "";
    }

    this.notifyChange();
  }

  private handleLevelChange(): void {
    const value = this.levelSelect.value;
    this.filters.level = value || null;
    this.notifyChange();
  }

  private handlePhoneFilterClick(): void {
    this.filters.hasPhoneOnly = !this.filters.hasPhoneOnly;
    this.updatePhoneButton();
    this.notifyChange();
  }

  private updatePhoneButton(): void {
    if (this.filters.hasPhoneOnly) {
      this.phoneButton.classList.add("active");
      this.phoneButton.innerHTML = `
        <i class="fas fa-phone"></i>
        <span>أرقام هواتف فقط ✓</span>
      `;
    } else {
      this.phoneButton.classList.remove("active");
      this.phoneButton.innerHTML = `
        <i class="fas fa-phone"></i>
        <span>أرقام هواتف فقط</span>
      `;
    }
  }

  private notifyChange(): void {
    this.onFilterChange({ ...this.filters });
  }

  getFilters(): FilterState {
    return { ...this.filters };
  }

  setFilters(filters: Partial<FilterState>): void {
    this.filters = { ...this.filters, ...filters };

    // Update UI
    this.roleSelect.value = this.filters.roleId?.toString() || "";
    this.levelSelect.value = this.filters.level || "";
    this.updatePhoneButton();

    // Update level filter visibility
    if (this.filters.roleId && [3, 7].includes(this.filters.roleId)) {
      this.levelGroup.classList.remove("hidden");
    } else {
      this.levelGroup.classList.add("hidden");
    }
  }

  resetFilters(): void {
    this.filters = {
      roleId: null,
      level: null,
      hasPhoneOnly: false,
    };

    this.roleSelect.value = "";
    this.levelSelect.value = "";
    this.levelGroup.classList.add("hidden");
    this.updatePhoneButton();

    this.notifyChange();
  }
}
