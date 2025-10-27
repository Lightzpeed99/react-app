// src/services/NotebookService.js

import { notebookRepository } from '../repositories/NotebookRepository';

/**
 * NotebookService - Lógica de negocio para la Libreta Digital Cósmica
 * 
 * RESPONSABILIDADES:
 * - Validaciones de negocio antes de guardar
 * - Normalización de datos (lowercase para tags)
 * - Análisis de contenido (palabras, caracteres, lectura)
 * - Gestión inteligente de tags
 */

export class NotebookService {
  constructor() {
    this.repository = notebookRepository;
  }

  // ==================== CRUD CON VALIDACIONES ====================

  /**
   * Crear una nueva página con validaciones
   * @param {Object} pageData - { title, content?, tags? }
   * @returns {Promise<Object>} Página creada
   */
  async createPage(pageData) {
    // Validar datos
    const validation = this.validatePageData(pageData);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizePageData(pageData);

    // Crear página
    return await this.repository.create(normalizedData);
  }

  /**
   * Actualizar una página existente
   * @param {string|number} id
   * @param {Object} pageData
   * @returns {Promise<Object>}
   */
  async updatePage(id, pageData) {
    // Verificar que existe
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error(`Page with id ${id} not found`);
    }

    // Validar datos
    const validation = this.validatePageData(pageData, true);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizePageData(pageData, existing);

