declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient
        }
      }
    };
  }
}

interface TokenResponse {
  access_token?: string;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (tokenResponse: TokenResponse) => void;
}

interface TokenClient {
  requestAccessToken: () => void;
}

export function getNewAccessToken(): Promise<string> {

  return new Promise((resolve, reject) => {

    const initTokenClient = window.google?.accounts.oauth2.initTokenClient;
    if (!initTokenClient) {
      return reject('Google OAuth2 client is not initialized');
    }

    const client: TokenClient = initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      scope: 'https://www.googleapis.com/auth/tasks',
      callback: (tokenResponse: TokenResponse) => {
        if (tokenResponse?.access_token) {
          localStorage.setItem('google_access_token', tokenResponse.access_token);
          resolve(tokenResponse.access_token);
        } else {
          reject('Failed to get access token');
        }
      },
    });

    client.requestAccessToken()
  })
}

export function userInfo() {
  const userInfo = localStorage.getItem('user_info');
  if (!userInfo) {
    return null;
  }
  return JSON.parse(userInfo);
}

export function logout() {
  localStorage.clear();
  window.location.href = '/';
}

export function getMyanmarTime(date?: Date | string): string {
  const baseDate = date ? new Date(date) : new Date();
  const myanmarOffsetMs = 6.5 * 60 * 60 * 1000; // 6.5 hours in milliseconds

  return new Date(baseDate.getTime() + myanmarOffsetMs).toISOString();
}