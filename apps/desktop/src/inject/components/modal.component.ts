import { User, FilterState } from "../types";
import { UserFilter } from "../filters";
import { apiService } from "../api.service";
import { DOMUtils } from "../utils";
import { UserTableComponent } from "./table.component";
import { FiltersComponent } from "./filters.component";
import { excelService } from "../excel.service.js";

export class ModalComponent {
  private modal: HTMLElement;
  private isVisible: boolean = false;
  private onClose: () => void;

  private users: User[] = [];
  private selectedIds: Set<number> = new Set();
  private filterState: FilterState = {
    name: "",
    roleId: null,
    level: null,
    hasPhoneOnly: false,
  };

  private filtersComponent: FiltersComponent | null = null;
  private tableComponent: UserTableComponent | null = null;
  private selectedCountElement!: HTMLElement;
  private messageTextarea!: HTMLTextAreaElement;
  private sendButton!: HTMLButtonElement;
  private tableContainer!: HTMLElement;
  private filtersContainer!: HTMLElement;

  private fileInput!: HTMLInputElement;
  private uploadButton!: HTMLButtonElement;
  private dataSourceInfo!: HTMLElement;
  private isUsingExcelData: boolean = false;
  private excelUsers: User[] = [];
  private clearExcelButton!: HTMLButtonElement;

  private authWrapper!: HTMLElement;
  private contentWrapper!: HTMLElement;
  private qrImage!: HTMLImageElement;
  private qrPlaceholder!: HTMLElement;
  private authStatusText!: HTMLElement;
  private verifyButton!: HTMLButtonElement;
  private authErrorText!: HTMLElement;

  constructor(onClose: () => void) {
    console.log("ModalComponent: Constructor called");

    this.onClose = onClose;
    this.modal = this.createModal();
    this.initializeComponents();
  }

  private createModal(): HTMLElement {
    const modal = DOMUtils.createElement("div", "model hidden");

    const header = DOMUtils.createElement("div", "model__header");
    const title = DOMUtils.createElement("div", "model__title");
    title.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-icon lucide-message-square"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg> <span>إرسال إشعار علي الواتس</span>`;

    const closeBtn = DOMUtils.createElement("button", "model__close");
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => this.close();

    header.appendChild(title);
    header.appendChild(closeBtn);
    modal.appendChild(header);

    return modal;
  }

  private initializeComponents(): void {
    // Create authentication wrapper
    this.createAuthWrapper();

    // Create content wrapper (initially hidden)
    this.createContentWrapper();

    // Add both wrappers to modal
    this.modal.appendChild(this.authWrapper);
    this.modal.appendChild(this.contentWrapper);
    document.body.appendChild(this.modal);
  }

  private createAuthWrapper(): void {
    this.authWrapper = DOMUtils.createElement("div", "auth-wrapper");

    // Status text
    this.authStatusText = DOMUtils.createElement("p", "loading-text");
    this.authStatusText.textContent = "جاري الاتصال بخادم WhatsApp...";

    // QR code placeholder
    this.qrPlaceholder = DOMUtils.createElement("div", "qr-placeholder");
    this.qrPlaceholder.innerHTML = `
      <i class="fas fa-qrcode"></i>
      <p>سيتم عرض رمز QR هنا</p>
    `;
    this.qrPlaceholder.style.display = "none";

    // QR image element
    this.qrImage = document.createElement("img");
    this.qrImage.style.width = "240px";
    this.qrImage.style.height = "240px";
    this.qrImage.style.borderRadius = "8px";
    this.qrImage.style.margin = "10px auto";
    this.qrImage.style.display = "none";

    // Verify button
    this.verifyButton = DOMUtils.createElement(
      "button",
      "",
    ) as HTMLButtonElement;
    this.verifyButton.textContent = "إتمام المسح والتحقق";
    this.verifyButton.style.display = "none";
    this.verifyButton.onclick = () => this.verifyAuthentication();

    // Error text
    this.authErrorText = DOMUtils.createElement("p", "error-text");
    this.authErrorText.style.display = "none";

    // Assemble auth wrapper
    this.authWrapper.appendChild(this.authStatusText);
    this.authWrapper.appendChild(this.qrPlaceholder);
    this.authWrapper.appendChild(this.qrImage);
    this.authWrapper.appendChild(this.verifyButton);
    this.authWrapper.appendChild(this.authErrorText);
  }

