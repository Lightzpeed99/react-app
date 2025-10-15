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
 * - Navegación de vuelta al catálogo
 * 
 * PROPS:
 * @param {Object} prompt - Datos del prompt a mostrar
 * @param {Function} onBack - Callback para volver al catálogo
 * @param {Function} onEdit - Callback al guardar edición
 * @param {Function} onDelete - Callback al eliminar
 */

const SoundtrackDetail = ({ prompt, onBack, onEdit, onDelete }) => {
  // ==================== HOOKS ====================
  
  const {
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

  // ==================== HANDLERS ====================

  const handleEdit = () => {
    setIsEditMode(true)
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setCurrentPrompt(prompt)
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

      // Actualizar en el service
      const updated = await updatePrompt(currentPrompt.id, updatedData)
      setCurrentPrompt(updated)
      setIsEditMode(false)

      if (onEdit) {
        onEdit(updated)
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
        onEdit(duplicated) // Navegar al duplicado
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
      // Podría agregar un toast notification aquí
      console.log(`${label} copiado al portapapeles`)
    }).catch(err => {
      console.error('Error al copiar:', err)
    })
  }

  // ==================== HELPERS ====================

  const getGenreColor = () => {
    if (!currentPrompt.tags || currentPrompt.tags.length === 0) return '#00d4ff'
    
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

  // ==================== RENDER ====================

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

  const genreColor = getGenreColor()

  // Si está en modo edición, mostrar el formulario
  if (isEditMode) {
    return (
      <div className="soundtrack-detail edit-mode">
        <div className="detail-header">
          <button className="back-btn" onClick={handleCancelEdit}>
            ← Cancelar Edición
          </button>
          <h2 className="detail-title">Editando Prompt</h2>
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

  // Modo lectura
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
            <div className="title-meta">
              <span className="version-badge">{currentPrompt.version || 'v4.5'}</span>
              {currentPrompt.duracion && (
                <span className="duration-badge">⏱️ {currentPrompt.duracion}</span>
              )}
            </div>
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

          {/* ESTRUCTURA TEMPORAL */}
          {currentPrompt.estructura && currentPrompt.estructura.length > 0 && (
            <div className="section estructura-section">
              <h3 className="section-title">📊 Estructura Musical</h3>
              <div className="estructura-timeline">
                {currentPrompt.estructura.map((seccion, index) => (
                  <div key={index} className="estructura-item">
                    <div className="estructura-time">
                      {seccion.inicio} - {seccion.fin}
                    </div>
                    <div className="estructura-content">
                      <span className="estructura-seccion">{seccion.seccion}</span>
                      {seccion.descripcion && (
                        <span className="estructura-desc">{seccion.descripcion}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUE POINTS */}
          {currentPrompt.cuePoints && currentPrompt.cuePoints.length > 0 && (
            <div className="section cuepoints-section">
              <h3 className="section-title">🎯 Cue Points</h3>
              <div className="cuepoints-list">
                {currentPrompt.cuePoints.map((cue, index) => (
                  <div key={index} className="cuepoint-item">
                    <div 
                      className="cue-color"
                      style={{ backgroundColor: cue.color || '#00d4ff' }}
                    />
                    <span className="cue-time">{cue.tiempo}</span>
                    <span className="cue-tipo">{cue.tipo}</span>
                    {cue.etiqueta && (
                      <span className="cue-label">{cue.etiqueta}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MOMENTO NARRATIVO */}
          {currentPrompt.momento && (
            <div className="section momento-section">
              <h3 className="section-title">🎬 Momento Narrativo</h3>
              <div className="momento-display">
                <p>{currentPrompt.momento}</p>
              </div>
            </div>
          )}

          {/* NOTAS */}
          {currentPrompt.notas && (
            <div className="section notas-section">
              <h3 className="section-title">📝 Notas & Variaciones</h3>
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

          {/* TECHNICAL INFO */}
          <div className="sidebar-section technical-section">
            <h3 className="sidebar-title">⚙️ Información Técnica</h3>
            <div className="technical-grid">
              {currentPrompt.bpm && (
                <div className="tech-row">
                  <span className="tech-label">BPM:</span>
                  <span className="tech-value" style={{ color: genreColor }}>
                    {currentPrompt.bpm}
                  </span>
                </div>
              )}
              {currentPrompt.key && (
                <div className="tech-row">
                  <span className="tech-label">Key:</span>
                  <span className="tech-value" style={{ color: genreColor }}>
                    {currentPrompt.key}
                  </span>
                </div>
              )}
              {currentPrompt.duracion && (
                <div className="tech-row">
                  <span className="tech-label">Duración:</span>
                  <span className="tech-value">{currentPrompt.duracion}</span>
                </div>
              )}
              {currentPrompt.version && (
                <div className="tech-row">
                  <span className="tech-label">Versión:</span>
                  <span className="tech-value">{currentPrompt.version}</span>
                </div>
              )}
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
            </div>
          </div>

          {/* SUNO URL */}
          {currentPrompt.sunoUrl && (
            <div className="sidebar-section suno-url-section">
              <h3 className="sidebar-title">🔗 Suno</h3>
              <a 
                href={currentPrompt.sunoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="suno-link"
              >
                Abrir en Suno →
              </a>
            </div>
          )}

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