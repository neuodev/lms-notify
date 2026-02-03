// console.log("Injected via Electron!");
// // Your custom code here
// fetch(
//   "https://me.classera.com/schadmin/supervisors?page=1&orderColName=User.id&networkfirst=1&recordsTotal=0&draw=1&columns%5B0%5D%5Bdata%5D=&columns%5B0%5D%5Bname%5D=&columns%5B1%5D%5Bdata%5D=User.number&columns%5B1%5D%5Bname%5D=User.number&columns%5B2%5D%5Bdata%5D=User.full_name&columns%5B2%5D%5Bname%5D=full_name&columns%5B3%5D%5Bdata%5D=User.supervisors_school_name&columns%5B3%5D%5Bname%5D=User.supervisors_school_name&columns%5B4%5D%5Bdata%5D=User.role_id&columns%5B4%5D%5Bname%5D=User.role_id&columns%5B5%5D%5Bdata%5D=User.specialization&columns%5B5%5D%5Bname%5D=specialization&columns%5B6%5D%5Bdata%5D=User.job_title&columns%5B6%5D%5Bname%5D=User.job_title&columns%5B7%5D%5Bdata%5D=User.last_activity_date&columns%5B7%5D%5Bname%5D=User.last_activity_date&columns%5B8%5D%5Bdata%5D=&columns%5B8%5D%5Bname%5D=&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=50&search%5Bvalue%5D=&search%5Bregex%5D=false",
//   {
//     headers: {
//       accept: "application/json, text/javascript, */*; q=0.01",
//       "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"macOS"',
//       "x-requested-with": "XMLHttpRequest",
//     },
//     referrer: "https://me.classera.com/schadmin/supervisors",
//     body: null,
//     method: "GET",
//     mode: "cors",
//   },
// )
//   .then((res) => res.json())
//   .then(console.log);
//
const token = localStorage.getItem("token")

// fetch("https://nvsapi.learnovia.com/api/user/get-all?page=1&paginate=10", {
//   "headers": {
//     "accept": "application/json",
//     "authorization": `Bearer ${token}`,
//     "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Linux\""
//   },
//   "referrer": "https://nvs.learnovia.com/",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// })
//   .then((res) => res.json())
//   .then((res) => console.log("DATA", res));

fetch("https://nvsapi.learnovia.com/api/user/get-all?paginate=10&page=1&roles%5B0%5D=3", {
  "headers": {
    "accept": "application/json",
    "authorization": `Bearer ${token}`,
    "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
  },
  "referrer": "https://nvs.learnovia.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then((res) => res.json())
  .then((res) => console.log("DATA STUDENT", res))
// .then((data) => console.log("DATA STUDENT", { data.roles?.name }));

// var child = document.createElement('link')
// child.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css');
// child.setAttribute('rel', 'stylesheet');
// child.setAttribute('integrity', 'sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB');
// child.setAttribute('crossorigin', 'anonymous');
// document.querySelector('head').appendChild(child)

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
}

.whatsapp__wrapper:hover {
  transform: scale(1.05);
}

.model {
  position: fixed;
  z-index: 10000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 420px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0,0,0,.3);
  padding: 16px;
  font-family: system-ui, sans-serif;
}

.model__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.model_title {
  font-size: 16px;
  font-weight: 600;
}

.model__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.model_content {
  margin-top: 12px;
}

.model_textarea {
  width: 100%;
  min-height: 80px;
  resize: none;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.model_textarea:focus {
  outline: none;
  border-color: #25d366;
}

.model select {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.model button.send {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.model button.send:disabled {
  background: #9be5b5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}
  `;

function preload() {
  const style = document.createElement("style");
  style.innerHTML = cssStyles;

  const fontAwesome = document.createElement("link");
  fontAwesome.setAttribute(
    "href",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css",
  );
  fontAwesome.setAttribute("rel", "stylesheet");
  fontAwesome.setAttribute("crossorigin", "anonymous");

  const head = document.querySelector("head");
  head?.appendChild(fontAwesome);
  head?.appendChild(style);
}

function toggleModel(event: PointerEvent) {
  const whatsapp = document.querySelector(".whatsapp__wrapper");
  const model = document.querySelector(".model");

  if (
    !model?.contains(event?.target as Node) &&
    !whatsapp?.contains(event?.target as Node)
  ) {
    model?.classList.add("hidden");
    model?.classList.remove("show");
  }
}

function mountModel() {
  const model = document.createElement("div");
  model.setAttribute("class", "model hidden");
  model.setAttribute("dir", "rtl");

  const header = document.createElement("div");
  header.classList.add("model__header");

  const title = document.createElement("h2");
  title.classList.add("model_title");
  title.innerText = "إشعارات الواتساب";

  const close = document.createElement("button");
  close.classList.add("model__close");
  close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  close.addEventListener("click", () => {
    model?.classList.add("hidden");
    model?.classList.remove("show");
  });

  const select = document.createElement("select");
  select.style.width = "100%";
  select.style.marginTop = "12px";
  select.style.padding = "8px";

  select.innerHTML = `
  <option value="">-- اختار المستلمين --</option>
  <option value="all-parents">كل أولياء الأمور</option>
  <option value="teachers">كل المدرسين</option>

    <optgroup label="الجروبات">
    <option value="group:class-1a">أولياء أمور فصل 1A</option>
    <option value="group:teachers">جروب المدرسين</option>
  </optgroup>
`;

  const content = document.createElement("div");
  content.classList.add("model_content");

  const input = document.createElement("textarea");
  input.classList.add("model_textarea");
  input.placeholder = "الرسالة";


  const sendButton = document.createElement("button");
  sendButton.innerText = "إرسال";
  sendButton.style.marginTop = "12px";
  sendButton.style.padding = "8px";
  sendButton.style.cursor = "pointer";
  sendButton.style.width = "100%";

  sendButton.addEventListener("click", async () => {
    const message = input.value.trim();
    const target = select.value;

    if (!message) {
      alert("اكتب الرسالة");
      return;
    }

    if (!target) {
      alert("اختار المستلمين");
      return;
    }

    sendButton.classList.add("send");
    sendButton.disabled = true;
    sendButton.innerText = "جارٍ الإرسال...";
    try {
      await fetch("http://localhost:3000/msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          target,
        }),
      });

      sendButton.disabled = false;
      sendButton.innerText = "إرسال عبر واتساب";

      input.value = "";
      input.focus();
      // sendButton.disabled = true;
      // sendButton.innerText = "جارٍ الإرسال...";

      alert("تم إرسال الرسالة بنجاح");
      input.value = "";
    } catch (err) {
      console.error(err);
      alert("فشل الإرسال");
    }
  });

  header.appendChild(close);
  header.appendChild(title);

  content.appendChild(input);
  content.appendChild(select);
  content.appendChild(sendButton);

  model.appendChild(header);
  model.appendChild(content);

  document.querySelector("body")?.appendChild(model);
  document.addEventListener("click", () => toggleModel);
}

function renderWhatsAppIcon() {
  const button = document.createElement("button");
  button.setAttribute("class", "whatsapp__wrapper");
  button.addEventListener("click", () => {
    const model = document.querySelector(".model");
    model?.classList.toggle("hidden");
    model?.classList.toggle("show");
  });

  const icon = document.createElement("i");
  icon.setAttribute("class", "fa-brands fa-whatsapp fa-2xl");

  button.appendChild(icon);
  document.querySelector("body")?.appendChild(button);
}

preload();
renderWhatsAppIcon();
mountModel();
