// src/repositories/NotebookRepository.js

import { LocalStorageRepository } from './LocalStorageRepository';

/**
 * NotebookRepository - Repository para la Libreta Digital Cósmica
 * 
 * GESTIONA: Páginas de notas, ideas y pensamientos del universo Reload
 * 
 * ESTRUCTURA DE DATOS (PRESERVAR):
 * [
 *   {
 *     id: string,
 *     title: string,
 *     content: string,
 *     tags: string[] (lowercase),
 *     createdAt: string (ISO),
 *     updatedAt: string (ISO)
 *   }
 * ]
 * 
 * PÁGINAS INICIALES:
 * - Bienvenida a tu Libreta
 * - Ideas Musicales
 * - Conceptos Visuales
 * 
 * IMPORTANTE: Esta estructura NO se modifica. Compatibilidad con JSON existente.
 */

export class NotebookRepository extends LocalStorageRepository {
  constructor() {
    super('reloadxps_notebook');
  }

  // ==================== MÉTODOS ESPECÍFICOS DE NOTEBOOK ====================

  /**
   * Buscar páginas por título (case-insensitive)
   * @param {string} query - Texto a buscar
   * @returns {Promise<Array>}
   */
  async searchByTitle(query) {
    if (!query || query.trim() === '') {
      return await this.getAll();
    }

    const pages = await this.getAll();
    const queryLower = query.toLowerCase().trim();

    return pages.filter(page => 
      page.title?.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Buscar páginas por contenido (case-insensitive)
   * @param {string} query - Texto a buscar
   * @returns {Promise<Array>}
   */
  async searchByContent(query) {
    if (!query || query.trim() === '') {
      return await this.getAll();
    }

    const pages = await this.getAll();
    const queryLower = query.toLowerCase().trim();

    return pages.filter(page => 
      page.content?.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Buscar páginas por título o contenido
   * @param {string} query - Texto a buscar
   * @returns {Promise<Array>}
   */
  async search(query) {
    if (!query || query.trim() === '') {
      return await this.getAll();
    }

    const pages = await this.getAll();
    const queryLower = query.toLowerCase().trim();

    return pages.filter(page => {
      const titleMatch = page.title?.toLowerCase().includes(queryLower);
      const contentMatch = page.content?.toLowerCase().includes(queryLower);
      return titleMatch || contentMatch;
    });
  }

  /**
   * Buscar páginas por tag específico
   * @param {string} tag - Tag a buscar (case-insensitive)
   * @returns {Promise<Array>}
   */
  async searchByTag(tag) {
    const pages = await this.getAll();
    const tagLower = tag.toLowerCase().trim();

    return pages.filter(page => {
      if (!page.tags || !Array.isArray(page.tags)) return false;
      return page.tags.some(t => t.toLowerCase() === tagLower);
    });
  }

  /**
   * Buscar páginas que contengan TODOS los tags especificados
   * @param {string[]} tags - Array de tags
   * @returns {Promise<Array>}
   */
  async searchByAllTags(tags) {
    const pages = await this.getAll();
    const tagsLower = tags.map(t => t.toLowerCase().trim());

    return pages.filter(page => {
      if (!page.tags || !Array.isArray(page.tags)) return false;
      
      const pageTagsLower = page.tags.map(t => t.toLowerCase());
      return tagsLower.every(tag => pageTagsLower.includes(tag));
    });
  }

  /**
   * Buscar páginas que contengan AL MENOS UNO de los tags
   * @param {string[]} tags - Array de tags
   * @returns {Promise<Array>}
   */
  async searchByAnyTag(tags) {
    const pages = await this.getAll();
    const tagsLower = tags.map(t => t.toLowerCase().trim());

    return pages.filter(page => {
      if (!page.tags || !Array.isArray(page.tags)) return false;
      
      const pageTagsLower = page.tags.map(t => t.toLowerCase());
      return tagsLower.some(tag => pageTagsLower.includes(tag));
    });
  }

  /**
   * Obtener páginas más recientes
   * @param {number} limit - Número de páginas a obtener
   * @returns {Promise<Array>}
   */
  async getRecent(limit = 10) {
    const pages = await this.getAll();

    // Ordenar por fecha de actualización (más recientes primero)
    const sorted = pages.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
    });

    return sorted.slice(0, limit);
  }

  /**
   * Obtener páginas más antiguas
   * @param {number} limit - Número de páginas a obtener
   * @returns {Promise<Array>}
   */
  async getOldest(limit = 10) {
    const pages = await this.getAll();

    // Ordenar por fecha de creación (más antiguas primero)
    const sorted = pages.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateA - dateB;
    });

    return sorted.slice(0, limit);
  }

  // ==================== GESTIÓN DE TAGS ====================

  /**
   * Agregar un tag a una página
   * @param {string|number} pageId - ID de la página
   * @param {string} tag - Tag a agregar (se normalizará a lowercase)
   * @returns {Promise<Object>} Página actualizada
   */
  async addTagToPage(pageId, tag) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    // Normalizar tag a lowercase
    const normalizedTag = tag.trim().toLowerCase();

    if (!normalizedTag) {
      throw new Error('Tag cannot be empty');
    }

    // Asegurar que existe el array de tags
    if (!page.tags) {
      page.tags = [];
    }

    // Verificar que no exista duplicado
    if (page.tags.includes(normalizedTag)) {
      throw new Error(`Tag "${normalizedTag}" already exists in page`);
    }

    // Agregar tag
    page.tags.push(normalizedTag);

