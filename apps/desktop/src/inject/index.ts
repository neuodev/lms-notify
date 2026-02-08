import { CSS_STYLES } from "./constants";
import { DOMUtils } from "./utils";
import { WhatsAppIconComponent } from "./components/whatsapp-icon.component";
import { ModalComponent } from "./components/modal.component";

class WhatsAppPlugin {
  private modal: ModalComponent;
  private whatsAppIcon: WhatsAppIconComponent;
  private isInitialized: boolean = false;

  constructor() {
    this.modal = new ModalComponent(() => this.handleModalClose());
    this.whatsAppIcon = new WhatsAppIconComponent(() => this.openModal());
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("WhatsApp Plugin: Starting initialization...");

      // Preload resources
      DOMUtils.addStyles(CSS_STYLES);
      await DOMUtils.loadFontAwesome();

      this.isInitialized = true;
      console.log("WhatsApp Plugin initialized successfully");
    } catch (error) {
      console.error("Failed to initialize WhatsApp Plugin:", error);
    }
  }

  private openModal(): void {
    console.log("WhatsApp Plugin: Opening modal...");
    this.modal.open();
    this.modal.loadUsers().catch(console.error);
  }

  private handleModalClose(): void {
    console.log("Modal closed");
  }

  // Public API for external access
  public openWhatsAppModal(): void {
    this.openModal();
  }
}

// Initialize immediately since we're being injected by Electron
console.log("WhatsApp Plugin: Script injected, initializing...");

// Create a small delay to ensure DOM is fully ready
setTimeout(() => {
  const plugin = new WhatsAppPlugin();
  plugin.initialize().catch(console.error);

  // Expose to global scope for external access
  (window as any).openWhatsAppModal = () => plugin.openWhatsAppModal();

  console.log("WhatsApp Plugin: Initialization complete");
}, 100);
