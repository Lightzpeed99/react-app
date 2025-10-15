// src/repositories/SoundtrackRepository.js

import { LocalStorageRepository } from './LocalStorageRepository';

/**
 * SoundtrackRepository - Repository específico para prompts de Suno
 * 
 * ESTADO: Implementado con localStorage
 * FUTURO: Mapeará a múltiples tablas de SQL Server (ReloadDB)
 * 
 * MAPEO A DB (FUTURO):
 * Un prompt localStorage → 8+ tablas SQL:
 * - Prompt (raíz: NombreTrack, FechaCreacion, ObjetivoMusical, etc.)
 * - Lyrics (ContenidoCompleto, CharCount, Porcentajes)
 * - StyleDescription (ContenidoCompleto, GeneroPrincipal, Bpm, etc.)
 *   └── Descriptor (1:N - cada palabra relevante)
 * - ExcludedStyles (ContenidoCompleto, DescriptoresExcluidos)
 * - AdvancedOptions (WeirdnessPercentage, StyleInfluencePercentage)
 * - ResultadoTrack (SunoUrl, DuracionReal, BpmReal, etc.)
 *   ├── EstructuraTemporal (1:N - estructura[])
 *   ├── CuePoint (1:N - cuePoints[])
 *   └── TrackTagGenero (M:N - tags de género)
 * - PromptTag (M:N - tags temáticos)
 * 
 * LÍMITES SUNO:
 * - songTitle: sin límite específico
 * - lyrics: 5000 caracteres MAX
 * - styleDescription: 1000 caracteres MAX
 * - excludedStyle: 1000 caracteres MAX
 * - weirdness: 0-100
 * - styleInfluence: 0-100
 */

export class SoundtrackRepository extends LocalStorageRepository {
  constructor() {
    super('reloadxps_soundtrack');
  }

  // ==================== MÉTODOS ESPECÍFICOS DE SOUNDTRACK ====================

  /**
   * Crear un prompt completo (wrapper semántico de create)
   * @param {Object} promptData - Datos del prompt Suno
   * @returns {Promise<Object>} Prompt creado
   * 
   * ESTRUCTURA promptData:
   * {
   *   songTitle: string,
   *   lyrics: string (max 5000 chars),
   *   styleDescription: string (max 1000 chars),
   *   excludedStyle: string (max 1000 chars),
   *   weirdness: number (0-100),
   *   styleInfluence: number (0-100),
   *   version: string ('v4.5' default),
   *   duracion: string ('3:30' default),
   *   sunoUrl: string,
   *   bpm: string,
   *   key: string,
   *   tags: string[],
   *   momento: string (narrativo),
   *   notas: string,
   *   estructura: Array<{seccion, inicio, fin, descripcion}>,
   *   cuePoints: Array<{tiempo, tipo, etiqueta, color}>
   * }
   */
  async createPrompt(promptData) {
    // Por ahora: guarda todo junto en localStorage
    // Futuro DB: dividir en múltiples INSERTs
    return await this.create(promptData);
  }

  /**
   * Actualizar un prompt (wrapper semántico de update)
   * @param {string|number} id
   * @param {Object} promptData
   * @returns {Promise<Object>}
   */
  async updatePrompt(id, promptData) {
    // Por ahora: actualiza todo junto
    // Futuro DB: UPDATEs en múltiples tablas con transaction
    return await this.update(id, promptData);
  }

  /**
   * Obtener prompt con todos sus detalles (simula JOIN de DB)
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   * 
   * FUTURO DB: JOIN entre:
   * - Prompt
   * - Lyrics
   * - StyleDescription + Descriptors
   * - ExcludedStyles
   * - AdvancedOptions
   * - ResultadoTrack + EstructuraTemporal + CuePoint
   * - PromptTag + TagTematico
   */
  async getPromptWithFullDetails(id) {
    // Por ahora: simple getById (todo está junto)
    // Futuro DB: query complejo con múltiples JOINs
    return await this.getById(id);
  }

