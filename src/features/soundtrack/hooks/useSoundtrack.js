// src/features/soundtrack/hooks/useSoundtrack.js

import { useState, useEffect, useCallback } from "react";
import { soundtrackService } from "../../../services/SoundtrackService";

/**
 * useSoundtrack - Custom Hook para gestión de Prompts de Suno
 *
 * RESPONSABILIDADES:
 * - Cargar prompts desde soundtrackService
 * - Gestionar estados de loading y errores
 * - CRUD completo de prompts
 * - Búsqueda y filtrado
 * - Duplicación de prompts
 *
 * IMPORTANTE: NO toca localStorage directamente, usa soundtrackService
 */

export const useSoundtrack = () => {
  // ==================== ESTADOS ====================

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [minRating, setMinRating] = useState(0);

  // ==================== CARGAR PROMPTS ====================

  /**
   * Cargar todos los prompts
   */
  const loadPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await soundtrackService.getAllPrompts();
      setPrompts(data);
    } catch (err) {
      setError(`Error al cargar prompts: ${err.message}`);
      console.error("Error loading prompts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar un prompt específico por ID
   */
  const loadPromptById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = await soundtrackService.getPromptById(id);
      return prompt;
    } catch (err) {
      setError(`Error al cargar prompt: ${err.message}`);
      console.error("Error loading prompt:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== CRUD OPERATIONS ====================

  /**
   * Crear un nuevo prompt
   * @param {Object} promptData - Datos del prompt
   * @returns {Promise<Object>} Prompt creado
   */
  const createPrompt = useCallback(async (promptData) => {
    setLoading(true);
    setError(null);

    try {
      const newPrompt = await soundtrackService.createPrompt(promptData);
      setPrompts((prev) => [...prev, newPrompt]);
      return newPrompt;
    } catch (err) {
      setError(`Error al crear prompt: ${err.message}`);
      console.error("Error creating prompt:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar un prompt existente
   * @param {string|number} id - ID del prompt
   * @param {Object} promptData - Datos actualizados
   * @returns {Promise<Object>} Prompt actualizado
   */
  const updatePrompt = useCallback(async (id, promptData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPrompt = await soundtrackService.updatePrompt(
        id,
        promptData
      );
      setPrompts((prev) => prev.map((p) => (p.id === id ? updatedPrompt : p)));
      return updatedPrompt;
    } catch (err) {
      setError(`Error al actualizar prompt: ${err.message}`);
      console.error("Error updating prompt:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un prompt
   * @param {string|number} id - ID del prompt
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const deletePrompt = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const success = await soundtrackService.deletePrompt(id);
      if (success) {
        setPrompts((prev) => prev.filter((p) => p.id !== id));
      }
      return success;
    } catch (err) {
      setError(`Error al eliminar prompt: ${err.message}`);
      console.error("Error deleting prompt:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Duplicar un prompt (para iteraciones)
   * @param {string|number} id - ID del prompt a duplicar
   * @param {Object} changes - Cambios opcionales a aplicar
   * @returns {Promise<Object>} Nuevo prompt duplicado
   */
  const duplicatePrompt = useCallback(async (id, changes = {}) => {
    setLoading(true);
    setError(null);

    try {
      const duplicated = await soundtrackService.duplicatePrompt(id, changes);
      setPrompts((prev) => [...prev, duplicated]);
      return duplicated;
    } catch (err) {
      setError(`Error al duplicar prompt: ${err.message}`);
      console.error("Error duplicating prompt:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== CALIFICACIÓN ====================

  /**
   * Calificar un prompt (1-10)
   * @param {string|number} id - ID del prompt
   * @param {number} rating - Calificación (1-10)
   * @returns {Promise<Object>} Prompt actualizado
   */
  const ratePrompt = useCallback(async (id, rating) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.ratePrompt(id, rating);
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      setError(`Error al calificar prompt: ${err.message}`);
      console.error("Error rating prompt:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== BÚSQUEDA Y FILTRADO ====================

  /**
   * Buscar prompts por tags
   * @param {string[]} tags - Array de tags
   * @returns {Promise<Array>} Prompts filtrados
   */
  const searchByTags = useCallback(async (tags) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.searchByTags(tags);
      return results;
    } catch (err) {
      setError(`Error al buscar por tags: ${err.message}`);
      console.error("Error searching by tags:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar prompts por género
   * @param {string} genre - Género musical
   * @returns {Promise<Array>} Prompts filtrados
   */
  const searchByGenre = useCallback(async (genre) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.searchByGenre(genre);
      return results;
    } catch (err) {
      setError(`Error al buscar por género: ${err.message}`);
      console.error("Error searching by genre:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener prompts mejor calificados
   * @param {number} minRating - Calificación mínima
   * @param {number} limit - Número máximo de resultados
   * @returns {Promise<Array>} Prompts top rated
   */
  const getTopRated = useCallback(async (minRating = 7, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.getTopRated(minRating, limit);
      return results;
    } catch (err) {
      setError(`Error al obtener top rated: ${err.message}`);
      console.error("Error getting top rated:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener prompts recientes
   * @param {number} limit - Número de prompts
   * @returns {Promise<Array>} Prompts recientes
   */
  const getRecentPrompts = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.getRecentPrompts(limit);
      return results;
    } catch (err) {
      setError(`Error al obtener prompts recientes: ${err.message}`);
      console.error("Error getting recent prompts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FILTRADO LOCAL ====================

  /**
   * Filtrar prompts localmente (sin llamar al service)
   * Útil para búsqueda en tiempo real
   */
  const filteredPrompts = useCallback(() => {
    let filtered = [...prompts];

    // Filtrar por búsqueda de texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((prompt) => {
        const titleMatch = prompt.songTitle?.toLowerCase().includes(query);
        const lyricsMatch = prompt.lyrics?.toLowerCase().includes(query);
        const styleMatch = prompt.styleDescription
          ?.toLowerCase()
          .includes(query);
        return titleMatch || lyricsMatch || styleMatch;
      });
    }

    // Filtrar por tags seleccionados
    if (selectedTags.length > 0) {
      filtered = filtered.filter((prompt) => {
        if (!prompt.tags || prompt.tags.length === 0) return false;
        return selectedTags.some((tag) =>
          prompt.tags.some((promptTag) =>
            promptTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
      });
    }

    // Filtrar por rating mínimo
    if (minRating > 0) {
      filtered = filtered.filter(
        (prompt) => prompt.calificacion && prompt.calificacion >= minRating
      );
    }

    return filtered;
  }, [prompts, searchQuery, selectedTags, minRating]);

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas del soundtrack
   * @returns {Promise<Object>} Estadísticas
   */
  const getStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await soundtrackService.getStatistics();
      return stats;
    } catch (err) {
      setError(`Error al obtener estadísticas: ${err.message}`);
      console.error("Error getting statistics:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== EXPORT/IMPORT ====================

  /**
   * Exportar todos los prompts
   * @returns {Promise<Object>} Datos exportados
   */
  const exportPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await soundtrackService.exportAll();
      return data;
    } catch (err) {
      setError(`Error al exportar prompts: ${err.message}`);
      console.error("Error exporting prompts:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Importar prompts desde archivo
   * @param {Object|Array} data - Datos a importar
   * @returns {Promise<Array>} Prompts importados
   */
  const importPrompts = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const imported = await soundtrackService.importAll(data);
      setPrompts(imported);
      return imported;
    } catch (err) {
      setError(`Error al importar prompts: ${err.message}`);
      console.error("Error importing prompts:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== VALIDACIONES ====================

  /**
   * Validar datos de prompt
   * @param {Object} promptData - Datos a validar
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  const validatePrompt = useCallback((promptData) => {
    return soundtrackService.validatePromptData(promptData);
  }, []);

  /**
   * Verificar límites de caracteres
   * @param {Object} promptData - Datos del prompt
   * @returns {Object} Warnings por campo
   */
  const checkCharacterLimits = useCallback((promptData) => {
    return soundtrackService.constructor.checkCharacterLimits(promptData);
  }, []);

  // ==================== EFECTOS ====================

  /**
   * Cargar prompts al montar el componente
   */
  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // ==================== RETURN ====================

  return {
    // Estado
    prompts,
    loading,
    error,

    // Filtros
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    minRating,
    setMinRating,
    filteredPrompts: filteredPrompts(),

    // CRUD
    loadPrompts,
    loadPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
    duplicatePrompt,

    // Calificación
    ratePrompt,

    // Búsqueda
    searchByTags,
    searchByGenre,
    getTopRated,
    getRecentPrompts,

    // Estadísticas
    getStatistics,

    // Export/Import
    exportPrompts,
    importPrompts,

    // Validaciones
    validatePrompt,
    checkCharacterLimits,

    // Helpers
    clearError: () => setError(null),
  };
};

export default useSoundtrack;
