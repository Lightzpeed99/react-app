// src/repositories/ItemRepository.js

import { LocalStorageRepository } from './LocalStorageRepository';

/**
 * ItemRepository - Repository específico para Items/Elementos del universo Reload
 * 
 * GESTIONA: Personajes (LACE, IA Cuántica, Stayed, Ángeles) y Arcos Narrativos
 * 
 * ESTRUCTURA DE DATOS (PRESERVAR):
 * {
 *   id: string,
 *   nombre: string,
 *   tipo: 'lace' | 'ia_cuantica' | 'stayed' | 'angeles' | 'arcos',
 *   descripcion: string,
 *   imagen: string (base64),
 *   origen: string,
 *   actitud: string,
 *   primera_aparicion: string,
 *   components: {
 *     [componentId]: {
 *       type: string,
 *       data: Object
 *     }
 *   },
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 * 
 * TIPOS DE COMPONENTES:
 * Personajes: motivaciones, habilidades, evolucion_arcos, relaciones, 
 *             atributos_clave, manifestacion, debilidades, rol_narrativo,
 *             giro_narrativo, fuentes_referencias
 * 
 * Historias: tematica_principal, estilo_visual, perfil_sonoro, emociones_clave,
 *            entidades_activas, tecnologias, evento_culminante, sinopsis,
 *            secuencias_clave, estado_emocional, conexiones, referencias_visuales,
 *            soundtrack
 * 
 * IMPORTANTE: Esta estructura NO se modifica. Compatibilidad con JSONs existentes.
 */

export class ItemRepository extends LocalStorageRepository {
  constructor() {
    super('reloadxps_items');
  }

  // ==================== TIPOS DE ENTIDADES ====================

  static TIPOS = {
    LACE: 'lace',
    IA_CUANTICA: 'ia_cuantica',
    STAYED: 'stayed',
    ANGELES: 'angeles',
    ARCOS: 'arcos'
  };

  static TIPOS_PERSONAJES = [
    ItemRepository.TIPOS.LACE,
    ItemRepository.TIPOS.IA_CUANTICA,
    ItemRepository.TIPOS.STAYED,
    ItemRepository.TIPOS.ANGELES
  ];

  // ==================== MÉTODOS DE FILTRADO ====================

  /**
   * Obtener items por tipo específico
   * @param {string} tipo - Tipo de item
   * @returns {Promise<Array>}
   */
  async getByType(tipo) {
    const allItems = await this.getAll();
    return allItems.filter(item => item.tipo === tipo);
  }

  /**
   * Obtener todos los personajes (excluye arcos)
   * @returns {Promise<Array>}
   */
  async getPersonajes() {
    const allItems = await this.getAll();
    return allItems.filter(item => 
      ItemRepository.TIPOS_PERSONAJES.includes(item.tipo)
    );
  }

  /**
   * Obtener solo arcos narrativos
   * @returns {Promise<Array>}
   */
  async getArcos() {
    return await this.getByType(ItemRepository.TIPOS.ARCOS);
  }

  /**
   * Buscar items por nombre o descripción
   * @param {string} query - Texto a buscar
   * @returns {Promise<Array>}
   */
  async search(query) {
    if (!query || query.trim() === '') {
      return await this.getAll();
    }

    const allItems = await this.getAll();
    const queryLower = query.toLowerCase().trim();

    return allItems.filter(item => {
      const nombreMatch = item.nombre?.toLowerCase().includes(queryLower);
      const descripcionMatch = item.descripcion?.toLowerCase().includes(queryLower);
      const origenMatch = item.origen?.toLowerCase().includes(queryLower);
      
      return nombreMatch || descripcionMatch || origenMatch;
    });
  }

  /**
   * Obtener items que tienen un componente específico
   * @param {string} componentType - Tipo de componente
   * @returns {Promise<Array>}
   */
  async getByComponentType(componentType) {
    const allItems = await this.getAll();
    
    return allItems.filter(item => {
      if (!item.components) return false;
      
      return Object.values(item.components).some(
        component => component.type === componentType
      );
    });
  }

  // ==================== GESTIÓN DE COMPONENTES ====================

  /**
   * Agregar un componente a un item
   * @param {string|number} itemId - ID del item
   * @param {string} componentId - ID único del componente
   * @param {Object} componentData - { type: string, data: Object }
   * @returns {Promise<Object>} Item actualizado
   */
  async addComponent(itemId, componentId, componentData) {
    const item = await this.getById(itemId);
    
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    // Asegurar que existe el objeto components
    if (!item.components) {
      item.components = {};
    }

    // Agregar nuevo componente
    item.components[componentId] = componentData;

    // Actualizar item
    return await this.update(itemId, item);
  }

  /**
   * Actualizar un componente específico
   * @param {string|number} itemId - ID del item
   * @param {string} componentId - ID del componente
   * @param {Object} componentData - Nuevos datos del componente
   * @returns {Promise<Object>} Item actualizado
   */
  async updateComponent(itemId, componentId, componentData) {
    const item = await this.getById(itemId);
    
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    if (!item.components || !item.components[componentId]) {
      throw new Error(`Component ${componentId} not found in item ${itemId}`);
    }

    // Actualizar componente (merge con datos existentes)
    item.components[componentId] = {
      ...item.components[componentId],
      data: componentData
    };

    // Actualizar item
    return await this.update(itemId, item);
  }

