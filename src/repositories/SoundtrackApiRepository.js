// src/repositories/SoundtrackApiRepository.js

import apiClient from "../shared/api/apiClient";
import BaseRepository from "./BaseRepository";

/**
 * SoundtrackApiRepository - Implementación de repositorio usando API REST (.NET)
 *
 * ENDPOINTS:
 * - /api/Prompt (CRUD Prompts + búsquedas)
 * - /api/ResultadoTrack (CRUD Tracks + Estructura + CuePoints + TagGenero)
 * - /api/Lyrics (CRUD SeccionEstructura + VRPs)
 * - /api/StyleDescription (CRUD Descriptors + búsqueda duplicados)
 *
 * MAPPERS:
 * - Convierte entre camelCase (frontend) y PascalCase (backend)
 */

class SoundtrackApiRepository extends BaseRepository {
  constructor() {
    super();
    this.baseUrl = "/api/Prompt";
  }

  // ==================== PROMPT CRUD ====================

  async getAll() {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data.map((prompt) => this._mapPromptFromApi(prompt));
    } catch (error) {
      throw new Error(`Error al obtener prompts: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return this._mapPromptFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al obtener prompt ${id}: ${error.message}`);
    }
  }

  async create(promptData) {
    try {
      const apiData = this._mapPromptToApi(promptData);
      const response = await apiClient.post(this.baseUrl, apiData);
      return this._mapPromptFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al crear prompt: ${error.message}`);
    }
  }

  async update(id, promptData) {
    try {
      const apiData = this._mapPromptToApi(promptData);
      const response = await apiClient.put(`${this.baseUrl}/${id}`, apiData);

      // Si la API retorna 204 No Content, hacer GET
      if (response.status === 204) {
        return await this.getById(id);
      }

      return this._mapPromptFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al actualizar prompt ${id}: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar prompt ${id}: ${error.message}`);
    }
  }

  // ==================== ⭐ RESULTADO TRACK CRUD ====================

  async createResultadoTrack(trackData) {
    try {
      const apiData = this._mapResultadoTrackToApi(trackData);
      const response = await apiClient.post("/api/ResultadoTrack", apiData);
      return this._mapResultadoTrackFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al crear track: ${error.message}`);
    }
  }

  async updateResultadoTrack(trackId, trackData) {
    try {
      const apiData = this._mapResultadoTrackToApi(trackData);
      const response = await apiClient.put(
        `/api/ResultadoTrack/${trackId}`,
        apiData
      );

      if (response.status === 204) {
        return await this.getResultadoTrackById(trackId);
      }

      return this._mapResultadoTrackFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al actualizar track: ${error.message}`);
    }
  }

  async getResultadoTrackById(trackId) {
    try {
      const response = await apiClient.get(`/api/ResultadoTrack/${trackId}`);
      return this._mapResultadoTrackFromApi(response.data);
    } catch (error) {
      throw new Error(`Error al obtener track: ${error.message}`);
    }
  }

  async getResultadoTracksByPromptId(promptId) {
    try {
      const response = await apiClient.get(
        `/api/ResultadoTrack/prompt/${promptId}`
      );
      return response.data.map((track) =>
        this._mapResultadoTrackFromApi(track)
      );
    } catch (error) {
      throw new Error(`Error al obtener tracks: ${error.message}`);
    }
  }

  async deleteResultadoTrack(trackId) {
    try {
      await apiClient.delete(`/api/ResultadoTrack/${trackId}`);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar track: ${error.message}`);
    }
  }

  // ==================== ⭐ ESTRUCTURA TEMPORAL CRUD ====================

  async createEstructuraTemporal(trackId, estructuraData) {
    try {
      const apiData = {
        IdResultado: trackId,
        Orden: estructuraData.orden,
        Seccion: estructuraData.seccion,
        TiempoInicio: estructuraData.tiempoInicio,
        TiempoFin: estructuraData.tiempoFin,
        Descripcion: estructuraData.descripcion || null,
      };

      const response = await apiClient.post(
        `/api/ResultadoTrack/${trackId}/EstructuraTemporal`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear estructura: ${error.message}`);
    }
  }

  async updateEstructuraTemporal(estructuraId, estructuraData) {
    try {
      const apiData = {
        Seccion: estructuraData.seccion,
        TiempoInicio: estructuraData.tiempoInicio,
        TiempoFin: estructuraData.tiempoFin,
        Descripcion: estructuraData.descripcion || null,
      };

      await apiClient.put(
        `/api/ResultadoTrack/EstructuraTemporal/${estructuraId}`,
        apiData
      );
      return estructuraData;
    } catch (error) {
      throw new Error(`Error al actualizar estructura: ${error.message}`);
    }
  }

  async deleteEstructuraTemporal(estructuraId) {
    try {
      await apiClient.delete(
        `/api/ResultadoTrack/EstructuraTemporal/${estructuraId}`
      );
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar estructura: ${error.message}`);
    }
  }

  // ==================== ⭐ CUE POINTS CRUD ====================

  async createCuePoint(trackId, cueData) {
    try {
      const apiData = {
        IdResultado: trackId,
        Tiempo: cueData.tiempo,
        Tipo: cueData.tipo || null,
        Etiqueta: cueData.etiqueta || null,
        Color: cueData.color || null,
        Descripcion: cueData.descripcion || null,
      };

      const response = await apiClient.post(
        `/api/ResultadoTrack/${trackId}/CuePoint`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear cue point: ${error.message}`);
    }
  }

  async updateCuePoint(cueId, cueData) {
    try {
      const apiData = {
        Tiempo: cueData.tiempo,
        Tipo: cueData.tipo || null,
        Etiqueta: cueData.etiqueta || null,
        Color: cueData.color || null,
        Descripcion: cueData.descripcion || null,
      };

      await apiClient.put(`/api/ResultadoTrack/CuePoint/${cueId}`, apiData);
      return cueData;
    } catch (error) {
      throw new Error(`Error al actualizar cue point: ${error.message}`);
    }
  }

  async deleteCuePoint(cueId) {
    try {
      await apiClient.delete(`/api/ResultadoTrack/CuePoint/${cueId}`);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar cue point: ${error.message}`);
    }
  }

  // ==================== ⭐ TAG GENERO (M:N) ====================

  async addTagGeneroToTrack(trackId, tagName) {
    try {
      const response = await apiClient.post(
        `/api/ResultadoTrack/${trackId}/TagGenero`,
        {
          Nombre: tagName,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al agregar tag: ${error.message}`);
    }
  }

  async removeTagGeneroFromTrack(trackId, tagGeneroId) {
    try {
      await apiClient.delete(
        `/api/ResultadoTrack/${trackId}/TagGenero/${tagGeneroId}`
      );
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar tag: ${error.message}`);
    }
  }

  // ==================== ⭐ SECCION ESTRUCTURA CRUD ====================

  async createSeccionEstructura(lyricsId, seccionData) {
    try {
      const apiData = {
        IdLyrics: lyricsId,
        Orden: seccionData.orden,
        TipoSeccion: seccionData.tipoSeccion,
        EtiquetaPersonalizada: seccionData.etiquetaPersonalizada || null,
        DuracionEstimada: seccionData.duracionEstimada || null,
      };

      const response = await apiClient.post(
        `/api/Lyrics/${lyricsId}/SeccionEstructura`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear sección: ${error.message}`);
    }
  }

  async updateSeccionEstructura(seccionId, seccionData) {
    try {
      const apiData = {
        TipoSeccion: seccionData.tipoSeccion,
        EtiquetaPersonalizada: seccionData.etiquetaPersonalizada || null,
        DuracionEstimada: seccionData.duracionEstimada || null,
      };

      await apiClient.put(
        `/api/Lyrics/SeccionEstructura/${seccionId}`,
        apiData
      );
      return seccionData;
    } catch (error) {
      throw new Error(`Error al actualizar sección: ${error.message}`);
    }
  }

  async deleteSeccionEstructura(seccionId) {
    try {
      await apiClient.delete(`/api/Lyrics/SeccionEstructura/${seccionId}`);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar sección: ${error.message}`);
    }
  }

  // ==================== ⭐ VRP CRUD ====================

  async createVrp(seccionId, vrpData) {
    try {
      const apiData = {
        IdSeccion: seccionId,
        OrdenEnSeccion: vrpData.ordenEnSeccion,
        ContenidoVrp: vrpData.contenidoVrp,
        TipoVrp: vrpData.tipoVrp || null,
        EstiloSemt: vrpData.estiloSemt || null,
        DuracionSemt: vrpData.duracionSemt || null,
        AlturaSemt: vrpData.alturaSemt || null,
        IntensidadSemt: vrpData.intensidadSemt || null,
        ArticulacionSemt: vrpData.articulacionSemt || null,
        Efectividad: vrpData.efectividad || null,
        TiempoInicio: vrpData.tiempoInicio || null,
        TiempoFin: vrpData.tiempoFin || null,
      };

      const response = await apiClient.post(
        `/api/Lyrics/SeccionEstructura/${seccionId}/Vrp`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear VRP: ${error.message}`);
    }
  }

  async updateVrp(vrpId, vrpData) {
    try {
      const apiData = {
        ContenidoVrp: vrpData.contenidoVrp,
        TipoVrp: vrpData.tipoVrp || null,
        EstiloSemt: vrpData.estiloSemt || null,
        DuracionSemt: vrpData.duracionSemt || null,
        AlturaSemt: vrpData.alturaSemt || null,
        IntensidadSemt: vrpData.intensidadSemt || null,
        ArticulacionSemt: vrpData.articulacionSemt || null,
        Efectividad: vrpData.efectividad || null,
        TiempoInicio: vrpData.tiempoInicio || null,
        TiempoFin: vrpData.tiempoFin || null,
      };

      await apiClient.put(`/api/Lyrics/Vrp/${vrpId}`, apiData);
      return vrpData;
    } catch (error) {
      throw new Error(`Error al actualizar VRP: ${error.message}`);
    }
  }

  async deleteVrp(vrpId) {
    try {
      await apiClient.delete(`/api/Lyrics/Vrp/${vrpId}`);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar VRP: ${error.message}`);
    }
  }

  // ==================== ⭐ DESCRIPTOR CRUD ====================

  async findDescriptor(styleId, descriptor1, categoria) {
    try {
      const response = await apiClient.get(
        `/api/StyleDescription/${styleId}/Descriptor/find`,
        {
          params: {
            descriptor: descriptor1,
            categoria: categoria,
          },
        }
      );
      return response.data;
    } catch (error) {
      // 404 significa que no existe (esto es esperado)
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error(`Error al buscar descriptor: ${error.message}`);
    }
  }

  async createOrUpdateDescriptor(styleId, descriptorData) {
    try {
      const apiData = {
        Descriptor1: descriptorData.descriptor1,
        Categoria: descriptorData.categoria,
        EfectividadPromedio: descriptorData.efectividadPromedio || null,
      };

      // El backend maneja la lógica de duplicados
      const response = await apiClient.post(
        `/api/StyleDescription/${styleId}/Descriptor`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear/actualizar descriptor: ${error.message}`);
    }
  }

  async updateDescriptor(descriptorId, descriptorData) {
    try {
      const apiData = {
        Descriptor1: descriptorData.descriptor1,
        Categoria: descriptorData.categoria,
        FrecuenciaUso: descriptorData.frecuenciaUso,
        EfectividadPromedio: descriptorData.efectividadPromedio,
      };

      await apiClient.put(
        `/api/StyleDescription/Descriptor/${descriptorId}`,
        apiData
      );
      return descriptorData;
    } catch (error) {
      throw new Error(`Error al actualizar descriptor: ${error.message}`);
    }
  }

  async deleteDescriptor(descriptorId) {
    try {
      await apiClient.delete(
        `/api/StyleDescription/Descriptor/${descriptorId}`
      );
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar descriptor: ${error.message}`);
    }
  }

  // ==================== MAPPERS ====================

  _mapPromptToApi(promptData) {
    return {
      NombreTrack: promptData.songTitle,
      ObjetivoMusical: promptData.objetivoMusical || null,
      ContextoUso: promptData.contextoUso || null,
      Calificacion: promptData.calificacion || null,
      NotasGenerales: promptData.notas || null,
      Lyrics: promptData.lyrics
        ? {
            ContenidoCompleto: promptData.lyrics,
            PorcentajeVrps: null,
            PorcentajeNarrativa: null,
            PorcentajeAtmosferico: null,
          }
        : null,
      StyleDescription: promptData.styleDescription
        ? {
            ContenidoCompleto: promptData.styleDescription,
            GeneroPrincipal: null,
            Subgeneros: null,
            Bpm: null,
          }
        : null,
      ExcludedStyles: promptData.excludedStyle
        ? [
            {
              ContenidoCompleto: promptData.excludedStyle,
            },
          ]
        : null,
      AdvancedOptions: {
        VocalGender: promptData.vocalGender || null,
        WeirdnessPercentage: promptData.weirdness || 50,
        StyleInfluencePercentage: promptData.styleInfluence || 50,
      },
      Tags: promptData.tags || [],
    };
  }

  _mapPromptFromApi(apiData) {
    return {
      id: apiData.idPrompt,
      songTitle: apiData.nombreTrack,
      objetivoMusical: apiData.objetivoMusical,
      contextoUso: apiData.contextoUso,
      calificacion: apiData.calificacion,
      notas: apiData.notasGenerales,
      lyrics: apiData.lyrics?.[0]?.contenidoCompleto || null,
      styleDescription:
        apiData.styleDescriptions?.[0]?.contenidoCompleto || null,
      excludedStyle: apiData.excludedStyles?.[0]?.contenidoCompleto || null,
      vocalGender: apiData.advancedOptions?.[0]?.vocalGender || null,
      weirdness: apiData.advancedOptions?.[0]?.weirdnessPercentage || 50,
      styleInfluence:
        apiData.advancedOptions?.[0]?.styleInfluencePercentage || 50,
      tags: apiData.idTags?.map((tag) => tag.nombreTag) || [],
      resultadoTracks: apiData.resultadoTracks || [],
      createdAt: apiData.fechaCreacion,
      updatedAt: apiData.fechaCreacion, // La API no tiene updatedAt separado
    };
  }

  _mapResultadoTrackToApi(trackData) {
    return {
      IdPrompt: trackData.idPrompt,
      NumeroTrack: trackData.numeroTrack,
      SunoUrl: trackData.sunoUrl,
      SunoVersion: trackData.sunoVersion || "v4.5",
      DuracionReal: trackData.duracionReal,
      BpmReal: trackData.bpmReal ? parseInt(trackData.bpmReal) : null,
      KeyMusical: trackData.keyMusical || null,
      CalificacionIndividual: trackData.calificacionIndividual || null,
      MomentoNarrativo: trackData.momentoNarrativo || null,
      NotasTrack: trackData.notasTrack || null,
    };
  }

  _mapResultadoTrackFromApi(apiData) {
    return {
      id: apiData.idResultado,
      idPrompt: apiData.idPrompt,
      numeroTrack: apiData.numeroTrack,
      sunoUrl: apiData.sunoUrl,
      sunoVersion: apiData.sunoVersion,
      duracionReal: apiData.duracionReal,
      bpmReal: apiData.bpmReal,
      keyMusical: apiData.keyMusical,
      calificacionIndividual: apiData.calificacionIndividual,
      momentoNarrativo: apiData.momentoNarrativo,
      notasTrack: apiData.notasTrack,
      estructuraTemporals: apiData.estructuraTemporals || [],
      cuePoints: apiData.cuePoints || [],
      tagGeneros: apiData.idTagGeneros || [],
    };
  }
}

export default SoundtrackApiRepository;
