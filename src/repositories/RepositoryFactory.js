// src/repositories/RepositoryFactory.js

import { SoundtrackRepository } from "./SoundtrackRepository";
import { ItemRepository } from "./ItemRepository";
import { isUsingApi } from "../shared/api/apiClient";

/**
 * RepositoryFactory - Factory Pattern para crear repositories
 *
 * PROPÓSITO:
 * - Centralizar la creación de repositories
 * - Cambiar entre localStorage y API con una variable de entorno
 * - Facilitar testing con mock repositories
 *
 * USO:
 * const repo = RepositoryFactory.createSoundtrackRepository();
 *
 * CONFIGURACIÓN:
 * En .env:
 * VITE_USE_API=false → usa LocalStorageRepository
 * VITE_USE_API=true  → usa ApiRepository (cuando esté listo)
 */

export class RepositoryFactory {
  // ==================== SOUNDTRACK REPOSITORY ====================

  /**
   * Crear repository de Soundtrack
   * @param {boolean} forceLocalStorage - Forzar uso de localStorage (para testing)
   * @returns {SoundtrackRepository|SoundtrackApiRepository}
   */
  static createSoundtrackRepository(forceLocalStorage = false) {
    // Si forzamos localStorage o la API no está habilitada
    if (forceLocalStorage || !isUsingApi()) {
      console.info("🗄️ Using LocalStorageRepository for Soundtrack");
      return new SoundtrackRepository();
    }

    // FUTURO: Cuando la API esté lista
    console.info("🌐 Using ApiRepository for Soundtrack");

    // Importación dinámica para evitar errores si no existe aún
    try {
      const { SoundtrackApiRepository } = require("./SoundtrackApiRepository");
      return new SoundtrackApiRepository();
    } catch (error) {
      console.warn(
        "⚠️ SoundtrackApiRepository not found, falling back to localStorage"
      );
      return new SoundtrackRepository();
    }
  }

  // ==================== ITEM REPOSITORY ====================

  /**
   * Crear repository de Items
   * @param {boolean} forceLocalStorage - Forzar uso de localStorage
   * @returns {ItemRepository|ItemApiRepository}
   */
  static createItemRepository(forceLocalStorage = false) {
    if (forceLocalStorage || !isUsingApi()) {
      console.info("🗄️ Using LocalStorageRepository for Items");
      return new ItemRepository();
    }

    console.info("🌐 Using ApiRepository for Items");

    try {
      const { ItemApiRepository } = require("./ItemApiRepository");
      return new ItemApiRepository();
    } catch (error) {
      console.warn(
        "⚠️ ItemApiRepository not found, falling back to localStorage"
      );
      return new ItemRepository();
    }
  }

  // ==================== FACTORY HELPERS ====================

  /**
   * Verificar si estamos usando API o localStorage
   * @returns {boolean}
   */
  static isUsingApi() {
    return isUsingApi();
  }

  /**
   * Obtener información sobre el repository en uso
   * @param {string} repositoryType - 'soundtrack' | 'item'
   * @returns {Object} Info del repository
   */
  static getRepositoryInfo(repositoryType) {
    const usingApi = isUsingApi();

    return {
      type: repositoryType,
      implementation: usingApi ? "API" : "LocalStorage",
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      usingApi,
    };
  }

  /**
   * Cambiar modo de repository en runtime (solo para testing)
   * @param {boolean} useApi - true para API, false para localStorage
   */
  static setMode(useApi) {
    if (import.meta.env.DEV) {
      console.warn(
        `🔄 Changing repository mode to: ${useApi ? "API" : "LocalStorage"}`
      );
      // Nota: Esto requeriría recargar la app en producción
      // Por ahora solo funciona en desarrollo
    } else {
      console.error("⚠️ Cannot change repository mode in production");
    }
  }

  /**
   * Diagnóstico completo de repositories
   * @returns {Promise<Object>}
   */
  static async diagnose() {
    const diagnosis = {
      environment: import.meta.env.MODE,
      usingApi: isUsingApi(),
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      repositories: {
        soundtrack: this.getRepositoryInfo("soundtrack"),
        item: this.getRepositoryInfo("item"),
      },
      apiAvailable: false,
      localStorageAvailable: false,
    };

    // Verificar disponibilidad de localStorage
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      diagnosis.localStorageAvailable = true;
    } catch (error) {
      console.error("❌ localStorage not available:", error);
    }

    // Verificar disponibilidad de API
    if (isUsingApi()) {
      try {
        const { checkApiHealth } = await import("../shared/api/apiClient");
        diagnosis.apiAvailable = await checkApiHealth();
      } catch (error) {
        console.error("❌ API not available:", error);
      }
    }

    return diagnosis;
  }
}

// ==================== SINGLETON INSTANCES (OPCIONAL) ====================

/**
 * Instancias singleton para uso global
 * Útil si quieres reutilizar la misma instancia en toda la app
 */
let soundtrackRepositoryInstance = null;
let itemRepositoryInstance = null;

/**
 * Obtener instancia singleton de SoundtrackRepository
 * @returns {SoundtrackRepository|SoundtrackApiRepository}
 */
export const getSoundtrackRepository = () => {
  if (!soundtrackRepositoryInstance) {
    soundtrackRepositoryInstance =
      RepositoryFactory.createSoundtrackRepository();
  }
  return soundtrackRepositoryInstance;
};

/**
 * Obtener instancia singleton de ItemRepository
 * @returns {ItemRepository|ItemApiRepository}
 */
export const getItemRepository = () => {
  if (!itemRepositoryInstance) {
    itemRepositoryInstance = RepositoryFactory.createItemRepository();
  }
  return itemRepositoryInstance;
};

/**
 * Resetear instancias singleton (útil para testing)
 */
export const resetRepositories = () => {
  soundtrackRepositoryInstance = null;
  itemRepositoryInstance = null;
  console.info("🔄 Repository instances reset");
};

// ==================== EXPORT ====================

export default RepositoryFactory;
