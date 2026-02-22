export const backendUrl = import.meta.env.PROD
  ? "https://dashboard.kodhub.dev"
  : "http://localhost:3000";

export const api = {
  admin: {
    auth: {
      login: `${backendUrl}/admin/auth/login`,
      me: `${backendUrl}/admin/auth/me`,
    },
    dashboard: {
      stats: `${backendUrl}/admin/schools/`,
      logs: `${backendUrl}/admin/schools/logs`,
      createSchool: `${backendUrl}/admin/schools/`,
      updateSchool: `${backendUrl}/admin/schools/:id`,
      deleteSchool: `${backendUrl}/admin/schools/:id`,
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
