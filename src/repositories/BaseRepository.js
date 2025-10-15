// src/repositories/BaseRepository.js

/**
 * BaseRepository - Contrato abstracto para todos los repositories
 *
 * Define la interfaz que TODOS los repositories deben implementar.
 * Garantiza consistencia entre LocalStorageRepository y ApiRepository.
 *
 * IMPORTANTE: Todos los métodos son async para compatibilidad con futuras
 * llamadas HTTP, aunque LocalStorage sea síncrono.
 */

export class BaseRepository {
  constructor() {
    if (new.target === BaseRepository) {
      throw new TypeError(
        "Cannot instantiate abstract class BaseRepository directly"
      );
    }
  }

  /**
   * Obtener todos los registros
   * @returns {Promise<Array>} Array de objetos
   */
  async getAll() {
    throw new Error("Method getAll() must be implemented");
  }

  /**
   * Obtener un registro por ID
   * @param {string|number} id - ID del registro
   * @returns {Promise<Object|null>} Objeto encontrado o null
   */
  async getById(id) {
    throw new Error("Method getById() must be implemented");
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos del registro
   * @returns {Promise<Object>} Registro creado con ID
   */
  async create(data) {
    throw new Error("Method create() must be implemented");
  }

  /**
   * Actualizar un registro existente
   * @param {string|number} id - ID del registro
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} Registro actualizado
   */
  async update(id, data) {
    throw new Error("Method update() must be implemented");
  }

  /**
   * Eliminar un registro
   * @param {string|number} id - ID del registro
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async delete(id) {
    throw new Error("Method delete() must be implemented");
  }

  /**
   * Crear múltiples registros
   * @param {Array<Object>} items - Array de objetos a crear
   * @returns {Promise<Array<Object>>} Array de registros creados
   */
  async bulkCreate(items) {
    throw new Error("Method bulkCreate() must be implemented");
  }

  /**
   * Exportar todos los datos
   * @returns {Promise<Object>} Objeto con metadata y datos
   */
  async exportData() {
    throw new Error("Method exportData() must be implemented");
  }

  /**
   * Importar datos (reemplaza todos los existentes)
   * @param {Object} data - Datos a importar
   * @returns {Promise<Array<Object>>} Datos importados
   */
  async importData(data) {
    throw new Error("Method importData() must be implemented");
  }

  /**
   * Limpiar todos los datos
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error("Method clear() must be implemented");
  }

  /**
   * Contar registros
   * @returns {Promise<number>} Número total de registros
   */
  async count() {
    throw new Error("Method count() must be implemented");
  }
}

export default BaseRepository;
