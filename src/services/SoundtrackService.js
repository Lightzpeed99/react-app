// src/services/SoundtrackService.js

import { soundtrackRepository } from '../repositories/SoundtrackRepository';

/**
 * SoundtrackService - Lógica de negocio para prompts de Suno
 * 
 * RESPONSABILIDADES:
 * - Validaciones de negocio antes de guardar
 * - Normalización de datos según reglas de Suno
 * - Transformaciones complejas
 * - Preparación de datos para futuro mapeo DB
 * 
 * FUTURO DB: Este service prepara los datos para dividirse en múltiples tablas:
 * - Prompt (raíz)
 * - Lyrics (con cálculo de porcentajes)
 * - StyleDescription (con extracción de descriptores)
 * - ExcludedStyles
 * - AdvancedOptions
 * - ResultadoTrack
 * - EstructuraTemporal
 * - CuePoint
 * - PromptTag (tags)
 */

export class SoundtrackService {
  constructor() {
    this.repository = soundtrackRepository;
  }

  // ==================== LÍMITES Y VALORES POR DEFECTO ====================

  static LIMITS = {
    SONG_TITLE_MAX: 255,
    LYRICS_MAX: 5000,
    STYLE_DESCRIPTION_MAX: 1000,
    EXCLUDED_STYLE_MAX: 1000,
    WEIRDNESS_MIN: 0,
    WEIRDNESS_MAX: 100,
    STYLE_INFLUENCE_MIN: 0,
    STYLE_INFLUENCE_MAX: 100,
    RATING_MIN: 1,
    RATING_MAX: 10
  };

  static DEFAULTS = {
    VERSION: 'v4.5',
    DURACION: '3:30',
    WEIRDNESS: 50,
    STYLE_INFLUENCE: 50,
    TAGS: [],
    ESTRUCTURA: [],
    CUE_POINTS: []
  };

  // ==================== CRUD CON VALIDACIONES ====================

  /**
   * Crear un nuevo prompt con validaciones completas
   * @param {Object} promptData - Datos del prompt
   * @returns {Promise<Object>} Prompt creado
   */
  async createPrompt(promptData) {
    // Validar datos
    const validation = this.validatePromptData(promptData);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar y completar datos
    const normalizedData = this._normalizePromptData(promptData);

    // Crear prompt
    return await this.repository.createPrompt(normalizedData);
  }

  /**
   * Actualizar un prompt existente
   * @param {string|number} id
   * @param {Object} promptData
   * @returns {Promise<Object>}
   */
  async updatePrompt(id, promptData) {
    // Verificar que existe
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error(`Prompt with id ${id} not found`);
    }

    // Validar datos
    const validation = this.validatePromptData(promptData, true); // true = update mode
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizePromptData(promptData, existing);

