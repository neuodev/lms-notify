// src/inject/index.ts
import { DOMUtils } from "./utils";
import { CSS_STYLES, STORAGE_SCHOOL_ID_KEY } from "./constants";
import { WhatsAppIconComponent } from "./components/whatsapp-icon.component";
import { ModalComponent } from "./components/modal.component";
import { LoginComponent } from "./components/login.component";
import { STORAGE_TOKEN_KEY, STORAGE_LMS_TYPE_KEY } from "./constants";
import { createLmsClient } from "./lms-clients/factory";

class WhatsAppPlugin {
  private modal!: ModalComponent;
  private isInitialized: boolean = false;
  private lmsType: string | null = null;

  constructor() {}

  async initializeAfterLogin(token: string, lmsType: string, schoolId: string) {
    this.lmsType = lmsType;

    // Create LMS client based on lmsType
    const lmsClient = createLmsClient(lmsType);

    // Create modal and pass the lmsClient to it
    this.modal = new ModalComponent(() => this.handleModalClose(), lmsClient);
    // Create and mount the WhatsApp icon – no need to store reference
    new WhatsAppIconComponent(() => this.openModal());

    // Add styles and fontawesome
    DOMUtils.addStyles(CSS_STYLES);
    await DOMUtils.loadFontAwesome();

    this.isInitialized = true;
    console.log(
      "WhatsApp Plugin initialized successfully for school",
      schoolId,
    );
  }

  private openModal(): void {
    console.log("WhatsApp Plugin: Opening modal...");
    this.modal.open();
    this.modal.loadUsers().catch(console.error);
  }

  private handleModalClose(): void {
    console.log("Modal closed");
  }

  public openWhatsAppModal(): void {
    this.openModal();
  }
}

// Wait a bit for DOM, then check token
setTimeout(async () => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const lmsType = localStorage.getItem(STORAGE_LMS_TYPE_KEY);
  const schoolId = localStorage.getItem(STORAGE_SCHOOL_ID_KEY);

  const plugin = new WhatsAppPlugin();

  if (token && lmsType && schoolId) {
    // Optionally validate token with a backend call? For simplicity, assume valid.
    await plugin.initializeAfterLogin(token, lmsType, schoolId);
    (window as any).openWhatsAppModal = () => plugin.openWhatsAppModal();
  } else {
    // Show login screen
    new LoginComponent(async (token, lmsType, schoolId) => {
      await plugin.initializeAfterLogin(token, lmsType, schoolId);
      (window as any).openWhatsAppModal = () => plugin.openWhatsAppModal();
    });
  }
}, 100);