  private createContentWrapper(): void {
    this.contentWrapper = DOMUtils.createElement("div", "");
    this.contentWrapper.classList.add("hidden");

    this.filtersContainer = DOMUtils.createElement("div");
    this.tableContainer = DOMUtils.createElement("div");

    // Create upload section
    const uploadSection = this.createUploadSection();

    // Table controls
    const tableControls = this.createTableControls();

    // Message area
    this.messageTextarea = DOMUtils.createElement(
      "textarea",
      "textarea",
    ) as HTMLTextAreaElement;
    this.messageTextarea.placeholder = "اكتب الرسالة هنا...";
    this.messageTextarea.rows = 4;

    // Send button
    this.sendButton = DOMUtils.createElement(
      "button",
      "send-button",
    ) as HTMLButtonElement;
    this.sendButton.innerHTML = `
    <i class="fa-solid fa-paper-plane"></i>
    إرسال الرسالة
    `;
    this.sendButton.disabled = true;
    this.sendButton.onclick = () => this.handleSend();

    // Assemble content wrapper
    this.contentWrapper.appendChild(this.filtersContainer);
    this.contentWrapper.appendChild(uploadSection);
    this.contentWrapper.appendChild(tableControls);
    this.contentWrapper.appendChild(this.tableContainer);
    this.contentWrapper.appendChild(this.messageTextarea);
    this.contentWrapper.appendChild(this.sendButton);
  }

  private createTableControls(): HTMLElement {
    const tableControls = DOMUtils.createElement("div", "table-controls");

    const selectAllWrapper = DOMUtils.createElement(
      "div",
      "select-all-checkbox",
    );
    const selectAllCheckbox = DOMUtils.createElement(
      "input",
      "",
    ) as HTMLInputElement;
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.id = "select-all";

    const selectAllLabel = DOMUtils.createElement("label", "select-all-label");
    selectAllLabel.htmlFor = "select-all";
    selectAllLabel.textContent = "تحديد الكل";

    selectAllCheckbox.onchange = () =>
      this.handleSelectAll(selectAllCheckbox.checked);
    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);

    this.selectedCountElement = DOMUtils.createElement("div", "selected-count");
    this.selectedCountElement.textContent = "لم يتم تحديد أي مستخدم";

    tableControls.appendChild(selectAllWrapper);
    tableControls.appendChild(this.selectedCountElement);

