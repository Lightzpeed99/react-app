// src/repositories/ApiRepository.js

import { BaseRepository } from './BaseRepository';
// import apiClient from '../shared/api/apiClient'; // Descomentar cuando esté listo

/**
 * ApiRepository - Template para conectar con API REST .NET
 * 
 * ESTADO: SKELETON - NO IMPLEMENTADO AÚN
 * 
 * Este archivo está preparado para cuando la API .NET esté lista.
 * Por ahora, la aplicación usa LocalStorageRepository.
 * 
 * CAMBIO FUTURO:
 * En lugar de:
 *   const itemRepository = new ItemRepository(); // usa LocalStorage
 * 
 * Será:
 *   const itemRepository = new ItemApiRepository('/api/items'); // usa HTTP
 * 
 * ENDPOINTS ESPERADOS:
 * - GET    /api/{endpoint}           → getAll()
 * - GET    /api/{endpoint}/{id}      → getById(id)
 * - POST   /api/{endpoint}           → create(data)
 * - PUT    /api/{endpoint}/{id}      → update(id, data)
 * - DELETE /api/{endpoint}/{id}      → delete(id)
 * - POST   /api/{endpoint}/bulk      → bulkCreate(items)
 * - GET    /api/{endpoint}/export    → exportData()
 * - POST   /api/{endpoint}/import    → importData(data)
 * - DELETE /api/{endpoint}/clear     → clear()
 * - GET    /api/{endpoint}/count     → count()
 */

export class ApiRepository extends BaseRepository {
  constructor(endpoint) {
    super();
    
    if (!endpoint) {
      throw new Error('ApiRepository requires an endpoint');
    }
    
    this.endpoint = endpoint;
    // this.client = apiClient; // Descomentar cuando apiClient esté listo
  }

  /**
   * Obtener todos los registros
   * @returns {Promise<Array>}
   */
  async getAll() {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.get(this.endpoint);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Failed to fetch all: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Obtener un registro por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.get(`${this.endpoint}/${id}`);
    //   return response.data;
    // } catch (error) {
    //   if (error.response?.status === 404) {
    //     return null;
    //   }
    //   throw new Error(`Failed to fetch by id ${id}: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.post(this.endpoint, data);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Failed to create: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Actualizar un registro existente
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.put(`${this.endpoint}/${id}`, data);
    //   return response.data;
    // } catch (error) {
    //   if (error.response?.status === 404) {
    //     throw new Error(`Item with id ${id} not found`);
    //   }
    //   throw new Error(`Failed to update: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Eliminar un registro
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   await this.client.delete(`${this.endpoint}/${id}`);
    //   return true;
    // } catch (error) {
    //   if (error.response?.status === 404) {
    //     return false;
    //   }
    //   throw new Error(`Failed to delete: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Crear múltiples registros
   * @param {Array<Object>} items
   * @returns {Promise<Array<Object>>}
   */
  async bulkCreate(items) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.post(`${this.endpoint}/bulk`, items);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Failed to bulk create: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Exportar todos los datos
   * @returns {Promise<Object>}
   */
  async exportData() {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.get(`${this.endpoint}/export`);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Failed to export: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Importar datos
   * @param {Object|Array} data
   * @returns {Promise<Array<Object>>}
   */
  async importData(data) {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.post(`${this.endpoint}/import`, data);
    //   return response.data;
    // } catch (error) {
    //   throw new Error(`Failed to import: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Limpiar todos los datos
   * @returns {Promise<void>}
   */
  async clear() {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   await this.client.delete(`${this.endpoint}/clear`);
    // } catch (error) {
    //   throw new Error(`Failed to clear: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }

  /**
   * Contar registros
   * @returns {Promise<number>}
   */
  async count() {
    // IMPLEMENTACIÓN FUTURA:
    // try {
    //   const response = await this.client.get(`${this.endpoint}/count`);
    //   return response.data.count;
    // } catch (error) {
    //   throw new Error(`Failed to count: ${error.message}`);
    // }
    
    throw new Error('ApiRepository not implemented yet - use LocalStorageRepository');
  }
}

/**
 * EJEMPLO DE USO FUTURO:
 * 
 * // En ItemRepository.js:
 * import { ApiRepository } from './ApiRepository';
 * 
 * export class ItemApiRepository extends ApiRepository {
 *   constructor() {
 *     super('/api/items');
 *   }
 * 
 *   async getByType(tipo) {
 *     const response = await this.client.get(`${this.endpoint}/by-type/${tipo}`);
 *     return response.data;
 *   }
 * }
 * 
 * // Para cambiar de localStorage a API:
 * // const itemRepository = new ItemRepository(); // LocalStorage
 * const itemRepository = new ItemApiRepository(); // API REST
 */

export default ApiRepository;