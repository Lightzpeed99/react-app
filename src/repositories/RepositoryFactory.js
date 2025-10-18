// src/repositories/RepositoryFactory.js

import { SoundtrackRepository } from "./SoundtrackRepository";
import { ItemRepository } from "./ItemRepository";
import { isUsingApi } from "../shared/api/apiClient";

// ⭐ IMPORTAR DIRECTAMENTE (no dinámicamente)
import SoundtrackApiRepository from "./SoundtrackApiRepository";

/**
 * RepositoryFactory - Factory Pattern para crear repositories
 */
export class RepositoryFactory {
  // ==================== SOUNDTRACK REPOSITORY ====================

  /**
   * Crear repository de Soundtrack
   * @param {boolean} forceLocalStorage - Forzar uso de localStorage
   * @returns {SoundtrackRepository|SoundtrackApiRepository}
   */
  static createSoundtrackRepository(forceLocalStorage = false) {
    if (forceLocalStorage || !isUsingApi()) {
      console.info("🗄️ Using LocalStorageRepository for Soundtrack");
      return new SoundtrackRepository();
    }

    console.info("🌐 Using ApiRepository for Soundtrack");

    // ✅ CREAR DIRECTAMENTE (sin try/catch porque ya está importado)
    return new SoundtrackApiRepository();
  }

  // ==================== ITEM REPOSITORY ====================

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

  static isUsingApi() {
    return isUsingApi();
  }

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

  static setMode(useApi) {
    if (import.meta.env.DEV) {
      console.warn(
        `🔄 Changing repository mode to: ${useApi ? "API" : "LocalStorage"}`
      );
    } else {
      console.error("⚠️ Cannot change repository mode in production");
    }
  }

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

    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      diagnosis.localStorageAvailable = true;
    } catch (error) {
      console.error("❌ localStorage not available:", error);
    }

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

// ==================== SINGLETON INSTANCES ====================

let soundtrackRepositoryInstance = null;
let itemRepositoryInstance = null;

export const getSoundtrackRepository = () => {
  if (!soundtrackRepositoryInstance) {
    soundtrackRepositoryInstance =
      RepositoryFactory.createSoundtrackRepository();
  }
  return soundtrackRepositoryInstance;
};

export const getItemRepository = () => {
  if (!itemRepositoryInstance) {
    itemRepositoryInstance = RepositoryFactory.createItemRepository();
  }
  return itemRepositoryInstance;
};

export const resetRepositories = () => {
  soundtrackRepositoryInstance = null;
  itemRepositoryInstance = null;
  console.info("🔄 Repository instances reset");
};

export default RepositoryFactory;