    return tableControls;
  }

  private async checkWhatsAppStatus(): Promise<void> {
    try {
      // Reset UI
      this.authStatusText.textContent = "جاري التحقق من حالة WhatsApp...";
      this.authStatusText.style.display = "block";
      this.qrPlaceholder.style.display = "none";
      this.qrImage.style.display = "none";
      this.verifyButton.style.display = "none";
      this.authErrorText.style.display = "none";

      const status = await apiService.checkWhatsAppStatus();
      console.log("WhatsApp Status:", status);

      if (status.authenticated) {
        console.log("Already authenticated");
        this.showMainContent();
      } else {
        console.log("Not authenticated");
        this.showQRCode(status.qr);
      }
    } catch (error) {
      console.error("Error checking WhatsApp status:", error);
      this.authErrorText.textContent =
        "فشل الاتصال بالخادم. تأكد من تشغيل خادم WhatsApp.";
      this.authErrorText.style.display = "block";
      this.authStatusText.style.display = "none";
    }
  }

  private showQRCode(qrCode: string | undefined): void {
    if (!qrCode) {
      this.authErrorText.textContent =
        "فشل في الحصول على رمز QR. حاول مرة أخرى.";
      this.authErrorText.style.display = "block";
      this.authStatusText.style.display = "none";
      return;
    }

    this.authStatusText.textContent = "قم بمسح رمز QR باستخدام WhatsApp";
    this.authStatusText.style.display = "block";

    this.qrPlaceholder.style.display = "flex";
    this.qrPlaceholder.innerHTML = ""; // Clear placeholder

    // Create QR code image
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrCode)}`;
    this.qrImage.src = qrLink;
    this.qrImage.style.display = "block";

    this.qrPlaceholder.appendChild(this.qrImage);

    // Show verify button
    this.verifyButton.style.display = "inline-block";
    this.verifyButton.disabled = false;
    this.verifyButton.textContent = "إتمام المسح والتحقق";
  }

  private async verifyAuthentication(): Promise<void> {
    console.log("Verifying authentication...");
    this.verifyButton.disabled = true;
    this.verifyButton.textContent = "جاري التحقق...";
    this.authErrorText.style.display = "none";

    const MAX_RETRIES = 15;
    let attempt = 0;

    const interval = setInterval(async () => {
      attempt++;
      console.log(`Checking auth attempt ${attempt}`);

      try {
        const status = await apiService.checkWhatsAppStatus();

        if (status.authenticated) {
          clearInterval(interval);
          console.log("Authentication successful");
          this.showMainContent();
        } else if (attempt >= MAX_RETRIES) {
          clearInterval(interval);
          this.authErrorText.textContent =
            "تم مسح QR لكن الاتصال لم يكتمل بعد. حاول مرة أخرى بعد ثواني.";
          this.authErrorText.style.display = "block";
          this.verifyButton.disabled = false;
          this.verifyButton.textContent = "إتمام المسح والتحقق";
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Verification error:", err);
        this.authErrorText.textContent = "فشل التحقق من الحالة";
        this.authErrorText.style.display = "block";
        this.verifyButton.disabled = false;
        this.verifyButton.textContent = "إتمام المسح والتحقق";
      }
    }, 1000);
  }

  async loadUsers(): Promise<void> {
    if (this.users.length === 0) {
      this.showTableLoading("جاري تحميل المستخدمين من النظام...");
      try {
        this.users = await apiService.fetchAllUsers();
        this.initializeTableAndFilters();
      } catch (error) {
        console.error("Failed to load users:", error);
        this.showTableLoading("فشل في تحميل المستخدمين. حاول مرة أخرى.");
      }
    }
  }

  private initializeTableAndFilters(): void {
    this.filtersContainer.innerHTML = "";
    this.tableContainer.innerHTML = "";
    this.filtersComponent = new FiltersComponent(
      this.filtersContainer,
      this.filterState,
      (filters) => {
        this.filterState = filters;
        this.renderTable();
      },
    );

    this.tableComponent = new UserTableComponent(
      this.tableContainer,
      this.selectedIds,
      (selectedIds) => {
        this.selectedIds = selectedIds;
        this.updateSelectedCount();
      },
    );

    this.renderTable();
  }

  private renderTable(): void {
    const users = this.getUsers();

    const filteredUsers = UserFilter.filterUsers(users, this.filterState);

    this.tableComponent?.render(filteredUsers, this.filterState.hasPhoneOnly);
    this.tableComponent?.updateSelection(this.selectedIds);
    this.updateSelectedCount();
  }

  private handleSelectAll(isChecked: boolean): void {
    const users = this.getUsers();
    const filteredUsers = UserFilter.filterUsers(users, this.filterState);

    if (isChecked) {
      filteredUsers.forEach((user) => this.selectedIds.add(user.id));
    } else {
      filteredUsers.forEach((user) => this.selectedIds.delete(user.id));
    }

    this.tableComponent?.updateSelection(this.selectedIds);
    this.updateSelectedCount();
  }

  private showMainContent(): void {
    // Hide auth wrapper
    this.authWrapper.classList.add("hidden");

    // Show content wrapper
    this.contentWrapper.classList.remove("hidden");

    // Load users if not already loaded
    if (this.users.length === 0) {
      this.showTableLoading("جاري تحميل المستخدمين من النظام...");
      this.loadUsers().catch(console.error);
    } else {
      // If users are already loaded, just ensure table is rendered
      this.renderTable();
    }
  }

  private async handleSend(): Promise<void> {
    const message = this.messageTextarea.value.trim();

    if (!message) {
      alert("الرجاء كتابة الرسالة أولاً");
      return;
    }

    if (this.selectedIds.size === 0) {
      alert("الرجاء تحديد مستخدم واحد على الأقل");
      return;
    }

    const selectedUsers = this.getUsers().filter((user) =>
      this.selectedIds.has(user.id),
    );

    // Resolve phone numbers
    const numbers = selectedUsers
      .map((user) => {
        if (user.phone && user.phone !== "null") return user.phone;
        if (user.parents?.length) {
          const parentWithPhone = user.parents.find((p) => p.phone);
          return parentWithPhone?.phone || null;
        }
        return null;
      })
      .filter((phone): phone is string => phone !== null && phone !== "");

    if (numbers.length === 0) {
      alert("لا يوجد أرقام هاتف صالحة للمستخدمين المحددين");
      return;
    }

    console.log("Sending message to:", numbers.length, "numbers");
    console.log("Message:", message);

    this.sendButton.disabled = true;
    this.sendButton.textContent = "جاري الإرسال...";

    try {
      const result = await apiService.sendBulkMessages(message, numbers);

      // Calculate sent and failed counts from the results array
      const sentCount = result.results.filter(
        (r) => r.status === "sent",
      ).length;
      const failedCount = result.results.filter(
        (r) => r.status === "failed",
      ).length;

      setTimeout(() => {
        this.sendButton.disabled = false;
        this.sendButton.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
    إرسال الرسالة
    `;
        this.messageTextarea.value = "";

        // Show appropriate alert based on results
        if (sentCount > 0 && failedCount === 0) {
          alert(`تم الإرسال بنجاح إلى ${sentCount} رقم`);
        } else if (sentCount > 0 && failedCount > 0) {
          alert(
            `تم الإرسال بنجاح إلى ${sentCount} رقم وفشل إرسال ${failedCount} رسالة`,
          );
        } else {
          alert("لم يتم إرسال أي رسائل بنجاح");
        }
      }, 2000);
    } catch (err) {
      console.error("❌ Send error:", err);
      alert("فشل الإرسال. حاول مرة أخرى.");
      this.sendButton.disabled = false;
      this.sendButton.textContent = `
          <i class="fa-solid fa-paper-plane"></i>
    إرسال الرسالة
      `;
    }
  }

  private showTableLoading(message: string): void {
    if (this.tableComponent) {
      this.tableComponent.showLoading(message);
    } else if (this.tableContainer) {
      this.tableContainer.innerHTML = `<div class="loading-text">${message}</div>`;
    }
  }

  private updateSelectedCount(): void {
    const users = this.getUsers();
    const count = this.selectedIds.size;
    const filteredUsers = UserFilter.filterUsers(users, this.filterState);

    const totalWithPhone = UserFilter.getTotalUsersWithPhone(users);

    let countText = `تم تحديد ${count} مستخدم`;

    if (this.filterState.hasPhoneOnly) {
      countText += ` (عرض ${filteredUsers.length} مستخدم لديهم أرقام هواتف من أصل ${totalWithPhone} مستخدم لديهم أرقام)`;
    } else {
      countText += ` (عرض ${filteredUsers.length} مستخدم من أصل ${users.length} مستخدم)`;
    }

    this.selectedCountElement.textContent = countText;
    this.sendButton.disabled = count === 0;
  }

  private createUploadSection(): HTMLElement {
    console.log("Creating upload section");

    const uploadSection = DOMUtils.createElement("div", "upload-section");

    // Data source info
    this.dataSourceInfo = DOMUtils.createElement("div", "data-source-info");
    this.dataSourceInfo.innerHTML = `
      <i class="fa-solid fa-users"></i>
      مصدر المعلومات: 
      <span class="data-source-label">
      بيانات النظام
      </span>
  `;

    // Upload button
    this.uploadButton = DOMUtils.createElement(
      "button",
      "upload-button",
    ) as HTMLButtonElement;
    this.uploadButton.innerHTML = `
    <i class="fas fa-file-excel"></i>
    تحميل ملف Excel
  `;
    this.uploadButton.onclick = () => this.fileInput.click();

    // Hidden file input
    this.fileInput = DOMUtils.createElement(
      "input",
      "file-input",
    ) as HTMLInputElement;
    this.fileInput.type = "file";
    this.fileInput.accept = ".xlsx,.xls,.csv";
    this.fileInput.style.display = "none";
    this.fileInput.onchange = (e) => this.handleFileUpload(e);

    // Clear Excel data button
    this.clearExcelButton = DOMUtils.createElement(
      "button",
      "clear-excel-button",
    ) as HTMLButtonElement;
    this.clearExcelButton.innerHTML = `
    <i class="fas fa-database"></i>
    العودة إلى بيانات النظام
  `;
    this.clearExcelButton.style.display = "none";
    this.clearExcelButton.onclick = () => this.clearExcelData();

    uploadSection.appendChild(this.dataSourceInfo);
    uploadSection.appendChild(this.uploadButton);
    uploadSection.appendChild(this.fileInput);
    uploadSection.appendChild(this.clearExcelButton);

    return uploadSection;
  }

  private async handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file) return;

    try {
      // Show loading state on button and table
      this.uploadButton.disabled = true;
      this.uploadButton.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      جاري معالجة الملف...
    `;

      // Show loading in table
      this.showTableLoading("جاري تحليل بيانات ملف Excel...");

      // Parse Excel file
      const result = await excelService.parseExcelFile(file);

      // Switch to Excel data
      this.isUsingExcelData = true;
      this.excelUsers = result.users;

      // Update UI
      this.dataSourceInfo.innerHTML = `
      <i class="fa-solid fa-users"></i>
      مصدر المعلومات: 
      <span class="data-source-label">
      Excel
      </span>
    `;

      // Show clear button
      this.clearExcelButton.style.display = "inline-block";

      // Clear any existing filters
      if (this.filtersComponent) {
        this.filtersComponent.setFilters({
          roleId: null,
          level: null,
          hasPhoneOnly: false,
        });
      }

      // Reset filter state
      this.filterState = {
        name: "",
        roleId: null,
        level: null,
        hasPhoneOnly: false,
      };

      // Clear selections
      this.selectedIds.clear();

      // If table is already initialized, update it
      if (this.tableComponent) {
        const filteredUsers = UserFilter.filterUsers(
          this.excelUsers,
          this.filterState,
        );
        this.tableComponent.render(filteredUsers, false);
        this.tableComponent.updateSelection(this.selectedIds);
      } else {
        // Otherwise initialize table and filters
        this.initializeTableAndFilters();
      }

      this.updateSelectedCount();

      alert(`تم تحميل ${result.count} طالب من ملف Excel بنجاح`);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      alert("حدث خطأ في تحليل ملف Excel. تأكد من تنسيق الملف.");
      this.showTableLoading("فشل في تحميل ملف Excel. حاول مرة أخرى.");
    } finally {
      // Reset upload button
      this.uploadButton.disabled = false;
      this.uploadButton.innerHTML = `
      <i class="fas fa-file-excel"></i>
      تحميل ملف Excel
    `;

      // Clear file input
      input.value = "";
    }
  }

  private clearExcelData(): void {
    this.isUsingExcelData = false;
    this.excelUsers = [];

    // Reset UI
    this.dataSourceInfo.innerHTML = `
      <i class="fa-solid fa-users"></i>
      مصدر المعلومات: 
      <span class="data-source-label">
      بيانات النظام
      </span>
  `;

    // Hide clear button
    this.clearExcelButton.style.display = "none";

    // Clear any existing filters
    if (this.filtersComponent) {
      this.filtersComponent.setFilters({
        roleId: null,
        level: null,
        hasPhoneOnly: false,
      });
    }

    // Reset filter state
    this.filterState = {
      name: "",
      roleId: null,
      level: null,
      hasPhoneOnly: false,
    };

    // Clear selections
    this.selectedIds.clear();

    // If API users are loaded, show them
    if (this.users.length > 0) {
      const filteredUsers = UserFilter.filterUsers(
        this.users,
        this.filterState,
      );
      this.tableComponent?.render(filteredUsers, false);
      this.tableComponent?.updateSelection(this.selectedIds);
    } else {
      // Otherwise show loading and load users
      this.showTableLoading("جاري تحميل المستخدمين من النظام...");
      this.loadUsers().catch(console.error);
    }

    this.updateSelectedCount();
    alert("تم الرجوع إلى بيانات النظام");
  }

  private getUsers(): User[] {
    return this.isUsingExcelData ? this.excelUsers : this.users;
  }

  open(): void {
    this.modal.classList.remove("hidden");
    this.isVisible = true;

    this.authWrapper.classList.remove("hidden");
    this.contentWrapper.classList.add("hidden");

    // Show loading state
    this.authStatusText.textContent = "جاري الاتصال بخادم WhatsApp...";
    this.authStatusText.style.display = "block";
    this.qrPlaceholder.style.display = "none";
    this.qrImage.style.display = "none";
    this.verifyButton.style.display = "none";
    this.authErrorText.style.display = "none";

    this.checkWhatsAppStatus();
  }

  close(): void {
    this.modal.classList.add("hidden");
    this.isVisible = false;
    this.onClose();
  }

  isOpen(): boolean {
    return this.isVisible;
  }
}
