import { DOMUtils } from "../utils";

export class WhatsAppIconComponent {
  private onClick: () => void;

  constructor(onClick: () => void) {
    console.log("WhatsAppIconComponent: Constructor called");
    this.onClick = onClick;
    this.render();
  }

  private render(): void {
    console.log("WhatsAppIconComponent: Rendering icon...");
    const btn = DOMUtils.createElement("button", "whatsapp__wrapper");
    btn.innerHTML = `<i class="fa-brands fa-whatsapp fa-2xl"></i>`;
    btn.title = "إرسال رسالة واتساب";
    btn.onclick = this.onClick;

    document.body.appendChild(btn);
    console.log("WhatsAppIconComponent: Icon added to DOM");
  }
}
