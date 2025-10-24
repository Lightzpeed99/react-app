// src/services/SoundtrackService.js
import { soundtrackRepository } from "../repositories/SoundtrackRepository";
import RepositoryFactory from "../repositories/RepositoryFactory";

/**
 * SoundtrackService - Capa de servicio para lógica de negocio de Soundtrack
 *
 * RESPONSABILIDADES:
 * - Validaciones de datos
 * - Transformaciones de datos
 * - Lógica de negocio
 * - Intermediario entre hooks y repositorio
 *
 * MÉTODOS:
 * - CRUD Prompts (existente)
 * - ⭐ CRUD ResultadoTrack + EstructuraTemporal + CuePoints
 * - ⭐ CRUD SeccionEstructura + VRPs
 * - ⭐ CRUD Descriptors
 * - Validaciones
 */

class SoundtrackService {
  constructor() {
    //this.repository = RepositoryFactory.get("soundtrack");
    this.repository = RepositoryFactory.createSoundtrackRepository();
  }

  // ==================== PROMPT CRUD (EXISTENTE) ====================

  async getAllPrompts() {
    try {
      return await this.repository.getAll();
    } catch (error) {
      throw new Error(`Error al obtener prompts: ${error.message}`);
    }
  }

  async getPromptById(id) {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      throw new Error(`Error al obtener prompt ${id}: ${error.message}`);
    }
  }

  async createPrompt(promptData) {
    // Validar antes de crear
    const validation = this.validatePrompt(promptData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.create(promptData);
    } catch (error) {
      throw new Error(`Error al crear prompt: ${error.message}`);
    }
  }

  async updatePrompt(id, promptData) {
    // Validar antes de actualizar
    const validation = this.validatePrompt(promptData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.update(id, promptData);
    } catch (error) {
      throw new Error(`Error al actualizar prompt ${id}: ${error.message}`);
    }
  }

  async deletePrompt(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar prompt ${id}: ${error.message}`);
    }
  }

  async duplicatePrompt(id) {
    try {
      const original = await this.repository.getById(id);

      const duplicated = {
        ...original,
        songTitle: `${original.songTitle} (copia)`,
        createdAt: new Date().toISOString(),
      };

      delete duplicated.id;
      delete duplicated.updatedAt;

      return await this.repository.create(duplicated);
    } catch (error) {
      throw new Error(`Error al duplicar prompt ${id}: ${error.message}`);
    }
  }

  async ratePrompt(id, rating) {
    if (rating < 1 || rating > 10) {
      throw new Error("La calificación debe estar entre 1 y 10");
    }

    try {
      // 1. Obtener prompt completo
      const prompt = await this.getPromptById(id);

      // 2. Actualizar solo rating
      prompt.calificacion = rating;

      // 3. Enviar todo de vuelta
      return await this.repository.update(id, prompt);
    } catch (error) {
      throw new Error(`Error al calificar prompt ${id}: ${error.message}`);
    }
  }

  // ==================== ⭐ RESULTADO TRACK CRUD ====================

  async createResultadoTrack(trackData) {
    const validation = this.validateResultadoTrackData(trackData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.createResultadoTrack(trackData);
    } catch (error) {
      throw new Error(`Error al crear track: ${error.message}`);
    }
  }

  async updateResultadoTrack(trackId, trackData) {
    const validation = this.validateResultadoTrackData(trackData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateResultadoTrack(trackId, trackData);
    } catch (error) {
      throw new Error(`Error al actualizar track: ${error.message}`);
    }
  }

  async getResultadoTrackById(trackId) {
    try {
      return await this.repository.getResultadoTrackById(trackId);
    } catch (error) {
      throw new Error(`Error al obtener track: ${error.message}`);
    }
  }

  async getResultadoTracksByPromptId(promptId) {
    try {
      return await this.repository.getResultadoTracksByPromptId(promptId);
    } catch (error) {
      throw new Error(`Error al obtener tracks: ${error.message}`);
    }
  }

  async deleteResultadoTrack(trackId) {
    try {
      return await this.repository.deleteResultadoTrack(trackId);
    } catch (error) {
      throw new Error(`Error al eliminar track: ${error.message}`);
    }
  }

  // ==================== ⭐ ESTRUCTURA TEMPORAL CRUD ====================

  async createEstructuraTemporal(trackId, estructuraData) {
    const validation = this.validateEstructuraTemporalData(estructuraData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.createEstructuraTemporal(
        trackId,
        estructuraData
      );
    } catch (error) {
      throw new Error(`Error al crear estructura: ${error.message}`);
    }
  }

  async updateEstructuraTemporal(estructuraId, estructuraData) {
    const validation = this.validateEstructuraTemporalData(
      estructuraData,
      true
    );
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateEstructuraTemporal(
        estructuraId,
        estructuraData
      );
    } catch (error) {
      throw new Error(`Error al actualizar estructura: ${error.message}`);
    }
  }

  async deleteEstructuraTemporal(estructuraId) {
    try {
      return await this.repository.deleteEstructuraTemporal(estructuraId);
    } catch (error) {
      throw new Error(`Error al eliminar estructura: ${error.message}`);
    }
  }

  // ==================== ⭐ CUE POINT CRUD ====================

  async createCuePoint(trackId, cueData) {
    const validation = this.validateCuePointData(cueData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.createCuePoint(trackId, cueData);
    } catch (error) {
      throw new Error(`Error al crear cue point: ${error.message}`);
    }
  }

  async updateCuePoint(cueId, cueData) {
    const validation = this.validateCuePointData(cueData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateCuePoint(cueId, cueData);
    } catch (error) {
      throw new Error(`Error al actualizar cue point: ${error.message}`);
    }
  }

  async deleteCuePoint(cueId) {
    try {
      return await this.repository.deleteCuePoint(cueId);
    } catch (error) {
      throw new Error(`Error al eliminar cue point: ${error.message}`);
    }
  }

  // ==================== ⭐ TAG GENERO (M:N) ====================

  async addTagGeneroToTrack(trackId, tagName) {
    if (!tagName || tagName.trim() === "") {
      throw new Error("Nombre de tag es requerido");
    }

    try {
      return await this.repository.addTagGeneroToTrack(trackId, tagName);
    } catch (error) {
      throw new Error(`Error al agregar tag: ${error.message}`);
    }
  }

  async removeTagGeneroFromTrack(trackId, tagGeneroId) {
    try {
      return await this.repository.removeTagGeneroFromTrack(
        trackId,
        tagGeneroId
      );
    } catch (error) {
      throw new Error(`Error al eliminar tag: ${error.message}`);
    }
  }

  // ==================== ⭐ SECCION ESTRUCTURA CRUD ====================

  async createSeccionEstructura(lyricsId, seccionData) {
    const validation = this.validateSeccionEstructuraData(seccionData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.createSeccionEstructura(
        lyricsId,
        seccionData
      );
    } catch (error) {
      throw new Error(`Error al crear sección: ${error.message}`);
    }
  }

  async updateSeccionEstructura(seccionId, seccionData) {
    const validation = this.validateSeccionEstructuraData(seccionData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateSeccionEstructura(
        seccionId,
        seccionData
      );
    } catch (error) {
      throw new Error(`Error al actualizar sección: ${error.message}`);
    }
  }

  async deleteSeccionEstructura(seccionId) {
    try {
      return await this.repository.deleteSeccionEstructura(seccionId);
    } catch (error) {
      throw new Error(`Error al eliminar sección: ${error.message}`);
    }
  }

  // ==================== ⭐ VRP CRUD ====================

  async createVrp(seccionId, vrpData) {
    const validation = this.validateVrpData(vrpData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.createVrp(seccionId, vrpData);
    } catch (error) {
      throw new Error(`Error al crear VRP: ${error.message}`);
    }
  }

  async updateVrp(vrpId, vrpData) {
    const validation = this.validateVrpData(vrpData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateVrp(vrpId, vrpData);
    } catch (error) {
      throw new Error(`Error al actualizar VRP: ${error.message}`);
    }
  }

  async deleteVrp(vrpId) {
    try {
      return await this.repository.deleteVrp(vrpId);
    } catch (error) {
      throw new Error(`Error al eliminar VRP: ${error.message}`);
    }
  }

  // ==================== ⭐ DESCRIPTOR CRUD ====================

  async findDescriptor(styleId, descriptor1, categoria) {
    try {
      return await this.repository.findDescriptor(
        styleId,
        descriptor1,
        categoria
      );
    } catch (error) {
      throw new Error(`Error al buscar descriptor: ${error.message}`);
    }
  }

  async createOrUpdateDescriptor(styleId, descriptorData) {
    const validation = this.validateDescriptorData(descriptorData);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      // El backend maneja la lógica de duplicados
      return await this.repository.createOrUpdateDescriptor(
        styleId,
        descriptorData
      );
    } catch (error) {
      throw new Error(`Error al crear/actualizar descriptor: ${error.message}`);
    }
  }

  async updateDescriptor(descriptorId, descriptorData) {
    const validation = this.validateDescriptorData(descriptorData, true);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(", ")}`);
    }

    try {
      return await this.repository.updateDescriptor(
        descriptorId,
        descriptorData
      );
    } catch (error) {
      throw new Error(`Error al actualizar descriptor: ${error.message}`);
    }
  }

  async deleteDescriptor(descriptorId) {
    try {
      return await this.repository.deleteDescriptor(descriptorId);
    } catch (error) {
      throw new Error(`Error al eliminar descriptor: ${error.message}`);
    }
  }

  // ==================== VALIDACIONES ====================

  validatePrompt(promptData, isUpdate = false) {
    const errors = [];

    // SongTitle es obligatorio
    if (
      !isUpdate &&
      (!promptData.songTitle || promptData.songTitle.trim() === "")
    ) {
      errors.push("El título es obligatorio");
    }

    if (promptData.songTitle && promptData.songTitle.length > 255) {
      errors.push("El título no puede exceder 255 caracteres");
    }

    // Validar límites de caracteres
    if (promptData.lyrics && promptData.lyrics.length > 5000) {
      errors.push("Lyrics excede el límite de 5000 caracteres");
    }

    if (
      promptData.styleDescription &&
      promptData.styleDescription.length > 1000
    ) {
      errors.push("Style Description excede el límite de 1000 caracteres");
    }

    if (promptData.excludedStyle && promptData.excludedStyle.length > 1000) {
      errors.push("Excluded Style excede el límite de 1000 caracteres");
    }

    // Validar weirdness y styleInfluence (0-100)
    if (promptData.weirdness !== undefined && promptData.weirdness !== null) {
      const weirdness = Number(promptData.weirdness);
      if (isNaN(weirdness) || weirdness < 0 || weirdness > 100) {
        errors.push("Weirdness debe estar entre 0 y 100");
      }
    }

    if (
      promptData.styleInfluence !== undefined &&
      promptData.styleInfluence !== null
    ) {
      const influence = Number(promptData.styleInfluence);
      if (isNaN(influence) || influence < 0 || influence > 100) {
        errors.push("Style Influence debe estar entre 0 y 100");
      }
    }

    // Validar calificación (1-10)
    if (
      promptData.calificacion !== undefined &&
      promptData.calificacion !== null
    ) {
      const rating = Number(promptData.calificacion);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        errors.push("Calificación debe estar entre 1 y 10");
      }
    }

    // Validar vocalGender
    if (promptData.vocalGender) {
      const validGenders = ["male", "female", "neutral"];
      if (!validGenders.includes(promptData.vocalGender.toLowerCase())) {
        errors.push("Vocal Gender debe ser male, female o neutral");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateResultadoTrackData(trackData, isUpdate = false) {
    const errors = [];

    // SunoUrl es obligatorio
    if (!isUpdate && !trackData.sunoUrl) {
      errors.push("Suno URL es obligatorio");
    }

    if (trackData.sunoUrl && !this._isValidUrl(trackData.sunoUrl)) {
      errors.push("Suno URL no es válida");
    }

    // DuracionReal es obligatorio
    if (!isUpdate && !trackData.duracionReal) {
      errors.push("Duración Real es obligatoria");
    }

    if (
      trackData.duracionReal &&
      !this._isValidTimeFormat(trackData.duracionReal)
    ) {
      errors.push("Duración Real debe estar en formato mm:ss");
    }

    // BPM Real (opcional, pero debe ser válido si se proporciona)
    if (trackData.bpmReal !== undefined && trackData.bpmReal !== null) {
      const bpm = Number(trackData.bpmReal);
      if (isNaN(bpm) || bpm < 20 || bpm > 300) {
        errors.push("BPM Real debe estar entre 20 y 300");
      }
    }

    // Calificación Individual (1-10)
    if (
      trackData.calificacionIndividual !== undefined &&
      trackData.calificacionIndividual !== null
    ) {
      const rating = Number(trackData.calificacionIndividual);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        errors.push("Calificación Individual debe estar entre 1 y 10");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateEstructuraTemporalData(estructuraData, isUpdate = false) {
    const errors = [];

    // Seccion es obligatoria
    if (!isUpdate && !estructuraData.seccion) {
      errors.push("Sección es obligatoria");
    }

    // TiempoInicio y TiempoFin son obligatorios
    if (!isUpdate && !estructuraData.tiempoInicio) {
      errors.push("Tiempo Inicio es obligatorio");
    }

    if (!isUpdate && !estructuraData.tiempoFin) {
      errors.push("Tiempo Fin es obligatorio");
    }

    if (
      estructuraData.tiempoInicio &&
      !this._isValidTimeFormat(estructuraData.tiempoInicio)
    ) {
      errors.push("Tiempo Inicio debe estar en formato mm:ss");
    }

    if (
      estructuraData.tiempoFin &&
      !this._isValidTimeFormat(estructuraData.tiempoFin)
    ) {
      errors.push("Tiempo Fin debe estar en formato mm:ss");
    }

    // Validar que TiempoFin > TiempoInicio
    if (estructuraData.tiempoInicio && estructuraData.tiempoFin) {
      const inicioSec = this._timeToSeconds(estructuraData.tiempoInicio);
      const finSec = this._timeToSeconds(estructuraData.tiempoFin);

      if (finSec <= inicioSec) {
        errors.push("Tiempo Fin debe ser mayor que Tiempo Inicio");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateCuePointData(cueData, isUpdate = false) {
    const errors = [];

    // Tiempo es obligatorio
    if (!isUpdate && !cueData.tiempo) {
      errors.push("Tiempo es obligatorio");
    }

    if (cueData.tiempo && !this._isValidTimeFormat(cueData.tiempo)) {
      errors.push("Tiempo debe estar en formato mm:ss");
    }

    // Color debe ser hex válido si se proporciona
    if (cueData.color && !this._isValidHexColor(cueData.color)) {
      errors.push("Color debe ser un código hexadecimal válido (#RRGGBB)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateSeccionEstructuraData(seccionData, isUpdate = false) {
    const errors = [];

    // TipoSeccion es obligatorio
    if (!isUpdate && !seccionData.tipoSeccion) {
      errors.push("Tipo de Sección es obligatorio");
    }

    // Validar tipos de sección permitidos
    const validTipos = [
      "Verse",
      "Chorus",
      "Bridge",
      "Intro",
      "Outro",
      "Pre-Chorus",
      "Instrumental",
      "Break",
    ];
    if (
      seccionData.tipoSeccion &&
      !validTipos.includes(seccionData.tipoSeccion)
    ) {
      errors.push(`Tipo de Sección debe ser uno de: ${validTipos.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateVrpData(vrpData, isUpdate = false) {
    const errors = [];

    // ContenidoVrp es obligatorio
    if (
      !isUpdate &&
      (!vrpData.contenidoVrp || vrpData.contenidoVrp.trim() === "")
    ) {
      errors.push("Contenido VRP es obligatorio");
    }

    // Validar Efectividad (1-10) si se proporciona
    if (vrpData.efectividad !== undefined && vrpData.efectividad !== null) {
      const rating = Number(vrpData.efectividad);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        errors.push("Efectividad debe estar entre 1 y 10");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateDescriptorData(descriptorData, isUpdate = false) {
    const errors = [];

    // Descriptor1 es obligatorio
    if (
      !isUpdate &&
      (!descriptorData.descriptor1 || descriptorData.descriptor1.trim() === "")
    ) {
      errors.push("Descriptor es obligatorio");
    }

    if (descriptorData.descriptor1 && descriptorData.descriptor1.length > 255) {
      errors.push("Descriptor no puede exceder 255 caracteres");
    }

    // Categoria es obligatoria
    if (!isUpdate && !descriptorData.categoria) {
      errors.push("Categoría es obligatoria");
    }

    const validCategorias = [
      "Fundación Rítmica",
      "Atmosférico",
      "Técnico",
      "Único",
    ];
    if (
      descriptorData.categoria &&
      !validCategorias.includes(descriptorData.categoria)
    ) {
      errors.push(`Categoría debe ser una de: ${validCategorias.join(", ")}`);
    }

    // Validar EfectividadPromedio (1-10) si se proporciona
    if (
      descriptorData.efectividadPromedio !== undefined &&
      descriptorData.efectividadPromedio !== null
    ) {
      const rating = Number(descriptorData.efectividadPromedio);
      if (isNaN(rating) || rating < 1 || rating > 10) {
        errors.push("Efectividad Promedio debe estar entre 1 y 10");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==================== HELPERS ====================

  _isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  _isValidTimeFormat(time) {
    return /^\d{1,2}:\d{2}$/.test(time);
  }

  _isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }

  _timeToSeconds(time) {
    const [min, sec] = time.split(":").map(Number);
    return min * 60 + sec;
  }

  checkCharacterLimits(promptData) {
    const limits = {};

    if (promptData.lyrics && promptData.lyrics.length > 5000) {
      limits.lyrics = `Excede el límite: ${promptData.lyrics.length}/5000`;
    }

    if (
      promptData.styleDescription &&
      promptData.styleDescription.length > 1000
    ) {
      limits.styleDescription = `Excede el límite: ${promptData.styleDescription.length}/1000`;
    }

    if (promptData.excludedStyle && promptData.excludedStyle.length > 1000) {
      limits.excludedStyle = `Excede el límite: ${promptData.excludedStyle.length}/1000`;
    }

    return limits;
  }

  // ==================== BÚSQUEDAS (EXISTENTES) ====================

  async searchPrompts(query) {
    try {
      const allPrompts = await this.repository.getAll();

      const filtered = allPrompts.filter((prompt) => {
        const searchText =
          `${prompt.songTitle} ${prompt.lyrics} ${prompt.styleDescription}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

      return filtered;
    } catch (error) {
      throw new Error(`Error al buscar prompts: ${error.message}`);
    }
  }

  async filterByTag(tag) {
    try {
      const allPrompts = await this.repository.getAll();

      return allPrompts.filter(
        (prompt) =>
          prompt.tags &&
          prompt.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Error al filtrar por tag: ${error.message}`);
    }
  }

  async filterByRating(minRating) {
    try {
      const allPrompts = await this.repository.getAll();

      return allPrompts.filter(
        (prompt) => prompt.calificacion && prompt.calificacion >= minRating
      );
    } catch (error) {
      throw new Error(`Error al filtrar por calificación: ${error.message}`);
    }
  }
}

export default new SoundtrackService();
