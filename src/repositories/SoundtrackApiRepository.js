// src/repositories/SoundtrackApiRepository.js

import apiClient from "../shared/api/apiClient";
import { BaseRepository } from "./BaseRepository";

/**
 * SoundtrackApiRepository - Implementación de BaseRepository usando API .NET
 *
 * CARACTERÍSTICAS:
 * - Se conecta a tu API .NET (PromptController)
 * - Mapeo automático PascalCase ↔ camelCase
 * - Maneja la estructura completa de Suno (8+ tablas)
 * - Compatible con RepositoryFactory
 * - Todos los métodos retornan Promises
 *
 * ENDPOINTS:
 * GET    /api/Prompt          → getAll()
 * GET    /api/Prompt/{id}     → getById()
 * POST   /api/Prompt          → create()
 * PUT    /api/Prompt/{id}     → update()
 * DELETE /api/Prompt/{id}     → delete()
 * GET    /api/Prompt/search/tags?tags=x → searchByTags()
 * GET    /api/Prompt/search/genre?genre=x → getByGenre()
 * GET    /api/Prompt/top-rated → getByMinRating()
 * GET    /api/Prompt/recent    → getRecent()
 * GET    /api/Prompt/statistics → getStatistics()
 */

export class SoundtrackApiRepository extends BaseRepository {
  constructor() {
    super();
    this.baseEndpoint = "/Prompt";
  }

  // ==================== MAPEO DE DATOS ====================

  /**
   * Mapear datos del Frontend (camelCase) al Backend (PascalCase)
   * @private
   * @param {Object} frontData - Datos en formato frontend
   * @returns {Object} Datos en formato API (.NET)
   *
   * Frontend → Backend:
   * songTitle → NombreTrack
   * lyrics → Lyrics.ContenidoCompleto
   * styleDescription → StyleDescription.ContenidoCompleto
   * etc.
   */
  _mapToApi(frontData) {
    const apiData = {
      // ==================== PROMPT PRINCIPAL ====================
      NombreTrack: frontData.songTitle || "",
      ObjetivoMusical: frontData.momento || null,
      ContextoUso: frontData.version || "v4.5",
      Calificacion: frontData.calificacion || null,
      NotasGenerales: frontData.notas || null,

      // ==================== LYRICS ====================
      Lyrics: frontData.lyrics
        ? {
            ContenidoCompleto: frontData.lyrics,
            // CharCount se calcula en el backend
            PorcentajeVrps: null,
            PorcentajeNarrativa: null,
            PorcentajeAtmosferico: null,
            Secciones: null, // Por ahora no mapeamos estructura de lyrics
          }
        : null,

      // ==================== STYLE DESCRIPTION ====================
      StyleDescription: frontData.styleDescription
        ? {
            ContenidoCompleto: frontData.styleDescription,
            // CharCount se calcula en el backend
            GeneroPrincipal: this._extractMainGenre(frontData.tags),
            Subgeneros: this._extractSubgenres(frontData.tags),
            Bpm: frontData.bpm ? parseInt(frontData.bpm) : null,
            PorcentajeFundacionRitmica: null,
            PorcentajeAtmosfera: null,
            PorcentajeTecnicos: null,
            PorcentajeUnicos: null,
            Descriptores: this._extractDescriptors(frontData.styleDescription),
          }
        : null,

      // ==================== EXCLUDED STYLE ====================
      ExcludedStyle: frontData.excludedStyle
        ? {
            ContenidoCompleto: frontData.excludedStyle,
            // CharCount se calcula en el backend
            DescriptoresExcluidos: frontData.excludedStyle,
          }
        : null,

      // ==================== ADVANCED OPTIONS ====================
      AdvancedOptions: {
        VocalGender: null, // No lo usamos por ahora
        WeirdnessPercentage: frontData.weirdness || 50,
        StyleInfluencePercentage: frontData.styleInfluence || 50,
      },

      // ==================== TAGS (M:N) ====================
      Tags: frontData.tags || [],

      // ==================== RESULTADO TRACKS ====================
      ResultadoTracks: frontData.sunoUrl
        ? [
            {
              NumeroTrack: 1,
              SunoUrl: frontData.sunoUrl,
              SunoVersion: frontData.version || "v4.5",
              DuracionReal: frontData.duracion || null,
              BpmReal: frontData.bpm ? parseInt(frontData.bpm) : null,
              KeyMusical: frontData.key || null,
              CalificacionIndividual: frontData.calificacion || null,
              MomentoNarrativo: frontData.momento || null,
              NotasTrack: frontData.notas || null,

              // ESTRUCTURA TEMPORAL
              Estructura: this._mapEstructuraToApi(frontData.estructura),

              // CUE POINTS
              CuePoints: this._mapCuePointsToApi(frontData.cuePoints),

              // TAGS DE GÉNERO
              TagsGenero: frontData.tags || [],
            },
          ]
        : [],
    };

    return apiData;
  }

