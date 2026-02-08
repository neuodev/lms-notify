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
  background: #fff;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
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

/* Filters Section */
.filters-section {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #25d366;
}

.filter-select:hover {
  border-color: #bbb;
}

/* Table Styles */
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
}

.students-table thead {
  background-color: #f8f9fa;
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
  background-color: #f7f7f7;
}

.students-table tbody tr.selected {
  background-color: #e8f5e9;
}

/* Table cell specific styles */
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
  background-color: #4caf50;
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

/* Table Controls */
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
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
}

.model textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  font-family: inherit;
  margin-bottom: 16px;
}

.model textarea:focus {
  outline: none;
  border-color: #25d366;
}

.send-button {
  width: 100%;
  padding: 14px;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
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
  gap: 8px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.phone-filter-button:hover {
  background: #e9ecef;
  border-color: #bbb;
}

.phone-filter-button.active {
  background: #25d366;
  color: white;
  border-color: #25d366;
}

.phone-filter-button i {
  font-size: 16px;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #198754;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.upload-button:hover:not(:disabled) {
  background: #157347;
}

.upload-button:disabled {
  background: #6c757d;
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

.data-source-badge.api-source {
  background: #0d6efd;
  color: white;
}

.data-source-badge.excel-source {
  background: #198754;
  color: white;
}

.clear-excel-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
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

/* File input styling */
.file-input {
  display: none;
}

/* Template download link */
.template-link {
  color: #0d6efd;
  text-decoration: none;
  font-size: 13px;
  cursor: pointer;
}

.template-link:hover {
  text-decoration: underline;
}

/* Upload progress */
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

/* Smooth transitions */
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

/* Better button states */
.upload-button:disabled,
.send-button:disabled,
.verify-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Excel data indicator */
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
