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
    background-color: #fff;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }


  .model {
    position: fixed;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;
    width: 512px;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 12px;
  }

  .model__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .model__close {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  .model_title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 0px !important;
  }

  .model_content {
    margin-top: 12px;
    flex: 1;
  }

  .model_textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .model_textarea:focus {
    outline: none;
    border-color: #007bff;
  }

  .hidden {
    display: none;
  }

  .show {
    display: unset;
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

  const content = document.createElement("div");
  content.classList.add("model_content");

  const input = document.createElement("textarea");
  input.classList.add("model_textarea");
  input.placeholder = "الرسالة";

  header.appendChild(close);
  header.appendChild(title);

  content.appendChild(input);

  model.appendChild(header);
  model.appendChild(content);

  document.querySelector("body")?.appendChild(model);
  document.addEventListener("click", toggleModel);
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
