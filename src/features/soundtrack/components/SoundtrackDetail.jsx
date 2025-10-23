// src/features/soundtrack/components/SoundtrackDetail.jsx

import { useState, useEffect } from 'react'
import { useSoundtrack } from '../hooks/useSoundtrack'
import SoundtrackForm from './SoundtrackForm'
import './SoundtrackDetail.css'

/**
 * SoundtrackDetail - Vista completa de un prompt de Suno
 * 
 * RESPONSABILIDADES:
 * - Mostrar todos los detalles de un prompt
 * - Modo lectura vs modo edición
 * - Acciones: Editar, Duplicar, Eliminar, Calificar
 * - ⭐ NUEVO: Botones para abrir los 3 analyzers
 * - ⭐ NUEVO: Lista de ResultadoTracks analizados
 * 
 * PROPS:
 * @param {Object} prompt - Datos del prompt a mostrar
 * @param {Function} onBack - Callback para volver al catálogo
 * @param {Function} onEdit - Callback al guardar edición
 * @param {Function} onDelete - Callback al eliminar
 * @param {Function} onNavigateToAnalyzer - ⭐ NUEVO: Callback para navegar a analyzers
 */

const SoundtrackDetail = ({ 
  prompt, 
  onBack, 
  onEdit, 
  onDelete,
  onNavigateToAnalyzer // ⭐ NUEVO PROP
}) => {
  // ==================== HOOKS ====================
  
  const {
    createPrompt,
    updatePrompt,
    deletePrompt,
    duplicatePrompt,
    ratePrompt,
    validatePrompt,
    checkCharacterLimits
  } = useSoundtrack()

  // ==================== ESTADOS ====================

  const [isEditMode, setIsEditMode] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(prompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [charLimits, setCharLimits] = useState({})

  // ==================== EFFECTS ====================

  useEffect(() => {
    setCurrentPrompt(prompt)
    if (prompt) {
      const limits = checkCharacterLimits(prompt)
      setCharLimits(limits)
    }
  }, [prompt, checkCharacterLimits])

  // Activar modo edición automáticamente si no hay prompt (crear nuevo)
  useEffect(() => {
    if (!prompt) {
      setIsEditMode(true)
    }
  }, [prompt])

  // ==================== HANDLERS ====================

  const handleEdit = () => {
    setIsEditMode(true)
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    
    // Si estamos creando (no hay prompt original), volver al catálogo
    if (!prompt) {
      if (onBack) {
        onBack()
      }
    } else {
      // Si estamos editando, restaurar datos originales
      setCurrentPrompt(prompt)
    }
    
    setError(null)
  }

  const handleSaveEdit = async (updatedData) => {
    setLoading(true)
    setError(null)

    try {
      // Validar antes de guardar
      const validation = validatePrompt(updatedData)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      let savedPrompt;

      if (currentPrompt && currentPrompt.id) {
        // EDITAR: Actualizar prompt existente
        savedPrompt = await updatePrompt(currentPrompt.id, updatedData)
      } else {
        // CREAR: Nuevo prompt
        savedPrompt = await createPrompt(updatedData)
      }

      setCurrentPrompt(savedPrompt)
      setIsEditMode(false)

      if (onEdit) {
        onEdit(savedPrompt)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error saving prompt:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async () => {
    setLoading(true)
    setError(null)

    try {
      const duplicated = await duplicatePrompt(currentPrompt.id)
      
      if (onEdit) {
        onEdit(duplicated)
      }
    } catch (err) {
      setError(`Error al duplicar: ${err.message}`)
      console.error('Error duplicating prompt:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      await deletePrompt(currentPrompt.id)
      
      if (onDelete) {
        onDelete(currentPrompt.id)
      }
      
      if (onBack) {
        onBack()
      }
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`)
      console.error('Error deleting prompt:', err)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleRate = async (rating) => {
    try {
      const updated = await ratePrompt(currentPrompt.id, rating)
      setCurrentPrompt(updated)
    } catch (err) {
      setError(`Error al calificar: ${err.message}`)
      console.error('Error rating prompt:', err)
    }
  }

  const handleExportPrompt = () => {
    const dataStr = JSON.stringify(currentPrompt, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${currentPrompt.songTitle || 'prompt'}_${currentPrompt.id}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${label} copiado al portapapeles`)
    }).catch(err => {
      console.error('Error al copiar:', err)
    })
  }

  // ==================== ⭐ NUEVOS HANDLERS PARA ANALYZERS ====================

  const handleAnalyzeTrack = () => {
    if (onNavigateToAnalyzer) {
      onNavigateToAnalyzer('track', currentPrompt.id)
    }
  }

  const handleViewTrackAnalysis = (trackId) => {
    if (onNavigateToAnalyzer) {
      onNavigateToAnalyzer('track', currentPrompt.id, trackId)
    }
  }

  const handleAnalyzeLyrics = () => {
    if (onNavigateToAnalyzer) {
      onNavigateToAnalyzer('lyrics', currentPrompt.id)
    }
  }

  const handleAnalyzeStyle = () => {
    if (onNavigateToAnalyzer) {
      onNavigateToAnalyzer('style', currentPrompt.id)
    }
  }

  // ==================== HELPERS ====================

  const getGenreColor = () => {
    if (!currentPrompt || !currentPrompt.tags || currentPrompt.tags.length === 0) return '#00d4ff'
    
    const tag = currentPrompt.tags[0].toLowerCase()
    
    if (tag.includes('psytrance') || tag.includes('trance')) return '#ff6600'
    if (tag.includes('edm') || tag.includes('electronic')) return '#00ff41'
    if (tag.includes('ambient') || tag.includes('chill')) return '#ffd700'
    if (tag.includes('techno') || tag.includes('house')) return '#ff3333'
    if (tag.includes('cyberpunk') || tag.includes('cyber')) return '#ff0080'
    
    return '#00d4ff'
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getResultadoTracksCount = () => {
    if (!currentPrompt || !currentPrompt.resultadoTracks) return 0
    return currentPrompt.resultadoTracks.length
  }

  // ==================== RENDER ====================

  const genreColor = getGenreColor()

  // MODO EDICIÓN/CREACIÓN: Mostrar formulario
  if (isEditMode) {
    return (
      <div className="soundtrack-detail edit-mode">
        <div className="detail-header">
          <button className="back-btn" onClick={handleCancelEdit}>
            ← Cancelar {currentPrompt ? 'Edición' : 'Creación'}
          </button>
          <h2 className="detail-title">
            {currentPrompt ? 'Editando Prompt' : 'Creando Nuevo Prompt'}
          </h2>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <SoundtrackForm
          initialData={currentPrompt}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isLoading={loading}
        />
      </div>
    )
  }

  // Si no hay prompt Y no está en modo edición, mostrar error
  if (!currentPrompt) {
    return (
      <div className="soundtrack-detail error">
        <div className="error-container">
          <h2>Prompt no encontrado</h2>
          <button className="btn secondary" onClick={onBack}>
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  // MODO LECTURA: Mostrar detalle completo
  return (
    <div className="soundtrack-detail" style={{ borderTopColor: genreColor }}>
      {/* HEADER */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver al Catálogo
        </button>
        
        <div className="header-actions">
          <button 
            className="action-btn edit"
            onClick={handleEdit}
            disabled={loading}
          >
            ✏️ Editar
          </button>
          <button 
            className="action-btn duplicate"
            onClick={handleDuplicate}
            disabled={loading}
          >
            📋 Duplicar
          </button>
          <button 
            className="action-btn export"
            onClick={handleExportPrompt}
            disabled={loading}
          >
            💾 Exportar
          </button>
          <button 
            className="action-btn delete"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="detail-content">
        {/* LEFT COLUMN - MAIN INFO */}
        <div className="detail-main">
          {/* TITLE SECTION */}
          <div className="section title-section">
            <h1 className="song-title" style={{ color: genreColor }}>
              {currentPrompt.songTitle || 'Sin título'}
            </h1>
          </div>

          {/* TAGS */}
          {currentPrompt.tags && currentPrompt.tags.length > 0 && (
            <div className="section tags-section">
              <h3 className="section-title">🏷️ Tags & Géneros</h3>
              <div className="tags-display">
                {currentPrompt.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="tag-display"
                    style={{ borderColor: genreColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LYRICS */}
          {currentPrompt.lyrics && (
            <div className="section lyrics-section">
              <div className="section-header">
                <h3 className="section-title">📝 Lyrics</h3>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopyToClipboard(currentPrompt.lyrics, 'Lyrics')}
                >
                  📋 Copiar
                </button>
              </div>
              <div className="lyrics-display">
                <pre>{currentPrompt.lyrics}</pre>
              </div>
              <div className="char-info">
                {currentPrompt.lyrics.length}/5000 caracteres
                {charLimits.lyrics && (
                  <span className="warning"> ⚠️ {charLimits.lyrics}</span>
                )}
              </div>
            </div>
          )}

          {/* STYLE DESCRIPTION */}
          {currentPrompt.styleDescription && (
            <div className="section style-section">
              <div className="section-header">
                <h3 className="section-title">🎨 Style Description</h3>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopyToClipboard(currentPrompt.styleDescription, 'Style')}
                >
                  📋 Copiar
                </button>
              </div>
              <div className="style-display">
                <p>{currentPrompt.styleDescription}</p>
              </div>
              <div className="char-info">
                {currentPrompt.styleDescription.length}/1000 caracteres
                {charLimits.styleDescription && (
                  <span className="warning"> ⚠️ {charLimits.styleDescription}</span>
                )}
              </div>
            </div>
          )}

          {/* EXCLUDED STYLE */}
          {currentPrompt.excludedStyle && (
            <div className="section excluded-section">
              <div className="section-header">
                <h3 className="section-title">🚫 Excluded Styles</h3>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopyToClipboard(currentPrompt.excludedStyle, 'Excluded')}
                >
                  📋 Copiar
                </button>
              </div>
              <div className="excluded-display">
                <p>{currentPrompt.excludedStyle}</p>
              </div>
              <div className="char-info">
                {currentPrompt.excludedStyle.length}/1000 caracteres
                {charLimits.excludedStyle && (
                  <span className="warning"> ⚠️ {charLimits.excludedStyle}</span>
                )}
              </div>
            </div>
          )}

          {/* ⭐ NUEVO: ANALYZERS SECTION */}
          <div className="section analyzers-section">
            <h3 className="section-title">🔬 Análisis Avanzado</h3>
            <div className="analyzers-grid">
              <button 
                className="analyzer-card-btn"
                onClick={handleAnalyzeLyrics}
                disabled={!currentPrompt.lyrics}
              >
                <span className="analyzer-icon">📝</span>
                <div className="analyzer-info">
                  <h4>Lyrics Analyzer</h4>
                  <p>Mapear secciones y VRPs con sistema SEMT</p>
                </div>
              </button>

              <button 
                className="analyzer-card-btn"
                onClick={handleAnalyzeStyle}
                disabled={!currentPrompt.styleDescription}
              >
                <span className="analyzer-icon">🎨</span>
                <div className="analyzer-info">
                  <h4>Style Analyzer</h4>
                  <p>Extraer descriptores y categorías</p>
                </div>
              </button>

              <button 
                className="analyzer-card-btn"
                onClick={handleAnalyzeTrack}
              >
                <span className="analyzer-icon">🎵</span>
                <div className="analyzer-info">
                  <h4>Track Analyzer</h4>
                  <p>Analizar track generado ({getResultadoTracksCount()} analizados)</p>
                </div>
              </button>
            </div>
          </div>

          {/* ⭐ NUEVO: RESULTADO TRACKS */}
          {currentPrompt.resultadoTracks && currentPrompt.resultadoTracks.length > 0 && (
            <div className="section tracks-section">
              <h3 className="section-title">🎧 Tracks Analizados</h3>
              <div className="tracks-list">
                {currentPrompt.resultadoTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="track-card"
                    onClick={() => handleViewTrackAnalysis(track.id)}
                  >
                    <div className="track-header">
                      <span className="track-number">Track #{track.numeroTrack}</span>
                      {track.calificacionIndividual && (
                        <span className="track-rating">
                          ⭐ {track.calificacionIndividual}/10
                        </span>
                      )}
                    </div>
                    <div className="track-info">
                      {track.duracionReal && (
                        <span className="track-duration">⏱️ {track.duracionReal}</span>
                      )}
                      {track.bpmReal && (
                        <span className="track-bpm">🥁 {track.bpmReal} BPM</span>
                      )}
                      {track.keyMusical && (
                        <span className="track-key">🎹 {track.keyMusical}</span>
                      )}
                    </div>
                    {track.momentoNarrativo && (
                      <p className="track-momento">{track.momentoNarrativo}</p>
                    )}
                    {track.sunoUrl && (
                      <a 
                        href={track.sunoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="track-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 Ver en Suno
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTAS */}
          {currentPrompt.notas && (
            <div className="section notas-section">
              <h3 className="section-title">📝 Notas Generales</h3>
              <div className="notas-display">
                <pre>{currentPrompt.notas}</pre>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="detail-sidebar">
          {/* RATING */}
          <div className="sidebar-section rating-section">
            <h3 className="sidebar-title">⭐ Calificación</h3>
            <div className="rating-display">
              <div className="rating-stars-large">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <button
                    key={star}
                    className={`star-btn-large ${(currentPrompt.calificacion || 0) >= star ? 'active' : ''}`}
                    onClick={() => handleRate(star)}
                    style={{ 
                      color: (currentPrompt.calificacion || 0) >= star ? genreColor : 'rgba(255,255,255,0.2)'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <div className="rating-value">
                {currentPrompt.calificacion ? `${currentPrompt.calificacion}/10` : 'Sin calificar'}
              </div>
            </div>
          </div>

          {/* ADVANCED SETTINGS */}
          <div className="sidebar-section advanced-section">
            <h3 className="sidebar-title">🎛️ Advanced Settings</h3>
            <div className="advanced-display">
              <div className="setting-display">
                <span className="setting-label">Weirdness:</span>
                <div className="setting-bar-container">
                  <div className="setting-bar">
                    <div 
                      className="setting-fill weirdness"
                      style={{ width: `${currentPrompt.weirdness || 50}%` }}
                    />
                  </div>
                  <span className="setting-percent">{currentPrompt.weirdness || 50}%</span>
                </div>
              </div>
              <div className="setting-display">
                <span className="setting-label">Style Influence:</span>
                <div className="setting-bar-container">
                  <div className="setting-bar">
                    <div 
                      className="setting-fill style-influence"
                      style={{ width: `${currentPrompt.styleInfluence || 50}%` }}
                    />
                  </div>
                  <span className="setting-percent">{currentPrompt.styleInfluence || 50}%</span>
                </div>
              </div>
              {currentPrompt.vocalGender && (
                <div className="setting-display">
                  <span className="setting-label">Vocal Gender:</span>
                  <span className="setting-value">{currentPrompt.vocalGender}</span>
                </div>
              )}
            </div>
          </div>

          {/* METADATA */}
          <div className="sidebar-section metadata-section">
            <h3 className="sidebar-title">📅 Metadata</h3>
            <div className="metadata-grid">
              {currentPrompt.createdAt && (
                <div className="metadata-row">
                  <span className="metadata-label">Creado:</span>
                  <span className="metadata-value">
                    {formatDate(currentPrompt.createdAt)}
                  </span>
                </div>
              )}
              {currentPrompt.updatedAt && (
                <div className="metadata-row">
                  <span className="metadata-label">Actualizado:</span>
                  <span className="metadata-value">
                    {formatDate(currentPrompt.updatedAt)}
                  </span>
                </div>
              )}
              <div className="metadata-row">
                <span className="metadata-label">ID:</span>
                <span className="metadata-value metadata-id">
                  {currentPrompt.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <span className="delete-icon">⚠️</span>
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="delete-modal-content">
              <p>¿Estás seguro de que deseas eliminar este prompt?</p>
              <p className="delete-warning">
                <strong>"{currentPrompt.songTitle || 'Sin título'}"</strong>
              </p>
              <p className="delete-info">Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="btn secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn danger"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar Definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-ring"></div>
        </div>
      )}
    </div>
  )
}

export default SoundtrackDetail