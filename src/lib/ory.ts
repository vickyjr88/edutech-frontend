import { Configuration, FrontendApi } from '@ory/client-fetch';

// Your Ory Network project's public API URL
// Replace <project_slug> with your actual project slug from Ory Console
const ORY_BASE_URL = `https://${import.meta.env.VITE_ORY_PROJECT_SLUG}.projects.oryapis.com`;

// Your local Ory Tunnel URL
const ORY_PROXY_URL = import.meta.env.VITE_ORY_SDK_URL || 'http://localhost:4000';

// Initialize Ory client for local proxy (used by default for browser flows)
export const ory = new FrontendApi(
  new Configuration({
    basePath: ORY_PROXY_URL,
    credentials: 'include',
  }),
);

// Utility function to check if Ory Network is reachable
export async function checkOryAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${ORY_PROXY_URL}/health/ready`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Ory Network availability check failed:', error);
    return false;
  }
}

// Utility function to get the base URL for Ory API calls
// Returns ORY_PROXY_URL if available, otherwise null (indicating fallback)
export async function getOryBaseUrl(): Promise<string | null> {
  const isOryAvailable = await checkOryAvailability();
  if (isOryAvailable) {
    return ORY_PROXY_URL;
  } else {
    console.warn('Ory Network is not reachable. Falling back to native authentication.');
    return null;
  }
}

// Utility function to make a GET request to an Ory endpoint
export async function oryGet(path: string) {
  const baseUrl = await getOryBaseUrl();
  if (!baseUrl) {
    throw new Error('Ory Network is not available.');
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Ory GET request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making GET request to Ory path ${path}:`, error);
    throw error;
  }
}
