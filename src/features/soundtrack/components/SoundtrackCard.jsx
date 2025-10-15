// src/features/soundtrack/components/SoundtrackCard.jsx

import { useState } from 'react'
import './SoundtrackCard.css'

/**
 * SoundtrackCard - Tarjeta de preview para un prompt de Suno
 * 
 * RESPONSABILIDADES:
 * - Mostrar preview del prompt (título, tags, rating)
 * - Click para abrir detalle completo
 * - Diseño ciberpunk con colores según género
 * - Indicadores visuales de características
 * 
 * PROPS:
 * @param {Object} prompt - Datos del prompt
 * @param {Function} onClick - Callback al hacer click
 * @param {Function} onRate - Callback para calificar (opcional)
 * @param {Function} onDuplicate - Callback para duplicar (opcional)
 */

const SoundtrackCard = ({ prompt, onClick, onRate, onDuplicate }) => {
  const [isHovered, setIsHovered] = useState(false)

  // ==================== HELPERS ====================

  /**
   * Obtener color según el género principal
   */
  const getGenreColor = () => {
    if (!prompt.tags || prompt.tags.length === 0) return '#00d4ff'
    
    const tag = prompt.tags[0].toLowerCase()
    
    if (tag.includes('psytrance') || tag.includes('trance')) return '#ff6600'
    if (tag.includes('edm') || tag.includes('electronic')) return '#00ff41'
    if (tag.includes('ambient') || tag.includes('chill')) return '#ffd700'
    if (tag.includes('techno') || tag.includes('house')) return '#ff3333'
    if (tag.includes('cyberpunk') || tag.includes('cyber')) return '#ff0080'
    if (tag.includes('drum') || tag.includes('bass')) return '#00d4ff'
    if (tag.includes('dubstep')) return '#9933ff'
    
    return '#00d4ff' // Default azul ciberpunk
  }

  /**
   * Obtener preview de lyrics (primeras 50 palabras)
   */
  const getLyricsPreview = () => {
    if (!prompt.lyrics) return 'Sin lyrics'
    
    const words = prompt.lyrics.split(/\s+/)
    if (words.length <= 50) return prompt.lyrics
    
    return words.slice(0, 50).join(' ') + '...'
  }

  /**
   * Calcular porcentaje de uso de caracteres en lyrics
   */
  const getLyricsUsage = () => {
    if (!prompt.lyrics) return 0
    return Math.round((prompt.lyrics.length / 5000) * 100)
  }

  /**
   * Obtener versión de Suno
   */
  const getSunoVersion = () => {
    return prompt.version || 'v4.5'
  }

  /**
   * Formatear fecha de creación
   */
  const getFormattedDate = () => {
    if (!prompt.createdAt) return ''
    
    const date = new Date(prompt.createdAt)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  /**
   * Obtener estrellas de rating
   */
  const getRatingStars = () => {
    const rating = prompt.calificacion || 0
    return '⭐'.repeat(rating)
  }

  /**
   * Verificar si tiene características especiales
   */
  const hasStructure = () => {
    return prompt.estructura && prompt.estructura.length > 0
  }

  const hasCuePoints = () => {
    return prompt.cuePoints && prompt.cuePoints.length > 0
  }

  const hasExcludedStyles = () => {
    return prompt.excludedStyle && prompt.excludedStyle.trim().length > 0
  }

  // ==================== HANDLERS ====================

  const handleClick = () => {
    if (onClick) {
      onClick(prompt)
    }
  }

  const handleRateClick = (e, rating) => {
    e.stopPropagation() // Evitar trigger del onClick del card
    if (onRate) {
      onRate(prompt.id, rating)
    }
  }

  const handleDuplicateClick = (e) => {
    e.stopPropagation()
    if (onDuplicate) {
      onDuplicate(prompt.id)
    }
  }

  // ==================== RENDER ====================

  const genreColor = getGenreColor()

  return (
    <div 
      className={`soundtrack-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderLeftColor: genreColor }}
    >
      {/* HEADER */}
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title" style={{ color: genreColor }}>
            {prompt.songTitle || 'Sin título'}
          </h3>
          <span className="suno-version">{getSunoVersion()}</span>
        </div>
        
        {/* Quick Actions */}
        {isHovered && (
          <div className="card-quick-actions">
            <button 
              className="quick-action-btn duplicate"
              onClick={handleDuplicateClick}
              title="Duplicar prompt"
            >
              📋
            </button>
          </div>
        )}
      </div>

      {/* TAGS */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="card-tags">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="card-tag"
              style={{ borderColor: genreColor }}
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="card-tag-more">+{prompt.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* LYRICS PREVIEW */}
      <div className="card-lyrics-preview">
        <p>{getLyricsPreview()}</p>
        <div className="lyrics-usage-bar">
          <div 
            className="lyrics-usage-fill"
            style={{ 
              width: `${getLyricsUsage()}%`,
              backgroundColor: genreColor
            }}
          />
        </div>
        <span className="lyrics-usage-text">
          {prompt.lyrics?.length || 0}/5000 caracteres
        </span>
      </div>

      {/* TECHNICAL INFO */}
      <div className="card-technical">
        {prompt.bpm && (
          <div className="tech-item">
            <span className="tech-label">BPM:</span>
            <span className="tech-value" style={{ color: genreColor }}>{prompt.bpm}</span>
          </div>
        )}
        {prompt.key && (
          <div className="tech-item">
            <span className="tech-label">Key:</span>
            <span className="tech-value" style={{ color: genreColor }}>{prompt.key}</span>
          </div>
        )}
        {prompt.duracion && (
          <div className="tech-item">
            <span className="tech-label">Duración:</span>
            <span className="tech-value">{prompt.duracion}</span>
          </div>
        )}
      </div>

      {/* ADVANCED SETTINGS INDICATORS */}
      <div className="card-advanced-settings">
        <div className="setting-indicator">
          <span className="setting-label">Weirdness:</span>
          <div className="setting-bar">
            <div 
              className="setting-bar-fill weirdness"
              style={{ width: `${prompt.weirdness || 50}%` }}
            />
          </div>
          <span className="setting-value">{prompt.weirdness || 50}%</span>
        </div>
        <div className="setting-indicator">
          <span className="setting-label">Style Influence:</span>
          <div className="setting-bar">
            <div 
              className="setting-bar-fill style-influence"
              style={{ width: `${prompt.styleInfluence || 50}%` }}
            />
          </div>
          <span className="setting-value">{prompt.styleInfluence || 50}%</span>
        </div>
      </div>

      {/* FEATURES BADGES */}
      <div className="card-features">
        {hasStructure() && (
          <span className="feature-badge" title="Tiene estructura temporal">
            📊 Estructura
          </span>
        )}
        {hasCuePoints() && (
          <span className="feature-badge" title="Tiene cue points">
            🎯 Cue Points
          </span>
        )}
        {hasExcludedStyles() && (
          <span className="feature-badge" title="Tiene estilos excluidos">
            🚫 Excluded
          </span>
        )}
        {prompt.sunoUrl && (
          <span className="feature-badge" title="Tiene URL de Suno">
            🔗 Suno
          </span>
        )}
      </div>

      {/* RATING */}
      <div className="card-rating">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
            <button
              key={star}
              className={`star-btn ${(prompt.calificacion || 0) >= star ? 'active' : ''}`}
              onClick={(e) => handleRateClick(e, star)}
              style={{ 
                color: (prompt.calificacion || 0) >= star ? genreColor : 'rgba(255,255,255,0.2)'
              }}
            >
              ⭐
            </button>
          ))}
        </div>
        <span className="rating-text">
          {prompt.calificacion ? `${prompt.calificacion}/10` : 'Sin calificar'}
        </span>
      </div>

      {/* FOOTER */}
      <div className="card-footer">
        <span className="card-date">{getFormattedDate()}</span>
        {prompt.momento && (
          <span className="card-momento" title={prompt.momento}>
            🎬 {prompt.momento.slice(0, 30)}{prompt.momento.length > 30 ? '...' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

export default SoundtrackCard