    // Actualizar
    return await this.repository.updatePrompt(id, normalizedData);
  }

  /**
   * Obtener un prompt por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getPromptById(id) {
    return await this.repository.getById(id);
  }

  /**
   * Obtener todos los prompts
   * @returns {Promise<Array>}
   */
  async getAllPrompts() {
    return await this.repository.getAll();
  }

  /**
   * Eliminar un prompt
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async deletePrompt(id) {
    return await this.repository.delete(id);
  }

  // ==================== BÚSQUEDA Y FILTRADO ====================

  /**
   * Buscar prompts por tags
   * @param {string[]} tags
   * @returns {Promise<Array>}
   */
  async searchByTags(tags) {
    if (!tags || tags.length === 0) {
      return await this.repository.getAll();
    }
    return await this.repository.searchByTags(tags);
  }

  /**
   * Buscar por género
   * @param {string} genre
   * @returns {Promise<Array>}
   */
  async searchByGenre(genre) {
    return await this.repository.getByGenre(genre);
  }

  /**
   * Buscar por descriptores
   * @param {string[]} descriptors
   * @returns {Promise<Array>}
   */
  async searchByDescriptors(descriptors) {
    return await this.repository.searchByDescriptors(descriptors);
  }

  /**
   * Obtener prompts mejor calificados
   * @param {number} minRating - Calificación mínima (1-10)
   * @param {number} limit - Máximo número de resultados
   * @returns {Promise<Array>}
   */
  async getTopRated(minRating = 7, limit = 10) {
    const prompts = await this.repository.getByMinRating(minRating);
    
    // Ordenar por calificación descendente
    const sorted = prompts.sort((a, b) => 
      (b.calificacion || 0) - (a.calificacion || 0)
    );
    
    return sorted.slice(0, limit);
  }

  /**
   * Obtener prompts recientes
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecentPrompts(limit = 10) {
    return await this.repository.getRecent(limit);
  }

  // ==================== GESTIÓN DE RATINGS ====================

  /**
   * Calificar un prompt (1-10)
   * @param {string|number} id
   * @param {number} rating - Calificación de 1 a 10
   * @returns {Promise<Object>}
   */
  async ratePrompt(id, rating) {
    if (rating < SoundtrackService.LIMITS.RATING_MIN || 
        rating > SoundtrackService.LIMITS.RATING_MAX) {
      throw new Error(`Rating must be between ${SoundtrackService.LIMITS.RATING_MIN} and ${SoundtrackService.LIMITS.RATING_MAX}`);
    }

    const prompt = await this.repository.getById(id);
    if (!prompt) {
      throw new Error(`Prompt with id ${id} not found`);
    }

    return await this.repository.update(id, {
      ...prompt,
      calificacion: rating
    });
  }

  // ==================== DUPLICACIÓN E ITERACIONES ====================

  /**
   * Duplicar un prompt para crear iteración
   * @param {string|number} id
   * @param {Object} changes - Cambios a aplicar en la copia
   * @returns {Promise<Object>}
   */
  async duplicatePrompt(id, changes = {}) {
    const duplicated = await this.repository.duplicatePrompt(id);
    
    // Aplicar cambios si se proporcionan
    if (Object.keys(changes).length > 0) {
      return await this.repository.update(duplicated.id, {
        ...duplicated,
        ...changes
      });
    }
    
    return duplicated;
  }

  // ==================== EXPORT/IMPORT ====================

  /**
   * Exportar todos los prompts
   * @returns {Promise<Object>}
   */
  async exportAll() {
    return await this.repository.exportData();
  }

  /**
   * Importar prompts
   * @param {Object|Array} data
   * @returns {Promise<Array>}
   */
  async importAll(data) {
    // Validar formato
    const items = Array.isArray(data) ? data : (data.data || data);
    
    if (!Array.isArray(items)) {
      throw new Error('Import data must be an array or object with data property');
    }

    // Validar cada prompt
    const invalidPrompts = [];
    items.forEach((prompt, index) => {
      const validation = this.validatePromptData(prompt, true);
      if (!validation.valid) {
        invalidPrompts.push({
          index,
          errors: validation.errors
        });
      }
    });

    if (invalidPrompts.length > 0) {
      throw new Error(`Invalid prompts found: ${JSON.stringify(invalidPrompts)}`);
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

  // ==================== VALIDACIONES ====================

  /**
   * Validar datos completos de un prompt
   * @param {Object} promptData
   * @param {boolean} isUpdate - Si es actualización (campos opcionales)
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validatePromptData(promptData, isUpdate = false) {
    const errors = [];

    // Song Title (obligatorio solo en create)
    if (!isUpdate && (!promptData.songTitle || promptData.songTitle.trim() === '')) {
      errors.push('Song Title es obligatorio');
    }
    if (promptData.songTitle && promptData.songTitle.length > SoundtrackService.LIMITS.SONG_TITLE_MAX) {
      errors.push(`Song Title excede ${SoundtrackService.LIMITS.SONG_TITLE_MAX} caracteres`);
    }

    // Lyrics (max 5000 chars)
    if (promptData.lyrics && promptData.lyrics.length > SoundtrackService.LIMITS.LYRICS_MAX) {
      errors.push(`Lyrics excede ${SoundtrackService.LIMITS.LYRICS_MAX} caracteres (actual: ${promptData.lyrics.length})`);
    }

    // Style Description (max 1000 chars)
    if (promptData.styleDescription && promptData.styleDescription.length > SoundtrackService.LIMITS.STYLE_DESCRIPTION_MAX) {
      errors.push(`Style Description excede ${SoundtrackService.LIMITS.STYLE_DESCRIPTION_MAX} caracteres (actual: ${promptData.styleDescription.length})`);
    }

    // Excluded Style (max 1000 chars)
    if (promptData.excludedStyle && promptData.excludedStyle.length > SoundtrackService.LIMITS.EXCLUDED_STYLE_MAX) {
      errors.push(`Excluded Style excede ${SoundtrackService.LIMITS.EXCLUDED_STYLE_MAX} caracteres (actual: ${promptData.excludedStyle.length})`);
    }

    // Weirdness (0-100)
    if (promptData.weirdness !== undefined) {
      const weirdness = Number(promptData.weirdness);
      if (isNaN(weirdness) || weirdness < SoundtrackService.LIMITS.WEIRDNESS_MIN || weirdness > SoundtrackService.LIMITS.WEIRDNESS_MAX) {
        errors.push(`Weirdness debe estar entre ${SoundtrackService.LIMITS.WEIRDNESS_MIN} y ${SoundtrackService.LIMITS.WEIRDNESS_MAX}`);
      }
    }

    // Style Influence (0-100)
    if (promptData.styleInfluence !== undefined) {
      const influence = Number(promptData.styleInfluence);
      if (isNaN(influence) || influence < SoundtrackService.LIMITS.STYLE_INFLUENCE_MIN || influence > SoundtrackService.LIMITS.STYLE_INFLUENCE_MAX) {
        errors.push(`Style Influence debe estar entre ${SoundtrackService.LIMITS.STYLE_INFLUENCE_MIN} y ${SoundtrackService.LIMITS.STYLE_INFLUENCE_MAX}`);
      }
    }

    // Calificación (1-10) si existe
    if (promptData.calificacion !== undefined) {
      const rating = Number(promptData.calificacion);
      if (isNaN(rating) || rating < SoundtrackService.LIMITS.RATING_MIN || rating > SoundtrackService.LIMITS.RATING_MAX) {
        errors.push(`Calificación debe estar entre ${SoundtrackService.LIMITS.RATING_MIN} y ${SoundtrackService.LIMITS.RATING_MAX}`);
      }
    }

    // Tags (debe ser array)
    if (promptData.tags !== undefined && !Array.isArray(promptData.tags)) {
      errors.push('Tags debe ser un array');
    }

    // Estructura (debe ser array)
    if (promptData.estructura !== undefined && !Array.isArray(promptData.estructura)) {
      errors.push('Estructura debe ser un array');
    }

    // CuePoints (debe ser array)
    if (promptData.cuePoints !== undefined && !Array.isArray(promptData.cuePoints)) {
      errors.push('CuePoints debe ser un array');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== NORMALIZACIÓN PRIVADA ====================

  /**
   * Normalizar datos del prompt con valores por defecto
   * @private
   * @param {Object} promptData
   * @param {Object} existing - Datos existentes (para updates)
   * @returns {Object}
   */
  _normalizePromptData(promptData, existing = null) {
    const normalized = { ...promptData };

    // Aplicar valores por defecto solo si no existen
    if (normalized.version === undefined) {
      normalized.version = existing?.version || SoundtrackService.DEFAULTS.VERSION;
    }
    if (normalized.duracion === undefined) {
      normalized.duracion = existing?.duracion || SoundtrackService.DEFAULTS.DURACION;
    }
    if (normalized.weirdness === undefined) {
      normalized.weirdness = existing?.weirdness || SoundtrackService.DEFAULTS.WEIRDNESS;
    }
    if (normalized.styleInfluence === undefined) {
      normalized.styleInfluence = existing?.styleInfluence || SoundtrackService.DEFAULTS.STYLE_INFLUENCE;
    }
    if (normalized.tags === undefined) {
      normalized.tags = existing?.tags || [...SoundtrackService.DEFAULTS.TAGS];
    }
    if (normalized.estructura === undefined) {
      normalized.estructura = existing?.estructura || [...SoundtrackService.DEFAULTS.ESTRUCTURA];
    }
    if (normalized.cuePoints === undefined) {
      normalized.cuePoints = existing?.cuePoints || [...SoundtrackService.DEFAULTS.CUE_POINTS];
    }

    // Normalizar strings (trim)
    if (normalized.songTitle) {
      normalized.songTitle = normalized.songTitle.trim();
    }
    if (normalized.lyrics) {
      normalized.lyrics = normalized.lyrics.trim();
    }
    if (normalized.styleDescription) {
      normalized.styleDescription = normalized.styleDescription.trim();
    }
    if (normalized.excludedStyle) {
      normalized.excludedStyle = normalized.excludedStyle.trim();
    }

    // Normalizar tags a lowercase
    if (normalized.tags && Array.isArray(normalized.tags)) {
      normalized.tags = normalized.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag);
    }

    // Asegurar que weirdness y styleInfluence sean números
    if (normalized.weirdness !== undefined) {
      normalized.weirdness = Number(normalized.weirdness);
    }
    if (normalized.styleInfluence !== undefined) {
      normalized.styleInfluence = Number(normalized.styleInfluence);
    }

    return normalized;
  }

  // ==================== HELPERS PÚBLICOS ====================

  /**
   * Calcular porcentaje de uso de caracteres
   * @param {string} text
   * @param {number} maxChars
   * @returns {number} Porcentaje (0-100)
   */
  static calculateCharUsage(text, maxChars) {
    if (!text) return 0;
    return Math.round((text.length / maxChars) * 100);
  }

  /**
   * Verificar si un prompt está cerca del límite de caracteres
   * @param {Object} promptData
   * @returns {Object} Warnings por campo
   */
  static checkCharacterLimits(promptData) {
    const warnings = {};

    if (promptData.lyrics) {
      const usage = SoundtrackService.calculateCharUsage(
        promptData.lyrics, 
        SoundtrackService.LIMITS.LYRICS_MAX
      );
      if (usage > 90) {
        warnings.lyrics = `${usage}% del límite usado (${promptData.lyrics.length}/${SoundtrackService.LIMITS.LYRICS_MAX})`;
      }
    }

    if (promptData.styleDescription) {
      const usage = SoundtrackService.calculateCharUsage(
        promptData.styleDescription,
        SoundtrackService.LIMITS.STYLE_DESCRIPTION_MAX
      );
      if (usage > 90) {
        warnings.styleDescription = `${usage}% del límite usado (${promptData.styleDescription.length}/${SoundtrackService.LIMITS.STYLE_DESCRIPTION_MAX})`;
      }
    }

    if (promptData.excludedStyle) {
      const usage = SoundtrackService.calculateCharUsage(
        promptData.excludedStyle,
        SoundtrackService.LIMITS.EXCLUDED_STYLE_MAX
      );
      if (usage > 90) {
        warnings.excludedStyle = `${usage}% del límite usado (${promptData.excludedStyle.length}/${SoundtrackService.LIMITS.EXCLUDED_STYLE_MAX})`;
      }
    }

    return warnings;
  }
}

// Exportar singleton
export const soundtrackService = new SoundtrackService();

export default soundtrackService;