// src/services/ItemService.js

import { itemRepository, ItemRepository } from '../repositories/ItemRepository';

/**
 * ItemService - Lógica de negocio para Items/Elementos del universo Reload
 * 
 * RESPONSABILIDADES:
 * - Validaciones de negocio antes de guardar
 * - Normalización de datos
 * - Gestión compleja de componentes anidados
 * - Transformaciones de datos
 * 
 * GESTIONA:
 * - Personajes: LACE, IA Cuántica, Stayed, Ángeles
 * - Arcos Narrativos
 * - Componentes anidados (motivaciones, habilidades, soundtrack, etc.)
 */

export class ItemService {
  constructor() {
    this.repository = itemRepository;
  }

  // ==================== CRUD CON VALIDACIONES ====================

  /**
   * Crear un nuevo item con validaciones completas
   * @param {Object} itemData - Datos del item
   * @returns {Promise<Object>} Item creado
   */
  async createItem(itemData) {
    // Validar datos
    const validation = this.validateItemData(itemData);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizeItemData(itemData);

    // Inicializar components si no existe
    if (!normalizedData.components) {
      normalizedData.components = {};
    }

    // Crear item
    return await this.repository.create(normalizedData);
  }

  /**
   * Actualizar un item existente
   * @param {string|number} id
   * @param {Object} itemData
   * @returns {Promise<Object>}
   */
  async updateItem(id, itemData) {
    // Verificar que existe
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error(`Item with id ${id} not found`);
    }

    // Validar datos
    const validation = this.validateItemData(itemData, true); // true = update mode
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizeItemData(itemData, existing);

