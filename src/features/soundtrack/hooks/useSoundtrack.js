// src/features/soundtrack/hooks/useSoundtrack.js

import { useState, useCallback } from "react";
import soundtrackService from "../../../services/SoundtrackService";

/**
 * useSoundtrack - Hook personalizado para gestionar prompts de soundtrack
 *
 * FUNCIONALIDADES:
 * - CRUD completo de Prompts
 * - CRUD de ResultadoTrack + EstructuraTemporal + CuePoints + TagGenero
 * - CRUD de SeccionEstructura + VRPs (Lyrics)
 * - CRUD de Descriptors (StyleDescription)
 * - Validaciones
 * - Gestión de estado (loading, error)
 *
 * @returns {Object} Métodos y estados para soundtrack
 */

const useSoundtrack = () => {
  // ==================== ESTADOS ====================

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== PROMPT CRUD (EXISTENTE) ====================

  const getAllPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await soundtrackService.getAllPrompts();
      setPrompts(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPromptById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await soundtrackService.getPromptById(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPrompt = useCallback(async (promptData) => {
    setLoading(true);
    setError(null);

    try {
      const newPrompt = await soundtrackService.createPrompt(promptData);
      setPrompts((prev) => [newPrompt, ...prev]);
      return newPrompt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrompt = useCallback(async (id, promptData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.updatePrompt(id, promptData);
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePrompt = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicatePrompt = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const duplicated = await soundtrackService.duplicatePrompt(id);
      setPrompts((prev) => [duplicated, ...prev]);
      return duplicated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ratePrompt = useCallback(async (id, rating) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.ratePrompt(id, rating);
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ RESULTADO TRACK ====================

  const createResultadoTrack = useCallback(async (promptId, trackData) => {
    setLoading(true);
    setError(null);

    try {
      // Calcular NumeroTrack automático
      const existingTracks =
        await soundtrackService.getResultadoTracksByPromptId(promptId);
      const nextTrackNumber = existingTracks.length + 1;

      const trackWithNumber = {
        ...trackData,
        idPrompt: promptId,
        numeroTrack: nextTrackNumber,
      };

      const newTrack = await soundtrackService.createResultadoTrack(
        trackWithNumber
      );
      return newTrack;
    } catch (err) {
      setError(`Error al crear track: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResultadoTrack = useCallback(async (trackId, trackData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.updateResultadoTrack(
        trackId,
        trackData
      );
      return updated;
    } catch (err) {
      setError(`Error al actualizar track: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResultadoTrackById = useCallback(async (trackId) => {
    setLoading(true);
    setError(null);

    try {
      const track = await soundtrackService.getResultadoTrackById(trackId);
      return track;
    } catch (err) {
      setError(`Error al obtener track: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResultadoTracksByPromptId = useCallback(async (promptId) => {
    setLoading(true);
    setError(null);

    try {
      const tracks = await soundtrackService.getResultadoTracksByPromptId(
        promptId
      );
      return tracks;
    } catch (err) {
      setError(`Error al obtener tracks: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResultadoTrack = useCallback(async (trackId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteResultadoTrack(trackId);
    } catch (err) {
      setError(`Error al eliminar track: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ ESTRUCTURA TEMPORAL ====================

  const createEstructuraTemporal = useCallback(
    async (trackId, estructuraData) => {
      setLoading(true);
      setError(null);

      try {
        const estructura = await soundtrackService.createEstructuraTemporal(
          trackId,
          estructuraData
        );
        return estructura;
      } catch (err) {
        setError(`Error al crear estructura: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateEstructuraTemporal = useCallback(
    async (estructuraId, estructuraData) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await soundtrackService.updateEstructuraTemporal(
          estructuraId,
          estructuraData
        );
        return updated;
      } catch (err) {
        setError(`Error al actualizar estructura: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEstructuraTemporal = useCallback(async (estructuraId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteEstructuraTemporal(estructuraId);
    } catch (err) {
      setError(`Error al eliminar estructura: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ CUE POINTS ====================

  const createCuePoint = useCallback(async (trackId, cueData) => {
    setLoading(true);
    setError(null);

    try {
      const cuePoint = await soundtrackService.createCuePoint(trackId, cueData);
      return cuePoint;
    } catch (err) {
      setError(`Error al crear cue point: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCuePoint = useCallback(async (cueId, cueData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.updateCuePoint(cueId, cueData);
      return updated;
    } catch (err) {
      setError(`Error al actualizar cue point: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCuePoint = useCallback(async (cueId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteCuePoint(cueId);
    } catch (err) {
      setError(`Error al eliminar cue point: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ TAG GENERO (M:N) ====================

  const addTagGeneroToTrack = useCallback(async (trackId, tagName) => {
    setLoading(true);
    setError(null);

    try {
      const result = await soundtrackService.addTagGeneroToTrack(
        trackId,
        tagName
      );
      return result;
    } catch (err) {
      setError(`Error al agregar tag: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTagGeneroFromTrack = useCallback(async (trackId, tagGeneroId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.removeTagGeneroFromTrack(trackId, tagGeneroId);
    } catch (err) {
      setError(`Error al eliminar tag: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ SECCION ESTRUCTURA (LYRICS) ====================

  const createSeccionEstructura = useCallback(async (lyricsId, seccionData) => {
    setLoading(true);
    setError(null);

    try {
      const seccion = await soundtrackService.createSeccionEstructura(
        lyricsId,
        seccionData
      );
      return seccion;
    } catch (err) {
      setError(`Error al crear sección: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeccionEstructura = useCallback(
    async (seccionId, seccionData) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await soundtrackService.updateSeccionEstructura(
          seccionId,
          seccionData
        );
        return updated;
      } catch (err) {
        setError(`Error al actualizar sección: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSeccionEstructura = useCallback(async (seccionId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteSeccionEstructura(seccionId);
    } catch (err) {
      setError(`Error al eliminar sección: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ VRP ====================

  const createVrp = useCallback(async (seccionId, vrpData) => {
    setLoading(true);
    setError(null);

    try {
      const vrp = await soundtrackService.createVrp(seccionId, vrpData);
      return vrp;
    } catch (err) {
      setError(`Error al crear VRP: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVrp = useCallback(async (vrpId, vrpData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.updateVrp(vrpId, vrpData);
      return updated;
    } catch (err) {
      setError(`Error al actualizar VRP: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVrp = useCallback(async (vrpId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteVrp(vrpId);
    } catch (err) {
      setError(`Error al eliminar VRP: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ⭐ DESCRIPTORS (STYLE) ====================

  const findDescriptor = useCallback(
    async (styleId, descriptor1, categoria) => {
      setLoading(true);
      setError(null);

      try {
        const descriptor = await soundtrackService.findDescriptor(
          styleId,
          descriptor1,
          categoria
        );
        return descriptor;
      } catch (err) {
        setError(`Error al buscar descriptor: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createOrUpdateDescriptor = useCallback(
    async (styleId, descriptorData) => {
      setLoading(true);
      setError(null);

      try {
        // El backend maneja la lógica de crear o actualizar
        const result = await soundtrackService.createOrUpdateDescriptor(
          styleId,
          descriptorData
        );
        return result;
      } catch (err) {
        setError(`Error al crear/actualizar descriptor: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDescriptor = useCallback(async (descriptorId, descriptorData) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await soundtrackService.updateDescriptor(
        descriptorId,
        descriptorData
      );
      return updated;
    } catch (err) {
      setError(`Error al actualizar descriptor: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDescriptor = useCallback(async (descriptorId) => {
    setLoading(true);
    setError(null);

    try {
      await soundtrackService.deleteDescriptor(descriptorId);
    } catch (err) {
      setError(`Error al eliminar descriptor: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== VALIDACIONES (EXISTENTES) ====================

  const validatePrompt = useCallback((promptData) => {
    return soundtrackService.validatePrompt(promptData);
  }, []);

  const checkCharacterLimits = useCallback((promptData) => {
    return soundtrackService.checkCharacterLimits(promptData);
  }, []);

  // ==================== BÚSQUEDAS (EXISTENTES) ====================

  const searchPrompts = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.searchPrompts(query);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByTag = useCallback(async (tag) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.filterByTag(tag);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByRating = useCallback(async (minRating) => {
    setLoading(true);
    setError(null);

    try {
      const results = await soundtrackService.filterByRating(minRating);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== RETURN ====================

  return {
    // Estados
    prompts,
    loading,
    error,

    // Prompt CRUD
    getAllPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
    duplicatePrompt,
    ratePrompt,

    // ⭐ ResultadoTrack CRUD
    createResultadoTrack,
    updateResultadoTrack,
    getResultadoTrackById,
    getResultadoTracksByPromptId,
    deleteResultadoTrack,

    // ⭐ EstructuraTemporal CRUD
    createEstructuraTemporal,
    updateEstructuraTemporal,
    deleteEstructuraTemporal,

    // ⭐ CuePoint CRUD
    createCuePoint,
    updateCuePoint,
    deleteCuePoint,

    // ⭐ TagGenero (M:N)
    addTagGeneroToTrack,
    removeTagGeneroFromTrack,

    // ⭐ SeccionEstructura CRUD
    createSeccionEstructura,
    updateSeccionEstructura,
    deleteSeccionEstructura,

    // ⭐ VRP CRUD
    createVrp,
    updateVrp,
    deleteVrp,

    // ⭐ Descriptor CRUD
    findDescriptor,
    createOrUpdateDescriptor,
    updateDescriptor,
    deleteDescriptor,

    // Validaciones
    validatePrompt,
    checkCharacterLimits,

    // Búsquedas
    searchPrompts,
    filterByTag,
    filterByRating,
  };
};

export { useSoundtrack };