  /**
   * Mapear datos del Backend (PascalCase) al Frontend (camelCase)
   * @private
   * @param {Object} apiData - Datos en formato API (.NET)
   * @returns {Object} Datos en formato frontend
   *
   * Backend → Frontend:
   * IdPrompt → id
   * NombreTrack → songTitle
   * Lyrics.ContenidoCompleto → lyrics
   * etc.
   */
  _mapFromApi(apiData) {
    // Extraer primer Lyrics si existe
    const firstLyrics =
      Array.isArray(apiData.lyrics) && apiData.lyrics.length > 0
        ? apiData.lyrics[0]
        : apiData.lyrics;

    // Extraer primer StyleDescription si existe
    const firstStyle =
      Array.isArray(apiData.styleDescriptions) &&
      apiData.styleDescriptions.length > 0
        ? apiData.styleDescriptions[0]
        : apiData.styleDescriptions;

    // Extraer primer ExcludedStyle si existe
    const firstExcluded =
      Array.isArray(apiData.excludedStyles) && apiData.excludedStyles.length > 0
        ? apiData.excludedStyles[0]
        : apiData.excludedStyles;

    // Extraer AdvancedOptions
    const firstAdvanced =
      Array.isArray(apiData.advancedOptions) &&
      apiData.advancedOptions.length > 0
        ? apiData.advancedOptions[0]
        : apiData.advancedOptions;

    // Extraer primer ResultadoTrack si existe
    const firstTrack =
      Array.isArray(apiData.resultadoTracks) &&
      apiData.resultadoTracks.length > 0
        ? apiData.resultadoTracks[0]
        : null;

    const frontData = {
      // ==================== BÁSICOS ====================
      id: apiData.idPrompt?.toString() || apiData.id?.toString(),
      songTitle: apiData.nombreTrack || "",

      // ==================== TIMESTAMPS ====================
      createdAt: apiData.fechaCreacion || new Date().toISOString(),
      updatedAt: apiData.fechaCreacion || new Date().toISOString(), // Backend no tiene updatedAt

      // ==================== LYRICS ====================
      lyrics: firstLyrics?.contenidoCompleto || "",

      // ==================== STYLE ====================
      styleDescription: firstStyle?.contenidoCompleto || "",

      // ==================== EXCLUDED ====================
      excludedStyle: firstExcluded?.contenidoCompleto || "",

      // ==================== ADVANCED OPTIONS ====================
      weirdness: firstAdvanced?.weirdnessPercentage || 50,
      styleInfluence: firstAdvanced?.styleInfluencePercentage || 50,

      // ==================== METADATA ====================
      version: apiData.contextoUso || firstTrack?.sunoVersion || "v4.5",
      duracion: firstTrack?.duracionReal || "3:30",
      sunoUrl: firstTrack?.sunoUrl || "",
      bpm: firstStyle?.bpm?.toString() || firstTrack?.bpmReal?.toString() || "",
      key: firstTrack?.keyMusical || "",

      // ==================== TAGS ====================
      tags: this._extractTags(apiData),

      // ==================== NOTAS Y MOMENTO ====================
      momento: apiData.objetivoMusical || firstTrack?.momentoNarrativo || "",
      notas: apiData.notasGenerales || firstTrack?.notasTrack || "",

      // ==================== CALIFICACIÓN ====================
      calificacion:
        apiData.calificacion || firstTrack?.calificacionIndividual || null,

      // ==================== ESTRUCTURA ====================
      estructura: this._mapEstructuraFromApi(firstTrack?.estructuraTemporals),

      // ==================== CUE POINTS ====================
      cuePoints: this._mapCuePointsFromApi(firstTrack?.cuePoints),
    };

    return frontData;
  }

