const token = localStorage.getItem("token");

interface Student {
  id: number;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  parent?: { phone?: string };
  parents?: Array<{ phone?: string }>;
  roles?: Array<{ name: string }>;
}

const cssStyles = `
.whatsapp__wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0,0,0,.25);
  cursor: pointer;
  transition: transform 0.2s;
}

.whatsapp__wrapper:hover {
  transform: scale(1.1);
}

.model {
  position: fixed;
  z-index: 10000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 420px;
  max-height: 90vh;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0,0,0,.3);
  padding: 16px;
  font-family: system-ui, sans-serif;
  overflow-y: auto;
  direction: rtl;
}

.model__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.model__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.model__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  padding: 4px 8px;
  line-height: 1;
}

.model__close:hover {
  color: #000;
}

.auth-wrapper {
  text-align: center;
  padding: 20px;
}

.auth-wrapper p {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
}

.qr-placeholder {
  width: 240px;
  height: 240px;
  margin: 12px auto;
  border: 2px solid #eee;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.qr-placeholder i {
  font-size: 48px;
  color: #25d366;
  margin-bottom: 10px;
}

.auth-wrapper .error-text {
  color: #dc3545;
  font-size: 13px;
  margin-top: 10px;
}

.auth-wrapper button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.auth-wrapper button:hover:not(:disabled) {
  background: #20bd5a;
}

.auth-wrapper button:disabled {
  background: #9be5b5;
  cursor: not-allowed;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 10px;
}

.search-input:focus {
  outline: none;
  border-color: #25d366;
}

.students-list {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 12px;
}

.students-list::-webkit-scrollbar {
  width: 6px;
}

.students-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.select-all-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 8px;
  font-weight: 500;
  cursor: pointer;
}

.select-all-wrapper:hover {
  background: #e9ecef;
}

.select-all-wrapper input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.student-item:hover {
  background: #f7f7f7;
}

.student-item input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.student-item .student-info {
  flex: 1;
}

.student-item .student-name {
  font-weight: 500;
}

.student-item .no-phone {
  display: block;
  font-size: 12px;
  color: #dc3545;
  margin-top: 2px;
}

.model textarea {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  font-family: inherit;
  margin-bottom: 12px;
}

.model textarea:focus {
  outline: none;
  border-color: #25d366;
}

.send-button {
  width: 100%;
  padding: 12px;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.send-button:hover:not(:disabled) {
  background: #20bd5a;
}

.send-button:disabled {
  background: #9be5b5;
  cursor: not-allowed;
}

.loading-text {
  text-align: center;
  padding: 20px;
  color: #666;
}

.hidden {
  display: none !important;
}

.progress-wrapper {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #25d366;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  color: #666;
  text-align: center;
}

.selected-count {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
}

.copy-qr-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.copy-qr-btn:hover {
  background: #5a6268;
}

.qr-text {
  font-family: monospace;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 11px;
  word-break: break-all;
  display: none;
}
`;

function resolvePhone(user: Student): string | null {
  if (user.phone) return user.phone;
  if (user.parent?.phone) return user.parent.phone;
  if (Array.isArray(user.parents)) {
    const p = user.parents.find((p) => p.phone);
    if (p?.phone) return p.phone;
  }
  return null;
}

