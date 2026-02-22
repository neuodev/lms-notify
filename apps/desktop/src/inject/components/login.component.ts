// src/inject/components/LoginComponent.ts
import { DOMUtils } from "../utils";
import {
  BACKEND_URL,
  STORAGE_TOKEN_KEY,
  STORAGE_SCHOOL_ID_KEY,
  STORAGE_LMS_TYPE_KEY,
} from "../constants";

interface School {
  id: string;
  name: string;
  lmsType: string;
}

export class LoginComponent {
  private container: HTMLElement;
  private onLoginSuccess: (
    token: string,
    lmsType: string,
    schoolId: string,
  ) => void;

  private schools: School[] = [];
  private selectedSchoolId: string | null = null;
  private isLoading = false;

  private schoolSelect!: HTMLSelectElement;
  private passwordInput!: HTMLInputElement;
  private loginButton!: HTMLButtonElement;
  private errorDiv!: HTMLElement;

  constructor(
    onLoginSuccess: (token: string, lmsType: string, schoolId: string) => void,
  ) {
    this.onLoginSuccess = onLoginSuccess;
    this.container = this.createContainer();
    document.body.appendChild(this.container);
    this.loadSchools();
  }

  private createContainer(): HTMLElement {
    const overlay = DOMUtils.createElement("div", "login-overlay");
    overlay.innerHTML = `
      <div class="login-modal">
        <h2>تسجيل الدخول إلى الواتساب</h2>
        <div class="login-form">
          <div class="form-group">
            <label for="school-select">اختر المدرسة</label>
            <select id="school-select" class="school-select"></select>
          </div>
          <div class="form-group">
            <label for="password-input">كلمة المرور</label>
            <input type="password" id="password-input" class="password-input" placeholder="أدخل كلمة المرور" />
          </div>
          <div class="error-message" style="display: none;"></div>
          <button class="login-button">تسجيل الدخول</button>
        </div>
      </div>
    `;

    this.schoolSelect = overlay.querySelector("#school-select")!;
    this.passwordInput = overlay.querySelector("#password-input")!;
    this.loginButton = overlay.querySelector(".login-button")!;
    this.errorDiv = overlay.querySelector(".error-message")!;

    this.schoolSelect.addEventListener("change", (e) => {
      this.selectedSchoolId = (e.target as HTMLSelectElement).value;
    });

    this.loginButton.addEventListener("click", () => this.handleLogin());

    return overlay;
  }

  private async loadSchools() {
    this.isLoading = true;
    this.schoolSelect.innerHTML =
      '<option value="">جاري تحميل المدارس...</option>';
    try {
      const response = await fetch(`${BACKEND_URL}/schools`);
      const data = await response.json();
      this.schools = data.schools;
      this.renderSchoolOptions();

      const storedSchoolId = localStorage.getItem(STORAGE_SCHOOL_ID_KEY);
      if (storedSchoolId && this.schools.some((s) => s.id === storedSchoolId)) {
        this.schoolSelect.value = storedSchoolId;
        this.selectedSchoolId = storedSchoolId;
      }
    } catch (err) {
      this.showError("فشل تحميل قائمة المدارس");
    } finally {
      this.isLoading = false;
    }
  }

  private renderSchoolOptions() {
    let options = '<option value="">-- اختر مدرسة --</option>';
    this.schools.forEach((school) => {
      options += `<option value="${school.id}">${school.name}</option>`;
    });
    this.schoolSelect.innerHTML = options;
  }

  private async handleLogin() {
    if (!this.selectedSchoolId) {
      this.showError("الرجاء اختيار المدرسة");
      return;
    }
    const password = this.passwordInput.value.trim();
    if (!password) {
      this.showError("الرجاء إدخال كلمة المرور");
      return;
    }

    this.loginButton.disabled = true;
    this.loginButton.textContent = "جاري تسجيل الدخول...";
    this.hideError();

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.selectedSchoolId, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      // Store token and related info
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_SCHOOL_ID_KEY, this.selectedSchoolId);
      localStorage.setItem(STORAGE_LMS_TYPE_KEY, data.lmsType);

      // Notify success and close
      this.onLoginSuccess(data.token, data.lmsType, this.selectedSchoolId);
      this.destroy();
    } catch (err: any) {
      this.showError(err.message);
    } finally {
      this.loginButton.disabled = false;
      this.loginButton.textContent = "تسجيل الدخول";
    }
  }

  private showError(message: string) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.display = "block";
  }

  private hideError() {
    this.errorDiv.style.display = "none";
  }

  destroy() {
    this.container.remove();
  }
}