  // ==================== MAPPERS AUXILIARES ====================

  /**
   * Extraer género principal del primer tag
   * @private
   */
  _extractMainGenre(tags) {
    if (!tags || tags.length === 0) return null;
    return tags[0];
  }

  /**
   * Extraer subgéneros (tags restantes)
   * @private
   */
  _extractSubgenres(tags) {
    if (!tags || tags.length <= 1) return null;
    return tags.slice(1).join(", ");
  }

  /**
   * Extraer descriptores del styleDescription (palabras clave)
   * @private
   */
  _extractDescriptors(styleDescription) {
    if (!styleDescription) return null;

    // Extraer palabras relevantes (más de 4 caracteres)
    const words = styleDescription
      .split(/[\s,\.]+/)
      .filter((word) => word.length > 4)
      .slice(0, 20); // Máximo 20 descriptores

    return words.length > 0 ? words : null;
  }

  /**
   * Extraer todos los tags (PromptTag + ResultadoTrack tags)
   * @private
   */
  _extractTags(apiData) {
    const tags = new Set();

    // Tags de Prompt (tabla PromptTag)
    if (apiData.idTags && Array.isArray(apiData.idTags)) {
      apiData.idTags.forEach((tag) => {
        if (tag.nombreTag) tags.add(tag.nombreTag);
      });
    }

    // Tags de ResultadoTrack (tabla TrackTagGenero)
    if (apiData.resultadoTracks && Array.isArray(apiData.resultadoTracks)) {
      apiData.resultadoTracks.forEach((track) => {
        if (track.idTagGeneros && Array.isArray(track.idTagGeneros)) {
          track.idTagGeneros.forEach((tag) => {
            if (tag.nombre) tags.add(tag.nombre);
          });
        }
      });
    }

    return Array.from(tags);
  }

  /**
   * Mapear estructura al formato API
   * @private
   */
  _mapEstructuraToApi(estructura) {
    if (!estructura || !Array.isArray(estructura)) return [];

    return estructura.map((sec, index) => ({
      Orden: index + 1,
      Seccion: sec.seccion || "Intro",
      TiempoInicio: sec.inicio || "0:00",
      TiempoFin: sec.fin || "0:16",
      Descripcion: sec.descripcion || null,
    }));
  }

  /**
   * Mapear estructura del formato API
   * @private
   */
  _mapEstructuraFromApi(estructuraTemporals) {
    if (!estructuraTemporals || !Array.isArray(estructuraTemporals)) return [];

    return estructuraTemporals.map((et) => ({
      seccion: et.seccion,
      inicio: et.tiempoInicio,
      fin: et.tiempoFin,
      descripcion: et.descripcion,
    }));
  }

  /**
   * Mapear cue points al formato API
   * @private
   */
  _mapCuePointsToApi(cuePoints) {
    if (!cuePoints || !Array.isArray(cuePoints)) return [];

    return cuePoints.map((cp) => ({
      Tiempo: cp.tiempo,
      Tipo: cp.tipo || "intro",
      Etiqueta: cp.etiqueta || null,
      Color: cp.color || "#00d4ff",
    }));
  }

  /**
   * Mapear cue points del formato API
   * @private
   */
  _mapCuePointsFromApi(cuePoints) {
    if (!cuePoints || !Array.isArray(cuePoints)) return [];

    return cuePoints.map((cp) => ({
      tiempo: cp.tiempo,
      tipo: cp.tipo,
      etiqueta: cp.etiqueta,
      color: cp.color,
    }));
  }

  // ==================== MÉTODOS CRUD ====================