  /**
   * Eliminar un componente específico
   * @param {string|number} itemId - ID del item
   * @param {string} componentId - ID del componente
   * @returns {Promise<Object>} Item actualizado
   */
  async deleteComponent(itemId, componentId) {
    const item = await this.getById(itemId);
    
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    if (!item.components || !item.components[componentId]) {
      throw new Error(`Component ${componentId} not found in item ${itemId}`);
    }

    // Eliminar componente
    delete item.components[componentId];

    // Actualizar item
    return await this.update(itemId, item);
  }

  /**
   * Obtener todos los componentes de un item
   * @param {string|number} itemId - ID del item
   * @returns {Promise<Object>} Objeto con componentes { [id]: { type, data } }
   */
  async getComponents(itemId) {
    const item = await this.getById(itemId);
    
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    return item.components || {};
  }

  /**
   * Contar componentes de un item
   * @param {string|number} itemId - ID del item
   * @returns {Promise<number>}
   */
  async countComponents(itemId) {
    const components = await this.getComponents(itemId);
    return Object.keys(components).length;
  }

  // ==================== MÉTODOS DE ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas generales
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const allItems = await this.getAll();

    // Contar por tipo
    const countByType = {};
    ItemRepository.TIPOS_PERSONAJES.forEach(tipo => {
      countByType[tipo] = allItems.filter(item => item.tipo === tipo).length;
    });
    countByType[ItemRepository.TIPOS.ARCOS] = allItems.filter(
      item => item.tipo === ItemRepository.TIPOS.ARCOS
    ).length;

    // Contar componentes totales
    const totalComponents = allItems.reduce((sum, item) => {
      return sum + (item.components ? Object.keys(item.components).length : 0);
    }, 0);

    // Items con más componentes
    const itemsWithMostComponents = allItems
      .map(item => ({
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        componentCount: item.components ? Object.keys(item.components).length : 0
      }))
      .sort((a, b) => b.componentCount - a.componentCount)
      .slice(0, 5);

    return {
      totalItems: allItems.length,
      totalPersonajes: allItems.filter(item => 
        ItemRepository.TIPOS_PERSONAJES.includes(item.tipo)
      ).length,
      totalArcos: countByType[ItemRepository.TIPOS.ARCOS],
      countByType,
      totalComponents,
      averageComponentsPerItem: allItems.length > 0 
        ? (totalComponents / allItems.length).toFixed(2) 
        : 0,
      itemsWithMostComponents
    };
  }

  /**
   * Validar estructura de item antes de guardar
   * @param {Object} itemData
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateItemData(itemData) {
    const errors = [];

    // Validar campos obligatorios
    if (!itemData.nombre || itemData.nombre.trim() === '') {
      errors.push('El nombre es obligatorio');
    }

    if (!itemData.tipo) {
      errors.push('El tipo es obligatorio');
    } else {
      const validTypes = [
        ...ItemRepository.TIPOS_PERSONAJES,
        ItemRepository.TIPOS.ARCOS
      ];
      if (!validTypes.includes(itemData.tipo)) {
        errors.push(`Tipo inválido: ${itemData.tipo}`);
      }
    }

    // Validar estructura de components si existe
    if (itemData.components) {
      if (typeof itemData.components !== 'object') {
        errors.push('Components debe ser un objeto');
      } else {
        // Validar cada componente
        Object.entries(itemData.components).forEach(([id, component]) => {
          if (!component.type) {
            errors.push(`Componente ${id} no tiene type`);
          }
          if (!component.data) {
            errors.push(`Componente ${id} no tiene data`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== HELPERS ====================

  /**
   * Obtener label legible del tipo
   * @param {string} tipo
   * @returns {string}
   */
  static getTypeLabel(tipo) {
    const labels = {
      lace: 'LACE',
      ia_cuantica: 'IA Cuántica',
      stayed: 'Stayed',
      angeles: 'Ángeles',
      arcos: 'Arco Narrativo'
    };
    return labels[tipo] || 'Desconocido';
  }

  /**
   * Obtener color del tipo (para UI)
   * @param {string} tipo
   * @returns {string} Código hex
   */
  static getTypeColor(tipo) {
    const colors = {
      lace: '#00d4ff',
      ia_cuantica: '#ffd700',
      stayed: '#ff3333',
      angeles: '#ff6600',
      arcos: '#00ff41'
    };
    return colors[tipo] || '#ffffff';
  }

  /**
   * Obtener icono del tipo (emoji)
   * @param {string} tipo
   * @returns {string}
   */
  static getTypeIcon(tipo) {
    const icons = {
      lace: '🤖',
      ia_cuantica: '⚡',
      stayed: '👹',
      angeles: '👼',
      arcos: '📖'
    };
    return icons[tipo] || '❓';
  }
}

// Exportar singleton
export const itemRepository = new ItemRepository();

export default itemRepository;