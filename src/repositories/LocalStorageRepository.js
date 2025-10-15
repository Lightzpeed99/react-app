// src/repositories/LocalStorageRepository.js

import { BaseRepository } from './BaseRepository';

/**
 * LocalStorageRepository - Implementación de BaseRepository usando localStorage
 * 
 * CARACTERÍSTICAS:
 * - Mantiene estructura JSON actual (compatibilidad con datos existentes)
 * - Auto-genera IDs con Date.now().toString()
 * - Agrega timestamps automáticos (createdAt, updatedAt)
 * - Todos los métodos son async (retornan Promises)
 * - Manejo robusto de errores
 * 
 * IMPORTANTE: Aunque localStorage es síncrono, todos los métodos retornan
 * Promises para mantener consistencia con ApiRepository futuro.
 */

export class LocalStorageRepository extends BaseRepository {
  constructor(storageKey) {
    super();
    
    if (!storageKey) {
      throw new Error('LocalStorageRepository requires a storageKey');
    }
    
    this.storageKey = storageKey;
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Lee datos de localStorage y los parsea
   * @private
   * @returns {Array} Array de objetos
   */
  _readFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage [${this.storageKey}]:`, error);
      return [];
    }
  }

  /**
   * Escribe datos a localStorage
   * @private
   * @param {Array} data - Array de objetos a guardar
   * @returns {boolean} true si se guardó correctamente
   */
  _writeToStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage [${this.storageKey}]:`, error);
      throw new Error(`Failed to save data: ${error.message}`);
    }
  }

  /**
   * Genera un ID único
   * @private
   * @returns {string} ID único
   */
  _generateId() {
    return Date.now().toString();
  }

  /**
   * Agrega timestamps a un objeto
   * @private
   * @param {Object} obj - Objeto a modificar
   * @param {boolean} isUpdate - Si es actualización (solo modifica updatedAt)
   * @returns {Object} Objeto con timestamps
   */
  _addTimestamps(obj, isUpdate = false) {
    const now = new Date().toISOString();
    
    if (isUpdate) {
      return { ...obj, updatedAt: now };
    }
    
    return { ...obj, createdAt: now, updatedAt: now };
  }

  // ==================== MÉTODOS PÚBLICOS (CRUD) ====================

  /**
   * Obtener todos los registros
   * @returns {Promise<Array>}
   */
  async getAll() {
    return Promise.resolve(this._readFromStorage());
  }

  /**
   * Obtener un registro por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const items = this._readFromStorage();
    const item = items.find(item => item.id === String(id));
    return Promise.resolve(item || null);
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos del registro (sin ID)
   * @returns {Promise<Object>} Registro creado con ID y timestamps
   */
  async create(data) {
    const items = this._readFromStorage();
    
    const newItem = this._addTimestamps({
      ...data,
      id: this._generateId()
    });
    
    items.push(newItem);
    this._writeToStorage(items);
    
    return Promise.resolve(newItem);
  }

  /**
   * Actualizar un registro existente
   * @param {string|number} id
   * @param {Object} data - Datos actualizados (sin ID)
   * @returns {Promise<Object>} Registro actualizado
   */
  async update(id, data) {
    const items = this._readFromStorage();
    const index = items.findIndex(item => item.id === String(id));
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    const updatedItem = this._addTimestamps({
      ...items[index],
      ...data,
      id: String(id) // Preservar ID original
    }, true);
    
    items[index] = updatedItem;
    this._writeToStorage(items);
    
    return Promise.resolve(updatedItem);
  }

  /**
   * Eliminar un registro
   * @param {string|number} id
   * @returns {Promise<boolean>} true si se eliminó
   */
  async delete(id) {
    const items = this._readFromStorage();
    const initialLength = items.length;
    
    const filteredItems = items.filter(item => item.id !== String(id));
    
    if (filteredItems.length === initialLength) {
      return Promise.resolve(false); // No se encontró
    }
    
    this._writeToStorage(filteredItems);
    return Promise.resolve(true);
  }

  /**
   * Crear múltiples registros
   * @param {Array<Object>} items
   * @returns {Promise<Array<Object>>}
   */
  async bulkCreate(items) {
    const existingItems = this._readFromStorage();
    
    const newItems = items.map(item => 
      this._addTimestamps({
        ...item,
        id: this._generateId()
      })
    );
    
    const allItems = [...existingItems, ...newItems];
    this._writeToStorage(allItems);
    
    return Promise.resolve(newItems);
  }

  /**
   * Reemplazar todos los datos
   * @param {Array<Object>} data
   * @returns {Promise<Array<Object>>}
   */
  async replaceAll(data) {
    this._writeToStorage(data);
    return Promise.resolve(data);
  }

  /**
   * Exportar todos los datos con metadata
   * @returns {Promise<Object>}
   */
  async exportData() {
    const items = this._readFromStorage();
    
    return Promise.resolve({
      version: '1.0',
      exportDate: new Date().toISOString(),
      storageKey: this.storageKey,
      count: items.length,
      data: items
    });
  }

  /**
   * Importar datos (reemplaza existentes)
   * @param {Object|Array} data
   * @returns {Promise<Array<Object>>}
   */
  async importData(data) {
    // Si es objeto con metadata, extraer el array de datos
    const items = Array.isArray(data) ? data : (data.data || data);
    
    if (!Array.isArray(items)) {
      throw new Error('Import data must be an array or object with data property');
    }
    
    this._writeToStorage(items);
    return Promise.resolve(items);
  }

  /**
   * Limpiar todos los datos
   * @returns {Promise<void>}
   */
  async clear() {
    this._writeToStorage([]);
    return Promise.resolve();
  }

  /**
   * Contar registros
   * @returns {Promise<number>}
   */
  async count() {
    const items = this._readFromStorage();
    return Promise.resolve(items.length);
  }
}

export default LocalStorageRepository;