    // Actualizar
    return await this.repository.update(id, normalizedData);
  }

  /**
   * Obtener una página por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getPageById(id) {
    return await this.repository.getById(id);
  }

  /**
   * Obtener todas las páginas
   * @returns {Promise<Array>}
   */
  async getAllPages() {
    return await this.repository.getAll();
  }

  /**
   * Eliminar una página
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async deletePage(id) {
    return await this.repository.delete(id);
  }

  /**
   * Duplicar una página
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async duplicatePage(id) {
    return await this.repository.duplicatePage(id);
  }

  // ==================== BÚSQUEDA ====================

  /**
   * Buscar páginas por título o contenido
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchPages(query) {
    return await this.repository.search(query);
  }

  /**
   * Buscar páginas por título
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchByTitle(query) {
    return await this.repository.searchByTitle(query);
  }

  /**
   * Buscar páginas por contenido
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchByContent(query) {
    return await this.repository.searchByContent(query);
  }

  /**
   * Buscar páginas por tag
   * @param {string} tag
   * @returns {Promise<Array>}
   */
  async searchByTag(tag) {
    if (!tag || tag.trim() === '') {
      return [];
    }
    return await this.repository.searchByTag(tag);
  }

  /**
   * Buscar páginas con todos los tags
   * @param {string[]} tags
   * @returns {Promise<Array>}
   */
  async searchByAllTags(tags) {
    if (!tags || tags.length === 0) {
      return await this.repository.getAll();
    }
    return await this.repository.searchByAllTags(tags);
  }

  /**
   * Buscar páginas con al menos uno de los tags
   * @param {string[]} tags
   * @returns {Promise<Array>}
   */
  async searchByAnyTag(tags) {
    if (!tags || tags.length === 0) {
      return await this.repository.getAll();
    }
    return await this.repository.searchByAnyTag(tags);
  }

  /**
   * Obtener páginas recientes
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecentPages(limit = 10) {
    return await this.repository.getRecent(limit);
  }

  /**
   * Obtener páginas más antiguas
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getOldestPages(limit = 10) {
    return await this.repository.getOldest(limit);
  }

  // ==================== GESTIÓN DE TAGS ====================

  /**
   * Agregar un tag a una página (con validación)
   * @param {string|number} pageId
   * @param {string} tag
   * @returns {Promise<Object>}
   */
  async addTagToPage(pageId, tag) {
    // Validar tag
    if (!tag || tag.trim() === '') {
      throw new Error('Tag cannot be empty');
    }

    const normalizedTag = tag.trim().toLowerCase();

    // Validar longitud
    if (normalizedTag.length > 50) {
      throw new Error('Tag is too long (max 50 characters)');
    }

    // Validar caracteres (solo letras, números, guiones y espacios)
    if (!/^[a-z0-9\s\-]+$/i.test(normalizedTag)) {
      throw new Error('Tag contains invalid characters (only letters, numbers, spaces and hyphens allowed)');
    }

    return await this.repository.addTagToPage(pageId, normalizedTag);
  }

  /**
   * Agregar múltiples tags a una página
   * @param {string|number} pageId
   * @param {string[]} tags
   * @returns {Promise<Object>}
   */
  async addTagsToPage(pageId, tags) {
    // Validar y normalizar tags
    const validTags = tags
      .filter(t => t && t.trim() !== '')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length <= 50)
      .filter(t => /^[a-z0-9\s\-]+$/i.test(t));

    if (validTags.length === 0) {
      throw new Error('No valid tags to add');
    }

    return await this.repository.addTagsToPage(pageId, validTags);
  }

  /**
   * Eliminar un tag de una página
   * @param {string|number} pageId
   * @param {number} tagIndex
   * @returns {Promise<Object>}
   */
  async removeTagFromPage(pageId, tagIndex) {
    return await this.repository.removeTagFromPage(pageId, tagIndex);
  }

  /**
   * Eliminar un tag por valor
   * @param {string|number} pageId
   * @param {string} tag
   * @returns {Promise<Object>}
   */
  async removeTagByValue(pageId, tag) {
    return await this.repository.removeTagByValue(pageId, tag);
  }

  /**
   * Obtener todos los tags únicos
   * @returns {Promise<string[]>}
   */
  async getAllTags() {
    return await this.repository.getAllTags();
  }

  /**
   * Obtener tags con frecuencia de uso
   * @returns {Promise<Array<{tag: string, count: number}>>}
   */
  async getTagFrequency() {
    return await this.repository.getTagFrequency();
  }

  /**
   * Sugerir tags basados en contenido
   * @param {string} content
   * @returns {Promise<string[]>}
   */
  async suggestTags(content) {
    if (!content || content.trim() === '') {
      return [];
    }

    const existingTags = await this.getAllTags();
    const contentLower = content.toLowerCase();

    // Buscar tags existentes que aparecen en el contenido
    const suggestions = existingTags.filter(tag => 
      contentLower.includes(tag.toLowerCase())
    );

    return suggestions.slice(0, 5); // Máximo 5 sugerencias
  }

  // ==================== ANÁLISIS DE CONTENIDO ====================

  /**
   * Obtener estadísticas de una página
   * @param {string|number} pageId
   * @returns {Promise<Object>}
   */
  async getPageStats(pageId) {
    const page = await this.repository.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    const words = await this.repository.countWords(pageId);
    const characters = await this.repository.countCharacters(pageId);
    const readingTime = NotebookService.estimateReadingTime(words);

    return {
      wordCount: words,
      characterCount: characters,
      characterCountNoSpaces: page.content ? page.content.replace(/\s/g, '').length : 0,
      paragraphCount: page.content ? page.content.split(/\n\n+/).filter(p => p.trim()).length : 0,
      lineCount: page.content ? page.content.split('\n').length : 0,
      tagCount: page.tags ? page.tags.length : 0,
      readingTimeMinutes: readingTime
    };
  }

  /**
   * Generar preview de una página
   * @param {string|number} pageId
   * @param {number} wordLimit
   * @returns {Promise<Object>}
   */
  async getPagePreview(pageId, wordLimit = 30) {
    const page = await this.repository.getById(pageId);
    
    if (!page) {
      throw new Error(`Page with id ${pageId} not found`);
    }

    return {
      id: page.id,
      title: page.title,
      preview: NotebookService.generatePreview(page.content, wordLimit),
      tagCount: page.tags ? page.tags.length : 0,
      topTags: page.tags ? page.tags.slice(0, 3) : [],
      createdAt: page.createdAt,
      updatedAt: page.updatedAt
    };
  }

  // ==================== EXPORT/IMPORT ====================

  /**
   * Exportar todas las páginas
   * @returns {Promise<Object>}
   */
  async exportAll() {
    return await this.repository.exportData();
  }

  /**
   * Importar páginas
   * @param {Object|Array} data
   * @returns {Promise<Array>}
   */
  async importAll(data) {
    // Validar formato
    const pages = Array.isArray(data) ? data : (data.data || data);
    
    if (!Array.isArray(pages)) {
      throw new Error('Import data must be an array or object with data property');
    }

    // Validar cada página
    const invalidPages = [];
    pages.forEach((page, index) => {
      const validation = this.validatePageData(page, true);
      if (!validation.valid) {
        invalidPages.push({
          index,
          title: page.title || 'unknown',
          errors: validation.errors
        });
      }
    });

    if (invalidPages.length > 0) {
      throw new Error(`Invalid pages found: ${JSON.stringify(invalidPages)}`);
    }

    return await this.repository.importData(pages);
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
   * Obtener páginas más largas
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getLongestPages(limit = 5) {
    const allPages = await this.repository.getAll();
    
    return allPages
      .map(page => ({
        ...page,
        wordCount: page.content ? page.content.split(/\s+/).filter(w => w).length : 0
      }))
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, limit);
  }

  /**
   * Obtener páginas sin tags
   * @returns {Promise<Array>}
   */
  async getPagesWithoutTags() {
    const allPages = await this.repository.getAll();
    return allPages.filter(page => !page.tags || page.tags.length === 0);
  }

  /**
   * Obtener páginas con más tags
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getPagesWithMostTags(limit = 5) {
    const allPages = await this.repository.getAll();
    
    return allPages
      .map(page => ({
        ...page,
        tagCount: page.tags ? page.tags.length : 0
      }))
      .sort((a, b) => b.tagCount - a.tagCount)
      .slice(0, limit);
  }

  // ==================== VALIDACIONES ====================

  /**
   * Validar datos de página
   * @param {Object} pageData
   * @param {boolean} isUpdate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validatePageData(pageData, isUpdate = false) {
    const errors = [];

    // Título (obligatorio solo en create)
    if (!isUpdate && (!pageData.title || pageData.title.trim() === '')) {
      errors.push('El título es obligatorio');
    }

    // Validar título si existe
    if (pageData.title) {
      if (pageData.title.trim().length > 255) {
        errors.push('El título no puede exceder 255 caracteres');
      }
    }

    // Validar content si existe
    if (pageData.content && typeof pageData.content !== 'string') {
      errors.push('Content debe ser un string');
    }

    // Validar tags si existe
    if (pageData.tags !== undefined) {
      if (!Array.isArray(pageData.tags)) {
        errors.push('Tags debe ser un array');
      } else {
        // Validar cada tag
        pageData.tags.forEach((tag, index) => {
          if (typeof tag !== 'string') {
            errors.push(`Tag en índice ${index} no es un string`);
          } else if (tag.length > 50) {
            errors.push(`Tag en índice ${index} excede 50 caracteres`);
          } else if (!/^[a-z0-9\s\-]+$/i.test(tag)) {
            errors.push(`Tag en índice ${index} contiene caracteres inválidos`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== NORMALIZACIÓN PRIVADA ====================

  /**
   * Normalizar datos de página
   * @private
   * @param {Object} pageData
   * @param {Object} existing - Datos existentes (para updates)
   * @returns {Object}
   */
  _normalizePageData(pageData, existing = null) {
    const normalized = { ...pageData };

    // Normalizar título (trim)
    if (normalized.title) {
      normalized.title = normalized.title.trim();
    }

    // Normalizar content (trim)
    if (normalized.content) {
      normalized.content = normalized.content.trim();
    } else if (!normalized.content && !existing) {
      normalized.content = '';
    }

    // Normalizar tags a lowercase
    if (normalized.tags && Array.isArray(normalized.tags)) {
      normalized.tags = normalized.tags
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
        .filter(t => t.length <= 50)
        .filter(t => /^[a-z0-9\s\-]+$/i.test(t))
        .filter((tag, index, self) => self.indexOf(tag) === index); // Eliminar duplicados
    } else if (!normalized.tags && !existing) {
      normalized.tags = [];
    }

    return normalized;
  }

  // ==================== HELPERS ESTÁTICOS ====================

  /**
   * Estimar tiempo de lectura (en minutos)
   * @param {number} wordCount - Número de palabras
   * @param {number} wordsPerMinute - Palabras por minuto (default: 200)
   * @returns {number} Minutos de lectura
   */
  static estimateReadingTime(wordCount, wordsPerMinute = 200) {
    if (wordCount === 0) return 0;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Generar preview de contenido
   * @param {string} content
   * @param {number} wordLimit
   * @returns {string}
   */
  static generatePreview(content, wordLimit = 30) {
    if (!content) return '';
    
    const words = content.split(/\s+/).filter(w => w);
    if (words.length <= wordLimit) {
      return content;
    }
    
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  /**
   * Contar ocurrencias de una palabra en el contenido
   * @param {string} content
   * @param {string} word
   * @returns {number}
   */
  static countWordOccurrences(content, word) {
    if (!content || !word) return 0;
    
    const contentLower = content.toLowerCase();
    const wordLower = word.toLowerCase();
    const regex = new RegExp(`\\b${wordLower}\\b`, 'g');
    const matches = contentLower.match(regex);
    
    return matches ? matches.length : 0;
  }

  /**
   * Formatear fecha de forma legible
   * @param {string} isoDate
   * @returns {string}
   */
  static formatDate(isoDate) {
    if (!isoDate) return '';
    
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

// Exportar singleton
export const notebookService = new NotebookService();

export default notebookService;