  /**
   * Buscar prompts por tags
   * @param {string[]} tags - Array de tags a buscar
   * @returns {Promise<Array>}
   * 
   * FUTURO DB: JOIN con PromptTag y TagTematico
   */
  async searchByTags(tags) {
    const allPrompts = await this.getAll();
    
    return allPrompts.filter(prompt => {
      if (!prompt.tags || !Array.isArray(prompt.tags)) return false;
      
      // Buscar si tiene al menos uno de los tags
      return tags.some(tag => 
        prompt.tags.some(promptTag => 
          promptTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });
  }

  /**
   * Buscar por género (en tags o styleDescription)
   * @param {string} genre
   * @returns {Promise<Array>}
   * 
   * FUTURO DB: 
   * - JOIN con StyleDescription.GeneroPrincipal
   * - O JOIN con TrackTagGenero para tags de género
   */
  async getByGenre(genre) {
    const allPrompts = await this.getAll();
    const genreLower = genre.toLowerCase();
    
    return allPrompts.filter(prompt => {
      // Buscar en tags
      const inTags = prompt.tags?.some(tag => 
        tag.toLowerCase().includes(genreLower)
      );
      
      // Buscar en styleDescription
      const inStyle = prompt.styleDescription?.toLowerCase().includes(genreLower);
      
      return inTags || inStyle;
    });
  }

  /**
   * Buscar por rating mínimo
   * @param {number} minRating - Calificación mínima (1-10)
   * @returns {Promise<Array>}
   * 
   * FUTURO DB: WHERE Prompt.Calificacion >= minRating
   */
  async getByMinRating(minRating) {
    const allPrompts = await this.getAll();
    
    return allPrompts.filter(prompt => 
      prompt.calificacion && prompt.calificacion >= minRating
    );
  }

  /**
   * Buscar por descriptores en styleDescription
   * @param {string[]} descriptors - Array de descriptores
   * @returns {Promise<Array>}
   * 
   * FUTURO DB: JOIN con Descriptor table
   */
  async searchByDescriptors(descriptors) {
    const allPrompts = await this.getAll();
    
    return allPrompts.filter(prompt => {
      if (!prompt.styleDescription) return false;
      
      const styleLower = prompt.styleDescription.toLowerCase();
      
      // Buscar si tiene al menos uno de los descriptores
      return descriptors.some(descriptor => 
        styleLower.includes(descriptor.toLowerCase())
      );
    });
  }

  /**
   * Obtener prompts recientes (últimos N)
   * @param {number} limit - Número de prompts a obtener
   * @returns {Promise<Array>}
   * 
   * FUTURO DB: 
   * SELECT TOP @limit * FROM Prompt 
   * ORDER BY FechaCreacion DESC
   */
  async getRecent(limit = 10) {
    const allPrompts = await this.getAll();
    
    // Ordenar por fecha de creación (más recientes primero)
    const sorted = allPrompts.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
    
    return sorted.slice(0, limit);
  }

  /**
   * Obtener estadísticas de uso
   * @returns {Promise<Object>}
   * 
   * FUTURO DB: Queries agregadas con COUNT, AVG, etc.
   */
  async getStatistics() {
    const allPrompts = await this.getAll();
    
    // Calcular estadísticas básicas
    const totalPrompts = allPrompts.length;
    const totalWithRating = allPrompts.filter(p => p.calificacion).length;
    const avgRating = totalWithRating > 0
      ? allPrompts.reduce((sum, p) => sum + (p.calificacion || 0), 0) / totalWithRating
      : 0;
    
    // Contar géneros más usados
    const genreCounts = {};
    allPrompts.forEach(prompt => {
      if (prompt.tags) {
        prompt.tags.forEach(tag => {
          genreCounts[tag] = (genreCounts[tag] || 0) + 1;
        });
      }
    });
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
    
    return {
      totalPrompts,
      totalWithRating,
      averageRating: avgRating.toFixed(2),
      topGenres
    };
  }

  /**
   * Duplicar un prompt (para iteraciones)
   * @param {string|number} id - ID del prompt a duplicar
   * @returns {Promise<Object>} Nuevo prompt duplicado
   * 
   * FUTURO DB: INSERT en Iteracion table + copiar todo
   */
  async duplicatePrompt(id) {
    const original = await this.getById(id);
    
    if (!original) {
      throw new Error(`Prompt with id ${id} not found`);
    }
    
    // Crear copia sin ID (se generará uno nuevo)
    const { id: _, createdAt, updatedAt, ...promptData } = original;
    
    // Agregar indicador de que es una iteración
    const duplicated = {
      ...promptData,
      songTitle: `${promptData.songTitle} (Copy)`,
      notas: `Duplicado de: ${original.songTitle}\n\n${promptData.notas || ''}`
    };
    
    return await this.create(duplicated);
  }

  // ==================== VALIDACIONES SUNO ====================

  /**
   * Validar datos de prompt según límites de Suno
   * @param {Object} promptData
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validatePromptData(promptData) {
    const errors = [];
    
    // Validar lyrics (max 5000 chars)
    if (promptData.lyrics && promptData.lyrics.length > 5000) {
      errors.push(`Lyrics excede 5000 caracteres (actual: ${promptData.lyrics.length})`);
    }
    
    // Validar styleDescription (max 1000 chars)
    if (promptData.styleDescription && promptData.styleDescription.length > 1000) {
      errors.push(`Style Description excede 1000 caracteres (actual: ${promptData.styleDescription.length})`);
    }
    
    // Validar excludedStyle (max 1000 chars)
    if (promptData.excludedStyle && promptData.excludedStyle.length > 1000) {
      errors.push(`Excluded Style excede 1000 caracteres (actual: ${promptData.excludedStyle.length})`);
    }
    
    // Validar weirdness (0-100)
    if (promptData.weirdness !== undefined) {
      const weirdness = Number(promptData.weirdness);
      if (isNaN(weirdness) || weirdness < 0 || weirdness > 100) {
        errors.push('Weirdness debe estar entre 0 y 100');
      }
    }
    
    // Validar styleInfluence (0-100)
    if (promptData.styleInfluence !== undefined) {
      const influence = Number(promptData.styleInfluence);
      if (isNaN(influence) || influence < 0 || influence > 100) {
        errors.push('Style Influence debe estar entre 0 y 100');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Exportar singleton
export const soundtrackRepository = new SoundtrackRepository();

export default soundtrackRepository;