// src/shared/api/apiClient.js

import axios from "axios";

/**
 * apiClient - Cliente HTTP configurado para comunicarse con la API .NET
 *
 * CONFIGURACIÓN:
 * - Base URL desde variables de entorno
 * - Timeout de 30 segundos (para uploads largos)
 * - Interceptores para auth y manejo de errores
 *
 * VARIABLES DE ENTORNO (.env):
 * VITE_API_BASE_URL=http://localhost:5000/api
 * VITE_USE_API=false (true cuando API esté lista)
 */

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Cambiar a true si usas cookies para auth
});

// ==================== REQUEST INTERCEPTOR ====================

/**
 * Interceptor de REQUEST
 * - Agrega token de autenticación si existe
 * - Agrega headers adicionales si es necesario
 * - Log de requests en desarrollo
 */
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem("reload_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================

/**
 * Interceptor de RESPONSE
 * - Manejo centralizado de errores HTTP
 * - Refresh de token automático (si implementas)
 * - Log de respuestas en desarrollo
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log del error
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // ==================== MANEJO DE ERRORES ESPECÍFICOS ====================

    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad Request - Validación fallida
          console.warn("⚠️ Validation Error:", data);
          break;

        case 401:
          // Unauthorized - Token inválido o expirado
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            // OPCIÓN 1: Limpiar token y redirigir a login
            localStorage.removeItem("reload_auth_token");
            window.location.href = "/login";

            // OPCIÓN 2: Intentar refresh token (implementar según tu backend)
            // try {
            //   const newToken = await refreshAuthToken();
            //   localStorage.setItem('reload_auth_token', newToken);
            //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //   return apiClient(originalRequest);
            // } catch (refreshError) {
            //   window.location.href = '/login';
            //   return Promise.reject(refreshError);
            // }
          }
          break;

        case 403:
          // Forbidden - Sin permisos
          console.error("🚫 Access Denied:", data);
          break;

        case 404:
          // Not Found
          console.warn("🔍 Resource Not Found:", error.config?.url);
          break;

        case 409:
          // Conflict - Recurso duplicado
          console.warn("⚠️ Conflict:", data);
          break;

        case 422:
          // Unprocessable Entity - Error de validación semántica
          console.warn("⚠️ Validation Error:", data);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server Errors
          console.error("🔥 Server Error:", status, data);
          break;

        default:
          console.error("❓ Unexpected Error:", status, data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error("📡 No Response from Server:", {
        url: error.config?.url,
        message:
          "El servidor no respondió. Verifica tu conexión o que el servidor esté corriendo.",
      });
    } else {
      // Error al configurar la petición
      console.error("⚙️ Request Setup Error:", error.message);
    }

    // Rechazar la promesa con el error
    return Promise.reject(error);
  }
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Verificar si la API está disponible
 * @returns {Promise<boolean>}
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.status === 200;
  } catch (error) {
    console.warn("⚠️ API Health Check Failed:", error.message);
    return false;
  }
};

/**
 * Obtener mensaje de error legible
 * @param {Error} error - Error de Axios
 * @returns {string} Mensaje de error
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Error del servidor
    return (
      error.response.data?.message ||
      error.response.data?.error ||
      `Error ${error.response.status}: ${error.response.statusText}`
    );
  } else if (error.request) {
    // Sin respuesta del servidor
    return "No se pudo conectar con el servidor. Verifica tu conexión.";
  } else {
    // Error al configurar la petición
    return error.message || "Error desconocido";
  }
};

/**
 * Verificar si estamos usando la API o localStorage
 * @returns {boolean}
 */
export const isUsingApi = () => {
  return import.meta.env.VITE_USE_API === "true";
};

// ==================== EXPORT ====================

export default apiClient;
