/**
 * Global API client for the application
 *
 * This file provides a centralized API client for making requests to various endpoints
 * including Cloudflare and other services.
 */

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Default request headers
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `API request failed with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

/**
 * API client with methods for different endpoints
 */
export const api = {
  // Generic methods
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),

  // File upload method (doesn't use JSON stringification)
  upload: <T>(endpoint: string, formData: FormData, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Let the browser set the correct Content-Type with boundary
      ...options,
    }),

  // Specific API endpoints
  images: {
    getAll: () => api.get("/api/images"),
    getById: (id: string) => api.get(`/api/images/${id}`),
    upload: (formData: FormData) => api.upload("/api/images/upload", formData),
    delete: (id: string) => api.delete(`/api/images/${id}`),
    update: (id: string, data: any) => api.patch(`/api/images/${id}`, data),
  },

  // Cloudflare specific endpoints
  cloudflare: {
    uploadImage: (formData: FormData) => {
      const CLOUDFLARE_ACCOUNT_ID =
        import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "";
      const CLOUDFLARE_API_TOKEN =
        import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "";
      const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

      return apiRequest(CLOUDFLARE_IMAGES_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
      });
    },

    getImages: (page = 1, perPage = 100) => {
      const CLOUDFLARE_ACCOUNT_ID =
        import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "";
      const CLOUDFLARE_API_TOKEN =
        import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "";
      const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

      return apiRequest(
        `${CLOUDFLARE_IMAGES_API_URL}?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    },

    deleteImage: (imageId: string) => {
      const CLOUDFLARE_ACCOUNT_ID =
        import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "";
      const CLOUDFLARE_API_TOKEN =
        import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "";
      const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

      return apiRequest(`${CLOUDFLARE_IMAGES_API_URL}/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
    },

    getImageDetails: (imageId: string) => {
      const CLOUDFLARE_ACCOUNT_ID =
        import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "";
      const CLOUDFLARE_API_TOKEN =
        import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "";
      const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

      return apiRequest(`${CLOUDFLARE_IMAGES_API_URL}/${imageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
    },
  },

  // Auth endpoints example
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post("/api/auth/login", credentials),
    register: (userData: { email: string; password: string; name: string }) =>
      api.post("/api/auth/register", userData),
    logout: () => api.post("/api/auth/logout"),
    getProfile: () => api.get("/api/auth/profile"),
  },
};