    // Actualizar página
    return await this.update(pageId, page);
  }

  /**
   * Agregar múltiples tags a una página
   * @param {string|number} pageId - ID de la página
   * @param {string[]} tags - Array de tags
   * @returns {Promise<Object>} Página actualizada
   */
  async addTagsToPage(pageId, tags) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    // Normalizar tags
    const normalizedTags = tags
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (!page.tags) {
      page.tags = [];
    }

    // Agregar solo tags nuevos (sin duplicados)
    const uniqueTags = normalizedTags.filter(
      tag => !page.tags.includes(tag)
    );

    page.tags.push(...uniqueTags);

    return await this.update(pageId, page);
  }

  /**
   * Eliminar un tag de una página por índice
   * @param {string|number} pageId - ID de la página
   * @param {number} tagIndex - Índice del tag en el array
   * @returns {Promise<Object>} Página actualizada
   */
  async removeTagFromPage(pageId, tagIndex) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    if (!page.tags || !Array.isArray(page.tags)) {
      throw new Error('Page has no tags');
    }

    if (tagIndex < 0 || tagIndex >= page.tags.length) {
      throw new Error(`Invalid tag index: ${tagIndex}`);
    }

    // Eliminar tag
    page.tags.splice(tagIndex, 1);

    // Actualizar página
    return await this.update(pageId, page);
  }

  /**
   * Eliminar un tag por valor (no por índice)
   * @param {string|number} pageId - ID de la página
   * @param {string} tag - Tag a eliminar
   * @returns {Promise<Object>} Página actualizada
   */
  async removeTagByValue(pageId, tag) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    if (!page.tags || !Array.isArray(page.tags)) {
      throw new Error('Page has no tags');
    }

    const normalizedTag = tag.trim().toLowerCase();
    const index = page.tags.indexOf(normalizedTag);

    if (index === -1) {
      throw new Error(`Tag "${normalizedTag}" not found in page`);
    }

    // Eliminar tag
    page.tags.splice(index, 1);

    return await this.update(pageId, page);
  }

  /**
   * Obtener todos los tags únicos de todas las páginas
   * @returns {Promise<string[]>}
   */
  async getAllTags() {
    const pages = await this.getAll();
    
    const allTags = pages.reduce((tags, page) => {
      if (page.tags && Array.isArray(page.tags)) {
        return [...tags, ...page.tags];
      }
      return tags;
    }, []);

    // Eliminar duplicados y ordenar
    return [...new Set(allTags)].sort();
  }

  /**
   * Obtener tags con su frecuencia de uso
   * @returns {Promise<Array<{tag: string, count: number}>>}
   */
  async getTagFrequency() {
    const pages = await this.getAll();
    const tagCounts = {};

    pages.forEach(page => {
      if (page.tags && Array.isArray(page.tags)) {
        page.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Convertir a array y ordenar por frecuencia
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas de la libreta
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const pages = await this.getAll();

    const totalPages = pages.length;
    const totalTags = await this.getAllTags();
    const tagFrequency = await this.getTagFrequency();

    // Páginas con más tags
    const pagesWithMostTags = pages
      .map(page => ({
        id: page.id,
        title: page.title,
        tagCount: page.tags ? page.tags.length : 0
      }))
      .sort((a, b) => b.tagCount - a.tagCount)
      .slice(0, 5);

    // Páginas sin tags
    const pagesWithoutTags = pages.filter(
      page => !page.tags || page.tags.length === 0
    ).length;

    // Promedio de palabras por página
    const totalWords = pages.reduce((sum, page) => {
      const words = page.content?.split(/\s+/).filter(w => w.length > 0) || [];
      return sum + words.length;
    }, 0);

    return {
      totalPages,
      totalUniqueTags: totalTags.length,
      averageTagsPerPage: totalPages > 0 
        ? (pages.reduce((sum, p) => sum + (p.tags?.length || 0), 0) / totalPages).toFixed(2)
        : 0,
      averageWordsPerPage: totalPages > 0 
        ? Math.round(totalWords / totalPages)
        : 0,
      pagesWithMostTags,
      pagesWithoutTags,
      topTags: tagFrequency.slice(0, 10)
    };
  }

  /**
   * Validar estructura de página
   * @param {Object} pageData
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validatePageData(pageData) {
    const errors = [];

    // Validar título
    if (!pageData.title || pageData.title.trim() === '') {
      errors.push('El título es obligatorio');
    }

    // Validar tags si existe
    if (pageData.tags !== undefined) {
      if (!Array.isArray(pageData.tags)) {
        errors.push('Tags debe ser un array');
      } else {
        // Validar que cada tag sea string
        pageData.tags.forEach((tag, index) => {
          if (typeof tag !== 'string') {
            errors.push(`Tag en índice ${index} no es un string`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Duplicar una página
   * @param {string|number} pageId - ID de la página a duplicar
   * @returns {Promise<Object>} Nueva página duplicada
   */
  async duplicatePage(pageId) {
    const original = await this.getById(pageId);
    
    if (!original) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    // Crear copia sin ID
    const { id: _, createdAt, updatedAt, ...pageData } = original;

    // Agregar indicador de que es una copia
    const duplicated = {
      ...pageData,
      title: `${pageData.title} (Copy)`,
      tags: [...(pageData.tags || [])] // Clonar array
    };

    return await this.create(duplicated);
  }

  /**
   * Contar palabras en una página
   * @param {string|number} pageId - ID de la página
   * @returns {Promise<number>}
   */
  async countWords(pageId) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    if (!page.content) return 0;

    const words = page.content.split(/\s+/).filter(w => w.length > 0);
    return words.length;
  }

  /**
   * Contar caracteres en una página
   * @param {string|number} pageId - ID de la página
   * @returns {Promise<number>}
   */
  async countCharacters(pageId) {
    const page = await this.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    return page.content?.length || 0;
  }
}

// Exportar singleton
export const notebookRepository = new NotebookRepository();

export default notebookRepository;