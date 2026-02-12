export const ROLES = [
  { id: 1, name: "Super Admin", description: "System super administrator." },
  { id: 2, name: "System Admin", description: "System administrator." },
  { id: 3, name: "Student", description: "System student." },
  { id: 4, name: "Teacher", description: "System teacher." },
  { id: 5, name: "Manager", description: "System manager." },
  { id: 6, name: "Supervisor", description: "System supervisor." },
  { id: 7, name: "Parent", description: "System parent." },
] as const;

export const LEVELS = [
  "Pre-KG",
  "KG1",
  "KG2",
  "Prim 1",
  "Prim 2",
  "Prim 3",
  "Prim 4",
  "Prim 5",
  "Prim 6",
  "Prep 1",
  "Prep 2",
  "Prep 3",
  "Sec 1",
  "Sec 2",
  "Sec 3",
] as const;

export const CSS_STYLES = `
* {
  margin:0;
  padding:0;
  box-sizing: border-box;
}

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
  top: 0%;
  left: 0%;
  background: #f7f8fa;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  box-shadow: 0 12px 30px rgba(0,0,0,.3);
  font-family: system-ui, sans-serif;
  overflow-y: auto;
  direction: rtl;
}

.model__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  background: #6339f5;
  color: white;
  padding: 16px;
}

.model__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display:flex;
  align-items:center;
  gap: 12px;
}

.model__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: white;
  padding: 4px 8px;
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
  background: #5b3bd1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.auth-wrapper button:hover:not(:disabled) {
  background: #8571ca;
}

.auth-wrapper button:disabled {
  background: #9be5b5;
  cursor: not-allowed;
}

.filters-section {
  display: flex;
  gap: 12px;
  padding: 20px 16px;
}

select {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAMAAACtdX32AAAAdVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhMdQaAAAAJ3RSTlMAAAECAwQGBwsOFBwkJTg5RUZ4eYCHkJefpaytrsXGy8zW3+Do8vNn0bsyAAAAYElEQVR42tXROwJDQAAA0Ymw1p9kiT+L5P5HVEi3qJn2lcPjtIuzUIJ/rhIGy762N3XaThqMN1ZPALsZPEzG1x8LrFL77DHBnEMxBewz0fJ6LyFHTPL7xhwzWYrJ9z22AqmQBV757MHfAAAAAElFTkSuQmCC) !important;
  background-position: center left 2% !important;
  background-repeat: no-repeat !important;
}


.filter-select {
  width:100%;
  min-width: 150px;
  height: 40px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
  background: #fff;
  border: 1px solid hsl(200 10% 88%);
  color: hsl(200 10% 45%);
}

.filter-select:focus {
  outline: none;
  border-color: #8571ca;
}

.filter-select:not(:disabled):hover {
  border-color: #8571ca;
}

.students-table-wrapper {
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
}

.students-table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.students-table-wrapper::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  padding: 0 16px;
}

.students-table thead {
  background-color: #f7f8fa;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.students-table th {
  padding: 12px 8px;
  text-align: right;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #eee;
  white-space: nowrap;
}

.students-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.students-table tbody tr:hover {
  background-color: #e3e9ec;
}

.students-table tbody tr {
  background-color: #fff;
}

.students-table tbody tr.selected {
  background-color: #e8f1f5;
}

tr {
  display: flex;
  justify-content: space-around;
}

td, th{
  width:100%;
  text-align: center !important;
  display: flex;
  justify-content: center;
}


.select-cell {
  width: 40px;
  text-align: center;
}

.select-cell input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.avatar-cell {
  width: 60px;
}

.student-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: 500;
}

.student-avatar.placeholder {
  background-color: #5b45ac;
  color: white;
}

.name-cell {
  font-weight: 500;
  color: #333;
}

.role-cell,
.level-cell,
.email-cell,
.phone-cell {
  color: #666;
}

.email-cell {
  direction: ltr;
  text-align: left;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  background: #f7f8fa;
  padding: 12px 16px;
  border-bottom: 1px solid hsl(200 10% 88%);
}

.selected-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.select-all-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.select-all-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.select-all-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  margin: 0;
}

.model textarea {
  width: 75%;
  margin: 0 auto;
  min-height: 200px;
  display: block;
  resize: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: semibold;
  font-family: inherit;
  margin-bottom: 16px;
  background: white;
  border: 1px solid hsl(200 10% 88%);
  color: hsl(200 15% 15%);
}

.model textarea:focus {
  outline: none;
  border-color: #7359d1;
}

textarea::placeholder {
  color:hsl(200 10% 45%);
}

.send-button {
  width: 20%;
  margin: 0 auto;
  padding: 14px;
  background: #734cf7;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.send-button:hover:not(:disabled) {
  background: #6339f5;
}

.send-button:disabled {
  background: #a08aec;
  cursor: not-allowed;
}

.loading-text {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
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

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.phone-filter-button {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  border: 1px solid hsl(200 10% 88%);
  color: hsl(200 10% 45%);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.phone-filter-button:hover {
  border-color: hsl(214, 62%, 40%);
}

.phone-filter-button.active {
  background: hsl(142 30% 90%);
  color: hsl(142 50% 25%);
  border-color: hsl(224, 78%, 53%);
}

.phone-filter-button i {
  font-size: 16px;
}

.search-input {
  width:100%;
  min-width: 200px;
  max-width: 400px;
  flex-grow: 1;
  height: 40px;
  border-radius: 8px;
  border: 1px solid hsl(200 10% 88%);
  background: #fff;
  padding: 4px 8px;
  color: hsl(200 15% 15%);
}

input:focus {
 outline: none;
}

::placeholder {
  color: hsl(200 10% 45%);
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border-bottom: 1px solid hsl(200 10% 88%);
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  height: 40px;
  background: #4823ce;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.upload-button:hover:not(:disabled) {
  background: #5f3be0;
}

.upload-button:disabled {
  background: #9687cf;
  cursor: not-allowed;
}

.data-source-info {
  flex: 1;
  text-align: center;
}

.data-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.data-source-info {
  display: flex;
  align-items: center;
  gap: 2px;
}

.data-source-label{
  font-weight: bold;
}

.clear-excel-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  height: 40px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.clear-excel-button:hover {
  background: #bb2d3b;
}

.file-input {
  display: none;
}

.template-link {
  color: #0d6efd;
  text-decoration: none;
  font-size: 13px;
  cursor: pointer;
}

.template-link:hover {
  text-decoration: underline;
}

.upload-progress {
  width: 100%;
  margin-top: 8px;
}

.upload-progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.upload-progress-fill {
  height: 100%;
  background: #198754;
  transition: width 0.3s;
}

.upload-progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 4px;
}

.auth-wrapper {
  text-align: center;
  padding: 40px 20px;
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
  color: #4823ce;
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
  background: #4823ce;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.auth-wrapper button:hover:not(:disabled) {
  background: #7868b3;
}

.auth-wrapper button:disabled {
  background: #9be5b5;
  cursor: not-allowed;
}

.loading-text {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
}


.table-loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 10px 0;
}

.table-loading i {
  display: block;
  font-size: 24px;
  margin-bottom: 10px;
  color: #25d366;
}

.upload-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
  color: #666;
}

.upload-progress i {
  font-size: 16px;
  color: #25d366;
}

.model {
  transition: opacity 0.3s ease;
}

.model.hidden {
  opacity: 0;
  pointer-events: none;
}

.model:not(.hidden) {
  opacity: 1;
}

.upload-button:disabled,
.send-button:disabled,
.verify-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.data-source-badge.excel-source {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

`;

export const API_BASE_URL = "https://nvsapi.learnovia.com/api";
export const WHATSAPP_API_URL = "http://localhost:3000";
export const PROD_WHATSAPP_API_URL = "https://api.kodhub.dev";
