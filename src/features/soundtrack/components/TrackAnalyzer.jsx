// src/features/soundtrack/components/TrackAnalyzer.jsx

import { useState, useEffect } from 'react'
import { useSoundtrack } from '../hooks/useSoundtrack'
import './TrackAnalyzer.css'

/**
 * TrackAnalyzer - Analizador de tracks generados por Suno
 * 
 * FLUJO WIZARD:
 * 1. Info Básica (obligatoria) → Guardar y Continuar
 * 2. Tabs se habilitan: Estructura | Cue Points
 * 3. Guardar Todo → Volver a Detail
 * 
 * PROPS:
 * @param {number} promptId - ID del prompt padre
 * @param {number|null} trackId - ID del track (null = crear nuevo)
 * @param {Function} onBack - Callback para volver a Detail
 * @param {Function} onSave - Callback al guardar (opcional)
 */

const TrackAnalyzer = ({ promptId, trackId, onBack, onSave }) => {
  // ==================== HOOKS ====================
  
  const {
    createResultadoTrack,
    updateResultadoTrack,
    getResultadoTrackById,
    createEstructuraTemporal,
    updateEstructuraTemporal,
    deleteEstructuraTemporal,
    createCuePoint,
    updateCuePoint,
    deleteCuePoint,
    addTagGeneroToTrack,
    removeTagGeneroFromTrack,
    loading,
    error: hookError
  } = useSoundtrack()

  // ==================== ESTADOS ====================

  const [trackData, setTrackData] = useState({
    // Info Básica
    numeroTrack: null,           // Backend asigna
    sunoUrl: '',                 // Obligatorio
    duracionReal: '',            // Obligatorio (mm:ss)
    bpmReal: '',                 // Opcional
    keyMusical: '',              // Opcional
    sunoVersion: 'v4.5',         // Default
    calificacionIndividual: null,// Opcional (1-10)
    momentoNarrativo: '',        // Opcional
    notasTrack: '',              // Opcional
    
    // Tags
    tags: [],                    // Array de strings
    
    // Estructura Temporal (se llenan en Step 2)
    estructura: [],              // Array de objetos
    
    // Cue Points (se llenan en Step 2)
    cuePoints: [],               // Array de objetos
  })

  const [isBasicInfoSaved, setIsBasicInfoSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('estructura') // 'estructura', 'cuepoints'
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState(null)
  const [localLoading, setLocalLoading] = useState(false)

  // ==================== EFFECTS ====================

  useEffect(() => {
    const initializeTrack = async () => {
      if (trackId) {
        // MODO EDICIÓN: Cargar track existente
        setLocalLoading(true)
        try {
          const track = await getResultadoTrackById(trackId)
          setTrackData({
            numeroTrack: track.numeroTrack,
            sunoUrl: track.sunoUrl || '',
            duracionReal: track.duracionReal || '',
            bpmReal: track.bpmReal || '',
            keyMusical: track.keyMusical || '',
            sunoVersion: track.sunoVersion || 'v4.5',
            calificacionIndividual: track.calificacionIndividual || null,
            momentoNarrativo: track.momentoNarrativo || '',
            notasTrack: track.notasTrack || '',
            tags: track.tagGeneros?.map(tg => tg.nombre) || [],
            estructura: track.estructuraTemporals || [],
            cuePoints: track.cuePoints || [],
          })
          setIsBasicInfoSaved(true)
        } catch (err) {
          setError(`Error al cargar track: ${err.message}`)
        } finally {
          setLocalLoading(false)
        }
      } else {
        // MODO CREACIÓN: NumeroTrack se asigna en backend
        setTrackData(prev => ({ ...prev, numeroTrack: null }))
      }
    }
    
    initializeTrack()
  }, [promptId, trackId, getResultadoTrackById])

  // ==================== HANDLERS - INFO BÁSICA ====================

  const handleChange = (field, value) => {
    setTrackData(prev => ({ ...prev, [field]: value }))
  }

  const handleRatingChange = (rating) => {
    setTrackData(prev => ({ ...prev, calificacionIndividual: rating }))
  }

  // ==================== HANDLERS - TAGS ====================

  const handleAddTag = async () => {
    const tag = tagInput.trim()
    if (tag && !trackData.tags.includes(tag)) {
      setTrackData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
      
      // Si ya está guardado, agregar a DB
      if (isBasicInfoSaved && trackId) {
        try {
          await addTagGeneroToTrack(trackId, tag)
        } catch (err) {
          setError(`Error al agregar tag: ${err.message}`)
        }
      }
    }
  }

  const handleRemoveTag = async (index) => {
    const tagToRemove = trackData.tags[index]
    setTrackData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
    
    // Si ya está guardado, eliminar de DB
    if (isBasicInfoSaved && trackId) {
      try {
        // Buscar ID del tag en tagGeneros
        const tagGenero = trackData.tagGeneros?.find(tg => tg.nombre === tagToRemove)
        if (tagGenero) {
          await removeTagGeneroFromTrack(trackId, tagGenero.idTagGenero)
        }
      } catch (err) {
        setError(`Error al eliminar tag: ${err.message}`)
      }
    }
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // ==================== HANDLERS - GUARDAR INFO BÁSICA ====================

  const handleSaveBasicInfo = async () => {
    // Validar campos obligatorios
    if (!trackData.sunoUrl || !trackData.duracionReal) {
      setError('Suno URL y Duración Real son obligatorios')
      return
    }
    
    // Validar formato de duración
    if (!/^\d{1,2}:\d{2}$/.test(trackData.duracionReal)) {
      setError('Duración debe estar en formato mm:ss (ej: 3:45)')
      return
    }

    setLocalLoading(true)
    setError(null)

    try {
      const basicInfoData = {
        idPrompt: promptId,
        numeroTrack: null, // ⭐ Backend asigna automáticamente
        sunoUrl: trackData.sunoUrl,
        sunoVersion: trackData.sunoVersion,
        duracionReal: trackData.duracionReal,
        bpmReal: trackData.bpmReal ? parseInt(trackData.bpmReal) : null,
        keyMusical: trackData.keyMusical || null,
        calificacionIndividual: trackData.calificacionIndividual || null,
        momentoNarrativo: trackData.momentoNarrativo || null,
        notasTrack: trackData.notasTrack || null,
      }

      let savedTrack

      if (trackId) {
        // ACTUALIZAR existente
        savedTrack = await updateResultadoTrack(trackId, basicInfoData)
      } else {
        // CREAR nuevo
        savedTrack = await createResultadoTrack(promptId, basicInfoData)
      }

      // Actualizar estado con track guardado (incluye ID y NumeroTrack asignado)
      setTrackData(prev => ({
        ...prev,
        numeroTrack: savedTrack.numeroTrack,
      }))

      // Agregar tags si hay
      if (trackData.tags.length > 0 && savedTrack.id) {
        for (const tag of trackData.tags) {
          await addTagGeneroToTrack(savedTrack.id, tag)
        }
      }

      setIsBasicInfoSaved(true)
      
      // Scroll a tabs
      setTimeout(() => {
        document.querySelector('.analyzer-tabs')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 300)

    } catch (err) {
      setError(`Error al guardar: ${err.message}`)
    } finally {
      setLocalLoading(false)
    }
  }

  // ==================== HANDLERS - ESTRUCTURA TEMPORAL ====================

  const handleAddEstructura = () => {
    const newSeccion = {
      id: null, // Temporal, se asigna al guardar
      orden: trackData.estructura.length + 1,
      seccion: 'Intro',
      tiempoInicio: suggestNextStartTime(),
      tiempoFin: '',
      descripcion: ''
    }
    
    setTrackData(prev => ({
      ...prev,
      estructura: [...prev.estructura, newSeccion]
    }))
  }

  const suggestNextStartTime = () => {
    if (trackData.estructura.length === 0) {
      return '0:00'
    }
    
    const lastSeccion = trackData.estructura[trackData.estructura.length - 1]
    if (lastSeccion.tiempoFin) {
      // Convertir mm:ss a segundos, sumar 1, convertir de vuelta
      const [min, sec] = lastSeccion.tiempoFin.split(':').map(Number)
      const totalSec = min * 60 + sec + 1
      const newMin = Math.floor(totalSec / 60)
      const newSec = totalSec % 60
      return `${newMin}:${String(newSec).padStart(2, '0')}`
    }
    
    return ''
  }

  const handleUpdateEstructura = (index, field, value) => {
    setTrackData(prev => {
      const newEstructura = [...prev.estructura]
      newEstructura[index] = {
        ...newEstructura[index],
        [field]: value
      }
      return { ...prev, estructura: newEstructura }
    })
  }

  const handleRemoveEstructura = async (index) => {
    const estructuraToRemove = trackData.estructura[index]
    
    // Si tiene ID, eliminar de DB
    if (estructuraToRemove.idEstructura) {
      try {
        await deleteEstructuraTemporal(estructuraToRemove.idEstructura)
      } catch (err) {
        setError(`Error al eliminar estructura: ${err.message}`)
        return
      }
    }
    
    // Eliminar de estado local
    setTrackData(prev => ({
      ...prev,
      estructura: prev.estructura.filter((_, i) => i !== index)
    }))
  }

  // ==================== HANDLERS - CUE POINTS ====================

  const CUE_POINT_TYPES = {
    intro: { label: 'Intro', color: '#00d4ff' },
    drop: { label: 'Drop', color: '#ff3333' },
    buildup: { label: 'Build-up', color: '#ff6600' },
    breakdown: { label: 'Breakdown', color: '#ffd700' },
    outro: { label: 'Outro', color: '#ff0080' },
    vocal: { label: 'Vocal', color: '#00ff41' },
    instrumental: { label: 'Instrumental', color: '#ffffff' },
    bridge: { label: 'Bridge', color: '#cc00ff' }
  }

  const handleAddCuePoint = () => {
    const newCue = {
      id: null,
      tiempo: '',
      tipo: 'intro',
      etiqueta: '',
      color: CUE_POINT_TYPES.intro.color,
      descripcion: ''
    }
    
    setTrackData(prev => ({
      ...prev,
      cuePoints: [...prev.cuePoints, newCue]
    }))
  }

  const handleUpdateCuePoint = (index, field, value) => {
    setTrackData(prev => {
      const newCuePoints = [...prev.cuePoints]
      newCuePoints[index] = {
        ...newCuePoints[index],
        [field]: value
      }
      
      // Si cambió el tipo, actualizar color automáticamente
      if (field === 'tipo') {
        newCuePoints[index].color = CUE_POINT_TYPES[value]?.color || '#00d4ff'
      }
      
      return { ...prev, cuePoints: newCuePoints }
    })
  }

  const handleRemoveCuePoint = async (index) => {
    const cueToRemove = trackData.cuePoints[index]
    
    // Si tiene ID, eliminar de DB
    if (cueToRemove.idCue) {
      try {
        await deleteCuePoint(cueToRemove.idCue)
      } catch (err) {
        setError(`Error al eliminar cue point: ${err.message}`)
        return
      }
    }
    
    // Eliminar de estado local
    setTrackData(prev => ({
      ...prev,
      cuePoints: prev.cuePoints.filter((_, i) => i !== index)
    }))
  }

  // ==================== HANDLERS - GUARDAR TODO ====================

  const handleSaveAnalysis = async () => {
    if (!isBasicInfoSaved) {
      setError('Primero debes guardar la información básica')
      return
    }

    setLocalLoading(true)
    setError(null)

    try {
      // 1. Actualizar info básica (por si cambió algo)
      await updateResultadoTrack(trackId, {
        sunoUrl: trackData.sunoUrl,
        sunoVersion: trackData.sunoVersion,
        duracionReal: trackData.duracionReal,
        bpmReal: trackData.bpmReal ? parseInt(trackData.bpmReal) : null,
        keyMusical: trackData.keyMusical || null,
        calificacionIndividual: trackData.calificacionIndividual || null,
        momentoNarrativo: trackData.momentoNarrativo || null,
        notasTrack: trackData.notasTrack || null,
      })

      // 2. Guardar Estructura Temporal
      for (const estructura of trackData.estructura) {
        if (estructura.idEstructura) {
          // Actualizar existente
          await updateEstructuraTemporal(estructura.idEstructura, estructura)
        } else {
          // Crear nueva
          await createEstructuraTemporal(trackId, estructura)
        }
      }

      // 3. Guardar Cue Points
      for (const cue of trackData.cuePoints) {
        if (cue.idCue) {
          // Actualizar existente
          await updateCuePoint(cue.idCue, cue)
        } else {
          // Crear nuevo
          await createCuePoint(trackId, cue)
        }
      }

      // 4. Callback de éxito
      if (onSave) {
        onSave(trackData)
      }

      // 5. Volver a Detail
      if (onBack) {
        onBack()
      }

    } catch (err) {
      setError(`Error al guardar análisis: ${err.message}`)
    } finally {
      setLocalLoading(false)
    }
  }

  // ==================== HELPERS ====================

  const calculateDuration = (seccion) => {
    if (!seccion.tiempoInicio || !seccion.tiempoFin) return 0
    
    const [minI, secI] = seccion.tiempoInicio.split(':').map(Number)
    const [minF, secF] = seccion.tiempoFin.split(':').map(Number)
    
    const totalI = minI * 60 + secI
    const totalF = minF * 60 + secF
    
    return totalF - totalI
  }

  const getSectionColor = (seccionType) => {
    const colors = {
      'Intro': '#00d4ff',
      'Verse': '#00ff41',
      'Pre-Chorus': '#ffd700',
      'Chorus': '#ff6600',
      'Drop': '#ff3333',
      'Break': '#ff0080',
      'Bridge': '#cc00ff',
      'Outro': '#9b59b6',
      'Build-up': '#e74c3c',
      'Breakdown': '#f39c12',
    }
    return colors[seccionType] || '#00d4ff'
  }

  // ==================== RENDER ====================

  const isLoading = loading || localLoading

  return (
    <div className="track-analyzer">
      {/* HEADER */}
      <div className="analyzer-header">
        <button className="back-btn" onClick={onBack} disabled={isLoading}>
          ← Volver
        </button>
        <h2 className="analyzer-title">
          {trackId ? `Editar Track #${trackData.numeroTrack}` : 'Analizar Nuevo Track'}
        </h2>
      </div>

      {/* ERROR BANNER */}
      {(error || hookError) && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <p>{error || hookError}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* WIZARD STEP 1: INFO BÁSICA */}
      <div className="wizard-step basic-info-step">
        <h3 className="step-title">📋 Paso 1: Información Básica del Track</h3>
        
        <div className="basic-info-grid">
          {/* Numero Track (read-only si está asignado) */}
          <div className="form-group">
            <label className="form-label">Número de Track:</label>
            <input
              type="text"
              value={trackData.numeroTrack ? `#${trackData.numeroTrack}` : 'Se asignará automáticamente'}
              className="form-input track-number-display"
              disabled
            />
          </div>

          {/* Suno URL */}
          <div className="form-group full-width">
            <label className="form-label required">Suno URL:</label>
            <input
              type="url"
              value={trackData.sunoUrl}
              onChange={(e) => handleChange('sunoUrl', e.target.value)}
              placeholder="https://suno.com/song/..."
              className="form-input"
              disabled={isLoading}
            />
          </div>

          {/* Duración Real */}
          <div className="form-group">
            <label className="form-label required">Duración Real:</label>
            <input
              type="text"
              value={trackData.duracionReal}
              onChange={(e) => handleChange('duracionReal', e.target.value)}
              placeholder="3:45"
              className="form-input duration-input"
              disabled={isLoading}
            />
            <span className="hint">Formato: mm:ss</span>
          </div>

          {/* BPM Real */}
          <div className="form-group">
            <label className="form-label">BPM Real:</label>
            <input
              type="number"
              value={trackData.bpmReal}
              onChange={(e) => handleChange('bpmReal', e.target.value)}
              placeholder="170"
              min="20"
              max="300"
              className="form-input bpm-input"
              disabled={isLoading}
            />
            <span className="hint">Obtenido de DAW</span>
          </div>

          {/* Key Musical */}
          <div className="form-group">
            <label className="form-label">Key Musical:</label>
            <input
              type="text"
              value={trackData.keyMusical}
              onChange={(e) => handleChange('keyMusical', e.target.value)}
              placeholder="Am"
              className="form-input key-input"
              disabled={isLoading}
            />
            <span className="hint">Obtenido de DAW</span>
          </div>

          {/* Versión Suno */}
          <div className="form-group">
            <label className="form-label">Versión Suno:</label>
            <select
              value={trackData.sunoVersion}
              onChange={(e) => handleChange('sunoVersion', e.target.value)}
              className="form-select"
              disabled={isLoading}
            >
              <option value="v4.5">v4.5</option>
              <option value="v4.0">v4.0</option>
              <option value="v3.5">v3.5</option>
              <option value="v3.0">v3.0</option>
            </select>
          </div>
        </div>

        {/* CALIFICACIÓN */}
        <div className="rating-section">
          <label className="form-label">⭐ Calificación Individual:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(trackData.calificacionIndividual || 0) >= star ? 'active' : ''}`}
                onClick={() => handleRatingChange(star)}
                disabled={isLoading}
              >
                ⭐
              </button>
            ))}
          </div>
          <span className="rating-value">
            {trackData.calificacionIndividual ? `${trackData.calificacionIndividual}/10` : 'Sin calificar'}
          </span>
        </div>

        {/* TAGS */}
        <div className="tags-section">
          <label className="form-label">🏷️ Tags & Géneros:</label>
          <div className="tags-container">
            {trackData.tags.map((tag, index) => (
              <span key={index} className="tag-chip">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="tag-remove"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Agregar tag..."
              className="tag-input"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="add-tag-btn"
              disabled={isLoading || !tagInput.trim()}
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* MOMENTO NARRATIVO */}
        <div className="form-group full-width">
          <label className="form-label">📖 Momento Narrativo:</label>
          <textarea
            value={trackData.momentoNarrativo}
            onChange={(e) => handleChange('momentoNarrativo', e.target.value)}
            placeholder="Cuándo se usa este track en la historia (ej: Escena de persecución en capítulo 3)"
            rows={2}
            className="form-textarea"
            disabled={isLoading}
          />
        </div>

        {/* NOTAS TRACK */}
        <div className="form-group full-width">
          <label className="form-label">📝 Notas del Track:</label>
          <textarea
            value={trackData.notasTrack}
            onChange={(e) => handleChange('notasTrack', e.target.value)}
            placeholder="Notas sobre ajustes, secciones destacables, VRPs efectivos, etc."
            rows={3}
            className="form-textarea"
            disabled={isLoading}
          />
        </div>

        {/* BOTÓN GUARDAR INFO BÁSICA */}
        <div className="step-actions">
          <button
            type="button"
            onClick={handleSaveBasicInfo}
            className="btn primary save-basic-btn"
            disabled={isLoading || !trackData.sunoUrl || !trackData.duracionReal}
          >
            {isLoading ? 'Guardando...' : (isBasicInfoSaved ? '✓ Continuar al Análisis Avanzado' : 'Guardar y Continuar')}
          </button>
        </div>
      </div>

      {/* WIZARD STEP 2: ANÁLISIS AVANZADO (se habilita después de guardar) */}
      {isBasicInfoSaved && (
        <>
          {/* TABS */}
          <div className="analyzer-tabs">
            <button
              className={`tab-btn ${activeTab === 'estructura' ? 'active' : ''}`}
              onClick={() => setActiveTab('estructura')}
            >
              🎵 Estructura Temporal
            </button>
            <button
              className={`tab-btn ${activeTab === 'cuepoints' ? 'active' : ''}`}
              onClick={() => setActiveTab('cuepoints')}
            >
              📍 Cue Points
            </button>
          </div>

          {/* TAB CONTENT: ESTRUCTURA TEMPORAL */}
          {activeTab === 'estructura' && (
            <div className="tab-content estructura-tab">
              <div className="tab-header">
                <h3 className="tab-title">Estructura Temporal del Track</h3>
                <button
                  type="button"
                  onClick={handleAddEstructura}
                  className="add-btn"
                  disabled={isLoading}
                >
                  + Agregar Sección
                </button>
              </div>

              {trackData.estructura.length === 0 ? (
                <div className="empty-state">
                  <p>No hay secciones agregadas. Click en "+ Agregar Sección" para empezar.</p>
                </div>
              ) : (
                <div className="estructura-list">
                  {trackData.estructura.map((sec, index) => (
                    <div 
                      key={index} 
                      className="estructura-item"
                      style={{ borderLeftColor: getSectionColor(sec.seccion) }}
                    >
                      <div className="estructura-orden">#{sec.orden}</div>
                      
                      <div className="estructura-fields">
                        <div className="field-row">
                          <div className="field-group">
                            <label>Tipo:</label>
                            <select
                              value={sec.seccion}
                              onChange={(e) => handleUpdateEstructura(index, 'seccion', e.target.value)}
                              className="form-select"
                              disabled={isLoading}
                            >
                              <option value="Intro">Intro</option>
                              <option value="Verse">Verse</option>
                              <option value="Pre-Chorus">Pre-Chorus</option>
                              <option value="Chorus">Chorus</option>
                              <option value="Drop">Drop</option>
                              <option value="Break">Break</option>
                              <option value="Bridge">Bridge</option>
                              <option value="Outro">Outro</option>
                              <option value="Build-up">Build-up</option>
                              <option value="Breakdown">Breakdown</option>
                            </select>
                          </div>

                          <div className="field-group time-group">
                            <label>Inicio:</label>
                            <input
                              type="text"
                              value={sec.tiempoInicio}
                              onChange={(e) => handleUpdateEstructura(index, 'tiempoInicio', e.target.value)}
                              placeholder="0:00"
                              className="time-input"
                              disabled={isLoading}
                            />
                          </div>

                          <span className="time-separator">→</span>

                          <div className="field-group time-group">
                            <label>Fin:</label>
                            <input
                              type="text"
                              value={sec.tiempoFin}
                              onChange={(e) => handleUpdateEstructura(index, 'tiempoFin', e.target.value)}
                              placeholder="0:16"
                              className="time-input"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="duration-display">
                            {calculateDuration(sec)}s
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEstructura(index)}
                            className="remove-btn"
                            disabled={isLoading}
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="field-row full-width">
                          <div className="field-group full">
                            <label>Descripción:</label>
                            <input
                              type="text"
                              value={sec.descripcion}
                              onChange={(e) => handleUpdateEstructura(index, 'descripcion', e.target.value)}
                              placeholder="Descripción opcional de la sección"
                              className="form-input"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: CUE POINTS */}
          {activeTab === 'cuepoints' && (
            <div className="tab-content cuepoints-tab">
              <div className="tab-header">
                <h3 className="tab-title">Cue Points para DJ/Mixing</h3>
                <button
                  type="button"
                  onClick={handleAddCuePoint}
                  className="add-btn"
                  disabled={isLoading}
                >
                  + Agregar Cue Point
                </button>
              </div>

              {trackData.cuePoints.length === 0 ? (
                <div className="empty-state">
                  <p>No hay cue points. Click en "+ Agregar Cue Point" para marcar puntos importantes.</p>
                </div>
              ) : (
                <div className="cuepoints-list">
                  {trackData.cuePoints.map((cue, index) => (
                    <div key={index} className="cuepoint-item">
                      <div
                        className="cue-color-indicator"
                        style={{ backgroundColor: cue.color }}
                      />
                      
                      <div className="cuepoint-fields">
                        <div className="field-row">
                          <div className="field-group time-group">
                            <label>Tiempo:</label>
                            <input
                              type="text"
                              value={cue.tiempo}
                              onChange={(e) => handleUpdateCuePoint(index, 'tiempo', e.target.value)}
                              placeholder="0:15"
                              className="time-input"
                              disabled={isLoading}
                            />
                          </div>

                          <div className="field-group">
                            <label>Tipo:</label>
                            <select
                              value={cue.tipo}
                              onChange={(e) => handleUpdateCuePoint(index, 'tipo', e.target.value)}
                              className="form-select"
                              disabled={isLoading}
                            >
                              {Object.entries(CUE_POINT_TYPES).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="field-group flex-grow">
                            <label>Etiqueta:</label>
                            <input
                              type="text"
                              value={cue.etiqueta}
                              onChange={(e) => handleUpdateCuePoint(index, 'etiqueta', e.target.value)}
                              placeholder="Drop Start"
                              className="form-input"
                              disabled={isLoading}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCuePoint(index)}
                            className="remove-btn"
                            disabled={isLoading}
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="field-row full-width">
                          <div className="field-group full">
                            <label>Descripción:</label>
                            <input
                              type="text"
                              value={cue.descripcion}
                              onChange={(e) => handleUpdateCuePoint(index, 'descripcion', e.target.value)}
                              placeholder="Referencias, notas, qué sucede en este punto..."
                              className="form-input"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOTÓN GUARDAR TODO */}
          <div className="final-actions">
            <button
              type="button"
              onClick={onBack}
              className="btn secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAnalysis}
              className="btn primary save-all-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : '💾 Guardar Análisis Completo'}
            </button>
          </div>
        </>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-ring"></div>
        </div>
      )}
    </div>
  )
}

export default TrackAnalyzer