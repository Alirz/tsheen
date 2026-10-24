export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'https://localhost:44365',
  authUrl: import.meta.env.VITE_AUTH_URL ?? 'https://localhost:44365',
  appUrl: import.meta.env.VITE_APP_URL ?? 'https://localhost:3000',
  oauth: {
    issuer: `${(import.meta.env.VITE_AUTH_URL ?? 'https://localhost:44365').replace(/\/$/, '')}/`,
    redirectUri: import.meta.env.VITE_APP_URL ?? 'https://localhost:3000',
    clientId: 'Tsheen_App',
    scope: 'offline_access openid profile email phone roles Tsheen',
  },
}
