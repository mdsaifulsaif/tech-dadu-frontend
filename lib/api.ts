const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include", // Vital to send and receive refresh token httpOnly cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: "Network error or invalid server response",
  }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Auth API Methods
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (codeOrToken: string, email?: string) =>
    apiRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ code: codeOrToken, email }),
    }),

  resendVerification: (email: string) =>
    apiRequest("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  googleSync: (profile: {
    email?: string;
    name?: string;
    image?: string;
    googleId?: string;
    idToken?: string;
  }) =>
    apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify(profile),
    }),

  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiRequest(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  getMe: (token?: string) =>
    apiRequest("/auth/me", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};

// Category API Methods
export const categoryApi = {
  getAll: (type?: "product" | "blog" | "template" | "all") => {
    const query = type ? `?type=${type}` : "";
    return apiRequest(`/categories${query}`);
  },
  getBySlug: (slug: string) => apiRequest(`/categories/${slug}`),
};

// Product API Methods
export const productApi = {
  getAll: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ""}`);
  },

  getBySlug: (slug: string) => apiRequest(`/products/${slug}`),

  getById: (id: string) => apiRequest(`/products/id/${id}`),

  trackClick: (id: string, platform?: string) =>
    apiRequest(`/products/${id}/click`, {
      method: "POST",
      body: JSON.stringify({ platform }),
    }),
};

// Template / Digital Product API Methods
export const templateApi = {
  getAll: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(`/templates${queryString ? `?${queryString}` : ""}`);
  },
  getBySlug: (slug: string) => apiRequest(`/templates/${slug}`),
  getById: (id: string) => apiRequest(`/templates/id/${id}`),
  trackAction: (id: string, type: "download" | "live_demo") =>
    apiRequest(`/templates/${id}/action`, {
      method: "POST",
      body: JSON.stringify({ type }),
    }),
};

// Blog API Methods
export const blogApi = {
  getAll: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(`/blogs${queryString ? `?${queryString}` : ""}`);
  },
  getBySlug: (slug: string) => apiRequest(`/blogs/${slug}`),
  getById: (id: string) => apiRequest(`/blogs/id/${id}`),
  getRelated: (id: string) => apiRequest(`/blogs/${id}/related`),
};

// Newsletter / Subscriber API Methods
export const subscriberApi = {
  subscribe: (email: string, source = "website_footer") =>
    apiRequest("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, source }),
    }),
  unsubscribe: (email: string) =>
    apiRequest("/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

// Site Setting API Methods
export const siteSettingApi = {
  get: () => apiRequest("/settings"),
};