  /**
   * Obtener todos los prompts
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      const response = await apiClient.get(this.baseEndpoint);

      // Mapear cada prompt del formato API al formato frontend
      return response.data.map((prompt) => this._mapFromApi(prompt));
    } catch (error) {
      console.error("Error en getAll:", error);
      throw new Error(`Error al obtener prompts: ${error.message}`);
    }
  }

  /**
   * Obtener un prompt por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/${id}`);

      if (!response.data) return null;

      return this._mapFromApi(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error en getById(${id}):`, error);
      throw new Error(`Error al obtener prompt ${id}: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo prompt
   * @param {Object} data - Datos del prompt (formato frontend)
   * @returns {Promise<Object>} Prompt creado
   */
  async create(data) {
    try {
      const apiData = this._mapToApi(data);

      const response = await apiClient.post(this.baseEndpoint, apiData);

      return this._mapFromApi(response.data);
    } catch (error) {
      console.error("Error en create:", error);
      throw new Error(
        `Error al crear prompt: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Actualizar un prompt existente
   * @param {string|number} id
   * @param {Object} data - Datos actualizados (formato frontend)
   * @returns {Promise<Object>} Prompt actualizado
   */
  async update(id, data) {
    try {
      const apiData = this._mapToApi(data);

      const response = await apiClient.put(
        `${this.baseEndpoint}/${id}`,
        apiData
      );

      // PUT normalmente devuelve 204 No Content
      // Así que hacemos un GET para obtener el dato actualizado
      if (response.status === 204) {
        return await this.getById(id);
      }

      return this._mapFromApi(response.data);
    } catch (error) {
      console.error(`Error en update(${id}):`, error);
      throw new Error(
        `Error al actualizar prompt ${id}: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  /**
   * Eliminar un prompt
   * @param {string|number} id
   * @returns {Promise<boolean>} true si se eliminó
   */
  async delete(id) {
    try {
      await apiClient.delete(`${this.baseEndpoint}/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error(`Error en delete(${id}):`, error);
      throw new Error(`Error al eliminar prompt ${id}: ${error.message}`);
    }
  }

  // ==================== MÉTODOS ESPECÍFICOS DE SOUNDTRACK ====================

  /**
   * Crear un prompt completo (wrapper semántico)
   * @param {Object} promptData
   * @returns {Promise<Object>}
   */
  async createPrompt(promptData) {
    return await this.create(promptData);
  }

  /**
   * Actualizar un prompt (wrapper semántico)
   * @param {string|number} id
   * @param {Object} promptData
   * @returns {Promise<Object>}
   */
  async updatePrompt(id, promptData) {
    return await this.update(id, promptData);
  }

  /**
   * Obtener prompt con detalles completos
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getPromptWithFullDetails(id) {
    // El endpoint GET /api/Prompt/{id} ya incluye todos los detalles
    return await this.getById(id);
  }

  /**
   * Buscar prompts por tags
   * @param {string[]} tags
   * @returns {Promise<Array>}
   */
  async searchByTags(tags) {
    try {
      const tagsParam = tags.join(",");
      const response = await apiClient.get(`${this.baseEndpoint}/search/tags`, {
        params: { tags: tagsParam },
      });

      return response.data.map((prompt) => this._mapFromApi(prompt));
    } catch (error) {
      console.error("Error en searchByTags:", error);
      throw new Error(`Error al buscar por tags: ${error.message}`);
    }
  }

  /**
   * Buscar por género
   * @param {string} genre
   * @returns {Promise<Array>}
   */
  async getByGenre(genre) {
    try {
      const response = await apiClient.get(
        `${this.baseEndpoint}/search/genre`,
        {
          params: { genre },
        }
      );

      return response.data.map((prompt) => this._mapFromApi(prompt));
    } catch (error) {
      console.error("Error en getByGenre:", error);
      throw new Error(`Error al buscar por género: ${error.message}`);
    }
  }

  /**
   * Buscar por rating mínimo
   * @param {number} minRating
   * @returns {Promise<Array>}
   */
  async getByMinRating(minRating) {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/top-rated`, {
        params: { minRating },
      });

      return response.data.map((prompt) => this._mapFromApi(prompt));
    } catch (error) {
      console.error("Error en getByMinRating:", error);
      throw new Error(`Error al buscar por rating: ${error.message}`);
    }
  }

  /**
   * Buscar por descriptores
   * @param {string[]} descriptors
   * @returns {Promise<Array>}
   */
  async searchByDescriptors(descriptors) {
    // Por ahora, búsqueda local (el backend no tiene este endpoint)
    const allPrompts = await this.getAll();

    return allPrompts.filter((prompt) => {
      if (!prompt.styleDescription) return false;

      const styleLower = prompt.styleDescription.toLowerCase();
      return descriptors.some((desc) =>
        styleLower.includes(desc.toLowerCase())
      );
    });
  }

  /**
   * Obtener prompts recientes
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecent(limit = 10) {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/recent`, {
        params: { limit },
      });

      return response.data.map((prompt) => this._mapFromApi(prompt));
    } catch (error) {
      console.error("Error en getRecent:", error);
      throw new Error(`Error al obtener prompts recientes: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const response = await apiClient.get(`${this.baseEndpoint}/statistics`);

      // Las estadísticas ya vienen en el formato correcto
      return response.data;
    } catch (error) {
      console.error("Error en getStatistics:", error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Duplicar un prompt
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async duplicatePrompt(id) {
    try {
      // Obtener el prompt original
      const original = await this.getById(id);

      if (!original) {
        throw new Error(`Prompt with id ${id} not found`);
      }

      // Crear copia sin ID
      const { id: _, createdAt, updatedAt, ...promptData } = original;

      // Modificar título
      const duplicated = {
        ...promptData,
        songTitle: `${promptData.songTitle} (Copy)`,
        notas: `Duplicado de: ${original.songTitle}\n\n${
          promptData.notas || ""
        }`,
      };

      // Crear nuevo prompt
      return await this.create(duplicated);
    } catch (error) {
      console.error(`Error en duplicatePrompt(${id}):`, error);
      throw new Error(`Error al duplicar prompt: ${error.message}`);
    }
  }

  /**
   * Validar datos de prompt
   * @param {Object} promptData
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validatePromptData(promptData) {
    const errors = [];

    // Validaciones básicas
    if (promptData.lyrics && promptData.lyrics.length > 5000) {
      errors.push(
        `Lyrics excede 5000 caracteres (actual: ${promptData.lyrics.length})`
      );
    }

    if (
      promptData.styleDescription &&
      promptData.styleDescription.length > 1000
    ) {
      errors.push(
        `Style Description excede 1000 caracteres (actual: ${promptData.styleDescription.length})`
      );
    }

    if (promptData.excludedStyle && promptData.excludedStyle.length > 1000) {
      errors.push(
        `Excluded Style excede 1000 caracteres (actual: ${promptData.excludedStyle.length})`
      );
    }

    if (promptData.weirdness !== undefined) {
      const weirdness = Number(promptData.weirdness);
      if (isNaN(weirdness) || weirdness < 0 || weirdness > 100) {
        errors.push("Weirdness debe estar entre 0 y 100");
      }
    }

    if (promptData.styleInfluence !== undefined) {
      const influence = Number(promptData.styleInfluence);
      if (isNaN(influence) || influence < 0 || influence > 100) {
        errors.push("Style Influence debe estar entre 0 y 100");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==================== MÉTODOS NO IMPLEMENTADOS (FUTUROS) ====================

  /**
   * Exportar todos los datos
   * @returns {Promise<Object>}
   */
  async exportData() {
    const prompts = await this.getAll();

    return {
      version: "1.0",
      exportDate: new Date().toISOString(),
      source: "API",
      count: prompts.length,
      data: prompts,
    };
  }

  /**
   * Importar datos (NO soportado - usar creates individuales)
   * @param {Object|Array} data
   * @returns {Promise<Array<Object>>}
   */
  async importData(data) {
    throw new Error(
      "importData not supported in API mode - use individual creates"
    );
  }

  /**
   * Limpiar todos los datos (NO soportado por seguridad)
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error("clear not supported in API mode for safety");
  }

  /**
   * Contar registros
   * @returns {Promise<number>}
   */
  async count() {
    const prompts = await this.getAll();
    return prompts.length;
  }
}

// Exportar clase
export default SoundtrackApiRepository;