    // Actualizar
    return await this.repository.update(id, normalizedData);
  }

  /**
   * Obtener un item por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getItemById(id) {
    return await this.repository.getById(id);
  }

  /**
   * Obtener todos los items
   * @returns {Promise<Array>}
   */
  async getAllItems() {
    return await this.repository.getAll();
  }

  /**
   * Eliminar un item
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async deleteItem(id) {
    return await this.repository.delete(id);
  }

  // ==================== FILTRADO Y BÚSQUEDA ====================

  /**
   * Obtener items por tipo
   * @param {string} tipo
   * @returns {Promise<Array>}
   */
  async getItemsByType(tipo) {
    return await this.repository.getByType(tipo);
  }

  /**
   * Obtener todos los personajes
   * @returns {Promise<Array>}
   */
  async getPersonajes() {
    return await this.repository.getPersonajes();
  }

  /**
   * Obtener todos los arcos narrativos
   * @returns {Promise<Array>}
   */
  async getArcos() {
    return await this.repository.getArcos();
  }

  /**
   * Buscar items por texto
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchItems(query) {
    return await this.repository.search(query);
  }

  /**
   * Obtener items que tienen un componente específico
   * @param {string} componentType
   * @returns {Promise<Array>}
   */
  async getItemsByComponentType(componentType) {
    return await this.repository.getByComponentType(componentType);
  }

  // ==================== GESTIÓN DE COMPONENTES ====================

  /**
   * Agregar un componente a un item
   * @param {string|number} itemId
   * @param {string} componentType - Tipo de componente
   * @param {Object} componentData - Datos del componente
   * @returns {Promise<Object>} Item actualizado
   */
  async addComponent(itemId, componentType, componentData) {
    // Verificar que el item existe
    const item = await this.repository.getById(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    // Generar ID único para el componente
    const componentId = `${componentType}_${Date.now()}`;

    // Crear estructura del componente
    const component = {
      type: componentType,
      data: componentData
    };

    // Agregar componente
    return await this.repository.addComponent(itemId, componentId, component);
  }

  /**
   * Actualizar un componente específico
   * @param {string|number} itemId
   * @param {string} componentId
   * @param {Object} componentData - Solo los datos (sin type)
   * @returns {Promise<Object>}
   */
  async updateComponent(itemId, componentId, componentData) {
    return await this.repository.updateComponent(itemId, componentId, componentData);
  }

  /**
   * Eliminar un componente
   * @param {string|number} itemId
   * @param {string} componentId
   * @returns {Promise<Object>}
   */
  async deleteComponent(itemId, componentId) {
    return await this.repository.deleteComponent(itemId, componentId);
  }

  /**
   * Obtener todos los componentes de un item
   * @param {string|number} itemId
   * @returns {Promise<Object>}
   */
  async getComponents(itemId) {
    return await this.repository.getComponents(itemId);
  }

  /**
   * Contar componentes de un item
   * @param {string|number} itemId
   * @returns {Promise<number>}
   */
  async countComponents(itemId) {
    return await this.repository.countComponents(itemId);
  }

  /**
   * Duplicar todos los componentes de un item a otro
   * @param {string|number} sourceId - ID del item origen
   * @param {string|number} targetId - ID del item destino
   * @returns {Promise<Object>} Item destino actualizado
   */
  async copyComponentsToItem(sourceId, targetId) {
    const sourceComponents = await this.repository.getComponents(sourceId);
    const targetItem = await this.repository.getById(targetId);

    if (!targetItem) {
      throw new Error(`Target item with id ${targetId} not found`);
    }

    // Copiar cada componente generando nuevos IDs
    const updatedComponents = { ...targetItem.components };
    
    for (const [oldId, component] of Object.entries(sourceComponents)) {
      const newId = `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      updatedComponents[newId] = { ...component };
    }

    return await this.repository.update(targetId, {
      ...targetItem,
      components: updatedComponents
    });
  }

  // ==================== EXPORT/IMPORT ====================

  /**
   * Exportar todos los items
   * @returns {Promise<Object>}
   */
  async exportAll() {
    return await this.repository.exportData();
  }

  /**
   * Importar items
   * @param {Object|Array} data
   * @returns {Promise<Array>}
   */
  async importAll(data) {
    // Validar formato
    const items = Array.isArray(data) ? data : (data.data || data);
    
    if (!Array.isArray(items)) {
      throw new Error('Import data must be an array or object with data property');
    }

    // Validar cada item
    const invalidItems = [];
    items.forEach((item, index) => {
      const validation = this.validateItemData(item, true);
      if (!validation.valid) {
        invalidItems.push({
          index,
          nombre: item.nombre || 'unknown',
          errors: validation.errors
        });
      }
    });

    if (invalidItems.length > 0) {
      throw new Error(`Invalid items found: ${JSON.stringify(invalidItems)}`);
    }

    return await this.repository.importData(items);
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas completas
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    return await this.repository.getStatistics();
  }

  /**
   * Obtener resumen de un item (para cards/previews)
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getItemSummary(id) {
    const item = await this.repository.getById(id);
    
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }

    return {
      id: item.id,
      nombre: item.nombre,
      tipo: item.tipo,
      tipoLabel: ItemRepository.getTypeLabel(item.tipo),
      tipoColor: ItemRepository.getTypeColor(item.tipo),
      tipoIcon: ItemRepository.getTypeIcon(item.tipo),
      descripcion: item.descripcion,
      imagen: item.imagen,
      componentCount: item.components ? Object.keys(item.components).length : 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  }

  // ==================== VALIDACIONES ====================

  /**
   * Validar datos completos de un item
   * @param {Object} itemData
   * @param {boolean} isUpdate - Si es actualización (campos opcionales)
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateItemData(itemData, isUpdate = false) {
    const errors = [];

    // Nombre (obligatorio solo en create)
    if (!isUpdate && (!itemData.nombre || itemData.nombre.trim() === '')) {
      errors.push('El nombre es obligatorio');
    }

    // Tipo (obligatorio solo en create)
    if (!isUpdate && !itemData.tipo) {
      errors.push('El tipo es obligatorio');
    }

    // Validar tipo si existe
    if (itemData.tipo) {
      const validTypes = [
        ItemRepository.TIPOS.LACE,
        ItemRepository.TIPOS.IA_CUANTICA,
        ItemRepository.TIPOS.STAYED,
        ItemRepository.TIPOS.ANGELES,
        ItemRepository.TIPOS.ARCOS
      ];
      
      if (!validTypes.includes(itemData.tipo)) {
        errors.push(`Tipo inválido: ${itemData.tipo}. Tipos válidos: ${validTypes.join(', ')}`);
      }
    }

    // Validar estructura de components si existe
    if (itemData.components !== undefined) {
      if (typeof itemData.components !== 'object' || Array.isArray(itemData.components)) {
        errors.push('Components debe ser un objeto (no array)');
      } else {
        // Validar cada componente
        Object.entries(itemData.components).forEach(([componentId, component]) => {
          if (!component.type) {
            errors.push(`Componente ${componentId} no tiene type`);
          }
          if (component.data === undefined) {
            errors.push(`Componente ${componentId} no tiene data`);
          }
        });
      }
    }

    // Validar imagen si existe (debe ser base64 o URL)
    if (itemData.imagen && itemData.imagen.trim()) {
      const isBase64 = itemData.imagen.startsWith('data:image/');
      const isUrl = itemData.imagen.startsWith('http://') || itemData.imagen.startsWith('https://');
      
      if (!isBase64 && !isUrl) {
        errors.push('Imagen debe ser base64 (data:image/...) o URL válida');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== NORMALIZACIÓN PRIVADA ====================

  /**
   * Normalizar datos del item
   * @private
   * @param {Object} itemData
   * @param {Object} existing - Datos existentes (para updates)
   * @returns {Object}
   */
  _normalizeItemData(itemData, existing = null) {
    const normalized = { ...itemData };

    // Normalizar strings (trim)
    if (normalized.nombre) {
      normalized.nombre = normalized.nombre.trim();
    }
    if (normalized.descripcion) {
      normalized.descripcion = normalized.descripcion.trim();
    }
    if (normalized.origen) {
      normalized.origen = normalized.origen.trim();
    }
    if (normalized.actitud) {
      normalized.actitud = normalized.actitud.trim();
    }
    if (normalized.primera_aparicion) {
      normalized.primera_aparicion = normalized.primera_aparicion.trim();
    }

    // Asegurar que components existe
    if (!normalized.components && !existing) {
      normalized.components = {};
    }

    // Si existe imagen vacía, establecer a undefined
    if (normalized.imagen === '') {
      normalized.imagen = undefined;
    }

    return normalized;
  }

  // ==================== HELPERS PÚBLICOS ====================

  /**
   * Obtener label del tipo
   * @param {string} tipo
   * @returns {string}
   */
  static getTypeLabel(tipo) {
    return ItemRepository.getTypeLabel(tipo);
  }

  /**
   * Obtener color del tipo
   * @param {string} tipo
   * @returns {string}
   */
  static getTypeColor(tipo) {
    return ItemRepository.getTypeColor(tipo);
  }

  /**
   * Obtener icono del tipo
   * @param {string} tipo
   * @returns {string}
   */
  static getTypeIcon(tipo) {
    return ItemRepository.getTypeIcon(tipo);
  }

  /**
   * Verificar si un tipo es personaje
   * @param {string} tipo
   * @returns {boolean}
   */
  static isPersonaje(tipo) {
    return ItemRepository.TIPOS_PERSONAJES.includes(tipo);
  }

  /**
   * Verificar si un tipo es arco narrativo
   * @param {string} tipo
   * @returns {boolean}
   */
  static isArco(tipo) {
    return tipo === ItemRepository.TIPOS.ARCOS;
  }

  /**
   * Obtener tipos de componentes recomendados según tipo de item
   * @param {string} tipo - Tipo de item
   * @returns {string[]} Array de tipos de componentes
   */
  static getRecommendedComponents(tipo) {
    const personajesComponents = [
      'motivaciones',
      'habilidades',
      'evolucion_arcos',
      'relaciones',
      'atributos_clave',
      'manifestacion',
      'debilidades',
      'rol_narrativo',
      'giro_narrativo',
      'fuentes_referencias'
    ];

    const arcosComponents = [
      'tematica_principal',
      'estilo_visual',
      'perfil_sonoro',
      'emociones_clave',
      'entidades_activas',
      'tecnologias',
      'evento_culminante',
      'sinopsis',
      'secuencias_clave',
      'estado_emocional',
      'conexiones',
      'referencias_visuales',
      'soundtrack'
    ];

    if (ItemService.isPersonaje(tipo)) {
      return personajesComponents;
    } else if (ItemService.isArco(tipo)) {
      return arcosComponents;
    }

    return [];
  }

  /**
   * Generar preview de descripción (primeras N palabras)
   * @param {string} descripcion
   * @param {number} wordLimit
   * @returns {string}
   */
  static generateDescriptionPreview(descripcion, wordLimit = 30) {
    if (!descripcion) return '';
    
    const words = descripcion.split(/\s+/);
    if (words.length <= wordLimit) {
      return descripcion;
    }
    
    return words.slice(0, wordLimit).join(' ') + '...';
  }
}

// Exportar singleton
export const itemService = new ItemService();

export default itemService;