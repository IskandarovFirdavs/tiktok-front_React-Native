const BASE_URL = "http://192.168.71.21:8000";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage =
        errorData.detail || errorData.message || JSON.stringify(errorData);
    } else {
      const text = await response.text();
      console.log("Non-JSON response:", text.substring(0, 200));
      errorMessage = `Server error: ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
};

const api = {
  get: async (endpoint, token = null) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    return handleResponse(response);
  },

  post: async (endpoint, body, token = null) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  uploadPost: async (endpoint, formData, token = null) => {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    console.log("Uploading to:", `${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return handleResponse(response);
  },

  fullUrl: (path) => {
    if (!path) return "";
    return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  },
};

export default api;
