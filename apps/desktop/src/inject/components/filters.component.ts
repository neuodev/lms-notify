import { FilterState } from "../types";
import { ROLES, LEVELS } from "../constants";
import { DOMUtils } from "../utils";

export class FiltersComponent {
  private container: HTMLElement;
  private onFilterChange: (filters: FilterState) => void;
  private filters: FilterState;

  private nameInput!: HTMLInputElement;
  private roleSelect!: HTMLSelectElement;
  private levelSelect!: HTMLSelectElement;
  private phoneButton!: HTMLButtonElement;

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

    this.nameInput = DOMUtils.createElement(
      "input",
      "search-input",
    ) as HTMLInputElement;
    this.nameInput.type = "text";
    this.nameInput.placeholder = "بحث بالاسم...";
    this.nameInput.oninput = () => this.handleNameChange.bind(this);

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

    // Phone filter button
    this.phoneButton = DOMUtils.createElement(
      "button",
      "phone-filter-button",
    ) as HTMLButtonElement;
    this.updatePhoneButton();
    this.phoneButton.title = "إظهار المستخدمين الذين لديهم أرقام هواتف فقط";
    this.phoneButton.onclick = this.handlePhoneFilterClick.bind(this);

    filtersSection.appendChild(this.phoneButton);
    filtersSection.appendChild(this.roleSelect);
    filtersSection.appendChild(this.levelSelect);
    filtersSection.appendChild(this.nameInput);

    this.container.appendChild(filtersSection);
  }

  private handleRoleChange(): void {
    const value = this.roleSelect.value;
    this.filters.roleId = value ? parseInt(value) : null;

    // Show/hide level filter for Student (3) and Parent (7) roles
    if (this.filters.roleId && [3, 7].includes(this.filters.roleId)) {
      this.levelSelect.disabled = false;
    } else {
      this.levelSelect.disabled = true;
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

  private handleNameChange(): void {
    const value = this.nameInput.value;
    this.filters.name = value || "";

    this.notifyChange();
  }

  private handlePhoneFilterClick(): void {
    this.filters.hasPhoneOnly = !this.filters.hasPhoneOnly;
    this.updatePhoneButton();
    this.notifyChange();
  }

  private updatePhoneButton(): void {
    this.phoneButton.innerHTML = `
    <span>أرقام هواتف فقط</span>
    <i class="fas fa-phone"></i>
    `;
    if (this.filters.hasPhoneOnly) {
      this.phoneButton.classList.add("active");
    } else {
      this.phoneButton.classList.remove("active");
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

    if (this.filters.roleId && [3, 7].includes(this.filters.roleId))
      this.levelSelect.disabled = false;
    else this.levelSelect.disabled = true;
  }

  resetFilters(): void {
    this.filters = {
      name: "",
      roleId: null,
      level: null,
      hasPhoneOnly: false,
    };

    this.roleSelect.value = "";
    this.levelSelect.value = "";
    this.nameInput.value = "";
    this.levelSelect.disabled = true;
    this.updatePhoneButton();

    this.notifyChange();
  }
}