async function fetchAllStudents(): Promise<Student[]> {
  let page = 1;
  const allStudents: Student[] = [];

  while (true) {
    console.log("Fetching page", page);

    const params = new URLSearchParams({
      paginate: "500",
      page: String(page),
      "roles[0]": "3",
    });

    try {
      const res = await fetch(
        `https://nvsapi.learnovia.com/api/user/get-all?${params.toString()}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const json = await res.json();
      const body = json.body;

      if (!body || !Array.isArray(body.data)) {
        console.warn("Invalid response structure", json);
        break;
      }

      allStudents.push(...body.data);
      console.log(`Page ${page}: ${body.data.length} students`);

      if (!body.next_page_url) {
        break;
      }

      page++;
    } catch (err) {
      console.error("Error fetching students:", err);
      break;
    }
  }

  console.log(`Total students fetched: ${allStudents.length}`);
  return allStudents;
}

function preload() {
  console.log("Preloading resources...");

  const style = document.createElement("style");
  style.innerHTML = cssStyles;
  document.head.appendChild(style);

  const fa = document.createElement("link");
  fa.rel = "stylesheet";
  fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
  fa.onload = () => console.log("Font Awesome loaded");
  document.head.appendChild(fa);
}


function mountModal() {
  console.log("Mounting modal...");

  let students: Student[] = [];
  const selected = new Set<number>();

  const modal = document.createElement("div");
  modal.className = "model hidden";

  const header = document.createElement("div");
  header.className = "model__header";

  const title = document.createElement("h3");
  title.className = "model__title";
  title.textContent = "إرسال رسالة واتساب";

  const closeBtn = document.createElement("button");
  closeBtn.className = "model__close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    console.log("Modal closed");
    modal.classList.add("hidden");
  };

  header.appendChild(title);
  header.appendChild(closeBtn);

  const authWrapper = document.createElement("div");
  authWrapper.className = "auth-wrapper";

  const loadingText = document.createElement("p");
  loadingText.className = "loading-text";
  loadingText.textContent = "جاري الاتصال بخادم WhatsApp...";

  const qrPlaceholder = document.createElement("div");
  qrPlaceholder.className = "qr-placeholder";
  qrPlaceholder.innerHTML = `
    <i class="fas fa-qrcode"></i>
    <p>سيتم عرض رمز QR هنا</p>
  `;
  qrPlaceholder.style.display = "none";

  const qrText = document.createElement("div");
  qrText.className = "qr-text";


  const authBtn = document.createElement("button");
  authBtn.textContent = "إتمام المسح والتحقق";
  authBtn.style.display = "none";

  const errorText = document.createElement("p");
  errorText.className = "error-text";
  errorText.style.display = "none";

  authWrapper.appendChild(loadingText);
  authWrapper.appendChild(qrPlaceholder);
  authWrapper.appendChild(qrText);
  authWrapper.appendChild(authBtn);
  authWrapper.appendChild(errorText);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "hidden";

  const searchInput = document.createElement("input");
  searchInput.className = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "بحث بالاسم...";

  const selectedCountElement = document.createElement("div");
  selectedCountElement.className = "selected-count";
  selectedCountElement.textContent = "لم يتم تحديد أي طالب";

  const studentsList = document.createElement("div");
  studentsList.className = "students-list";

  const loadingStudents = document.createElement("div");
  loadingStudents.className = "loading-text";
  loadingStudents.textContent = "جاري تحميل الطلاب… قد يستغرق ذلك بضع ثوانٍ حسب عدد الطلاب";
  studentsList.appendChild(loadingStudents);

  const messageTextarea = document.createElement("textarea");
  messageTextarea.placeholder = "اكتب الرسالة هنا...";
  messageTextarea.rows = 4;

  const sendButton = document.createElement("button");
  sendButton.className = "send-button";
  sendButton.textContent = "إرسال الرسالة";
  sendButton.disabled = true;

  contentWrapper.appendChild(searchInput);
  contentWrapper.appendChild(selectedCountElement);
  contentWrapper.appendChild(studentsList);
  contentWrapper.appendChild(messageTextarea);
  contentWrapper.appendChild(sendButton);

  const progressWrapper = document.createElement("div");
  progressWrapper.className = "progress-wrapper hidden";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progressFill = document.createElement("div");
  progressFill.className = "progress-fill";
  progressFill.style.width = "0%";

  const progressText = document.createElement("div");
  progressText.className = "progress-text";
  progressText.textContent = "جاري الإرسال...";

  progressBar.appendChild(progressFill);
  progressWrapper.appendChild(progressBar);
  progressWrapper.appendChild(progressText);

  contentWrapper.appendChild(progressWrapper);

  modal.appendChild(header);
  modal.appendChild(authWrapper);
  modal.appendChild(contentWrapper);

  document.body.appendChild(modal);
  console.log("Modal mounted to DOM");

  function updateSelectedCount() {
    const count = document.querySelectorAll(
      '.student-item input[type="checkbox"]:checked'
    ).length;
    selectedCountElement.textContent = `تم تحديد ${count} طالب`;
    sendButton.disabled = count === 0;
  }

  function renderStudentRow(student: Student): HTMLDivElement {
    const row = document.createElement("div");
    row.className = "student-item";
    row.dataset.id = String(student.id);
    row.dataset.name = (student.fullname || "").toLowerCase();

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = selected.has(student.id);

    cb.onchange = () => {
      if (cb.checked) {
        selected.add(student.id);
      } else {
        selected.delete(student.id);
      }
      updateSelectedCount();
    };

    const info = document.createElement("div");
    info.className = "student-info";

    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent =
      student.fullname || `${student.firstname} ${student.lastname}`;

    info.appendChild(name);

    const phone = resolvePhone(student);
    if (!phone) {
      const noPhone = document.createElement("small");
      noPhone.className = "no-phone";
      noPhone.textContent = "لا يوجد رقم هاتف";
      info.appendChild(noPhone);
    }

    row.appendChild(cb);
    row.appendChild(info);
    return row;
  }

  function createSelectAll(): HTMLLabelElement {
    const wrapper = document.createElement("label");
    wrapper.className = "select-all-wrapper";

    const cb = document.createElement("input");
    cb.type = "checkbox";

    const label = document.createElement("span");
    label.textContent = "تحديد الكل";

    cb.onchange = () => {
      const checkboxes = studentsList.querySelectorAll<HTMLInputElement>(
        '.student-item input[type="checkbox"]'
      );

      checkboxes.forEach((checkbox) => {
        checkbox.checked = cb.checked;

        const row = checkbox.closest(".student-item") as HTMLDivElement;
        const studentId = parseInt(row.dataset.id || "0", 10);

        if (studentId > 0) {
          if (cb.checked) {
            selected.add(studentId);
          } else {
            selected.delete(studentId);
          }
        }
      });

      updateSelectedCount();
    };

    wrapper.appendChild(cb);
    wrapper.appendChild(label);
    return wrapper;
  }

  async function checkWhatsAppStatus() {
    console.log("Checking WhatsApp status...");

    try {
      loadingText.style.display = "block";
      loadingText.textContent = "جاري الاتصال بالخادم...";
      qrPlaceholder.style.display = "none";
      qrText.style.display = "none";
      authBtn.style.display = "none";
      errorText.style.display = "none";

      const res = await fetch("http://localhost:3000/status?_=" + Date.now());

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      console.log("📊 WhatsApp Status:", data);

      if (data.authenticated) {
        console.log("Already authenticated");
        authWrapper.classList.add("hidden");
        contentWrapper.classList.remove("hidden");

        if (students.length === 0) {
          students = await fetchAllStudents();
          loadingStudents.remove();

          const selectAllWrapper = createSelectAll();
          studentsList.appendChild(selectAllWrapper);

          students.forEach((student) => {
            const row = renderStudentRow(student);
            studentsList.appendChild(row);
          });
        }
      } else {
        console.log("Not authenticated");

        if (data.qr) {
          loadingText.textContent = "قم بمسح رمز QR باستخدام WhatsApp";
          loadingText.style.display = "block";

          qrPlaceholder.style.display = "flex";

          qrText.textContent = data.qr;
          qrText.style.display = "block";

          const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data.qr)}`;

          const qrImage = document.createElement("img");
          qrImage.src = qrLink;
          qrImage.style.width = "240px";
          qrImage.style.height = "240px";
          qrImage.style.borderRadius = "8px";
          qrImage.style.margin = "10px auto";
          qrImage.style.display = "block";

          qrPlaceholder.innerHTML = "";
          qrPlaceholder.appendChild(qrImage);

          authBtn.style.display = "inline-block";
          authBtn.textContent = "إتمام المسح والتحقق";
        } else {
          errorText.textContent = "فشل في الحصول على رمز QR. حاول مرة أخرى.";
          errorText.style.display = "block";
          loadingText.style.display = "none";
        }
      }
    } catch (err) {
      console.error("Error checking WhatsApp status:", err);
      errorText.textContent = "فشل الاتصال بالخادم: " + (err instanceof Error ? err.message : String(err));
      errorText.style.display = "block";
      loadingText.style.display = "none";
    }
  }

  authBtn.onclick = async () => {
    console.log("Verifying authentication...");
    authBtn.disabled = true;
    authBtn.textContent = "جاري التحقق...";
    errorText.style.display = "none";

    const MAX_RETRIES = 10;
    let attempt = 0;

    const interval = setInterval(async () => {
      attempt++;
      console.log(`Checking auth attempt ${attempt}`);

      try {
        const res = await fetch("http://localhost:3000/status?_=" + Date.now());
        const data = await res.json();

        console.log("Verification result:", data);

        if (data.authenticated) {
          clearInterval(interval);

          console.log("Authentication successful");
          authWrapper.classList.add("hidden");
          contentWrapper.classList.remove("hidden");

          if (students.length === 0) {
            students = await fetchAllStudents();
            loadingStudents.remove();

            const selectAllWrapper = createSelectAll();
            studentsList.appendChild(selectAllWrapper);

            const frag = document.createDocumentFragment();

            students.forEach(student => {
              frag.appendChild(renderStudentRow(student));
            });

            studentsList.appendChild(createSelectAll());
            studentsList.appendChild(frag);
            loadingStudents.remove();
          }
        } else if (attempt >= MAX_RETRIES) {
          clearInterval(interval);

          errorText.textContent =
            "تم مسح QR لكن الاتصال لم يكتمل بعد. حاول مرة أخرى بعد ثواني.";
          errorText.style.display = "block";
          authBtn.disabled = false;
          authBtn.textContent = "إتمام المسح والتحقق";
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Verification error:", err);

        errorText.textContent = "فشل التحقق من الحالة";
        errorText.style.display = "block";
        authBtn.disabled = false;
        authBtn.textContent = "إتمام المسح والتحقق";
      }
    }, 1000);
  };


  searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    const rows = studentsList.querySelectorAll(".student-item");

    rows.forEach((row) => {
      const htmlRow = row as HTMLDivElement;
      const name = htmlRow.dataset.name || "";
      htmlRow.style.display = name.includes(query) ? "flex" : "none";
    });
  };

  sendButton.onclick = async () => {
    const message = messageTextarea.value.trim();

    if (!message) {
      alert("الرجاء كتابة الرسالة أولاً");
      return;
    }

    if (selected.size === 0) {
      alert("الرجاء تحديد طالب واحد على الأقل");
      return;
    }

    const selectedStudents = students.filter((s) => selected.has(s.id));
    const numbers = selectedStudents
      .map((s) => resolvePhone(s))
      .filter((phone): phone is string => phone !== null);

    if (numbers.length === 0) {
      alert("لا يوجد أرقام هاتف صالحة للطلاب المحددين");
      return;
    }

    console.log("Sending message to:", numbers);
    console.log("Message:", message);

    sendButton.disabled = true;
    sendButton.textContent = "جاري الإرسال...";
    progressWrapper.classList.remove("hidden");
    progressFill.style.width = "0%";

    try {
      const res = await fetch("http://localhost:3000/send-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, numbers }),
      });

      const result = await res.json();

      console.log("Send result:", result);

      progressFill.style.width = "100%";
      progressText.textContent = `تم إرسال ${result.summary?.sent || numbers.length} رسالة بنجاح!`;

      setTimeout(() => {
        progressWrapper.classList.add("hidden");
        sendButton.disabled = false;
        sendButton.textContent = "إرسال الرسالة";
        messageTextarea.value = "";

        if (result.summary?.sent > 0) {
          alert(`تم الإرسال بنجاح إلى ${result.summary.sent} رقم`);
        } else {
          alert("لم يتم إرسال أي رسائل");
        }
      }, 2000);
    } catch (err) {
      console.error("❌ Send error:", err);
      alert("فشل الإرسال. حاول مرة أخرى.");
      sendButton.disabled = false;
      sendButton.textContent = "إرسال الرسالة";
      progressWrapper.classList.add("hidden");
    }
  };

  window.addEventListener('wa:open', () => {
    console.log("wa:open event fired - Checking WhatsApp status...");
    checkWhatsAppStatus();
  });
}

function renderWhatsAppIcon() {
  console.log("Rendering WhatsApp icon...");

  const btn = document.createElement("button");
  btn.className = "whatsapp__wrapper";
  btn.innerHTML = `<i class="fa-brands fa-whatsapp fa-2xl"></i>`;
  btn.title = "إرسال رسالة واتساب";

  btn.onclick = () => {
    console.log("WhatsApp icon clicked");

    const modal = document.querySelector(".model");

    if (!modal) {
      console.error("Modal not found in DOM!");
      return;
    }

    const isHidden = modal.classList.contains("hidden");
    console.log("Modal current state:", isHidden ? "hidden" : "visible");

    modal.classList.toggle("hidden");

    if (isHidden) {
      console.log("Dispatching wa:open event");
      window.dispatchEvent(new Event('wa:open'));
    }
  };

  document.body.appendChild(btn);
  console.log("WhatsApp icon added to DOM");
}

console.log("Initializing WhatsApp integration...");
preload();
mountModal();
renderWhatsAppIcon();
console.log("Initialization complete");

(window as any).openWhatsAppModal = () => {
  document.querySelector(".model")?.classList.remove("hidden");
  window.dispatchEvent(new Event('wa:open'));
};
