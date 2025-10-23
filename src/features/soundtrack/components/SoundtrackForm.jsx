// src/features/soundtrack/components/SoundtrackForm.jsx

import { useState, useEffect } from 'react'
import './SoundtrackForm.css'

/**
 * SoundtrackForm - Formulario SIMPLIFICADO para crear/editar prompts de Suno
 * 
 * RESPONSABILIDADES (REDUCIDAS):
 * - Solo campos que vienen de Suno al copiar el prompt
 * - NO incluye: BPM Real, Key, Duración Real, Estructura, CuePoints, Momento
 * - Esos campos ahora van a TrackAnalyzer
 * 
 * CAMPOS QUE QUEDARON:
 * - SongTitle (obligatorio)
 * - Lyrics (max 5000)
 * - StyleDescription (max 1000)
 * - ExcludedStyle (max 1000)
 * - Weirdness (0-100)
 * - StyleInfluence (0-100)
 * - VocalGender (male/female/neutral)
 * - Tags (array)
 * - Notas generales del prompt
 * 
 * PROPS:
 * @param {Object} initialData - Datos iniciales del prompt (opcional)
 * @param {Function} onSave - Callback al guardar
 * @param {Function} onCancel - Callback al cancelar
 * @param {boolean} isLoading - Estado de carga
 */

const SoundtrackForm = ({ initialData = null, onSave, onCancel, isLoading = false }) => {
  // ==================== ESTADO INICIAL ====================

  const getInitialFormData = () => {
    if (initialData) {
      return {
        songTitle: initialData.songTitle || '',
        lyrics: initialData.lyrics || '',
        styleDescription: initialData.styleDescription || '',
        excludedStyle: initialData.excludedStyle || '',
        weirdness: initialData.weirdness || 50,
        styleInfluence: initialData.styleInfluence || 50,
        vocalGender: initialData.vocalGender || null,
        tags: initialData.tags || [],
        notas: initialData.notas || '',
      }
    }

    return {
      songTitle: '',
      lyrics: '',
      styleDescription: '',
      excludedStyle: '',
      weirdness: 50,
      styleInfluence: 50,
      vocalGender: null,
      tags: [],
      notas: '',
    }
  }

  // ==================== ESTADOS ====================

  const [formData, setFormData] = useState(getInitialFormData())
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData())
    }
  }, [initialData])

  // ==================== VALIDACIONES ====================

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'songTitle':
        if (!value || value.trim() === '') {
          newErrors.songTitle = 'El título es obligatorio'
        } else if (value.length > 255) {
          newErrors.songTitle = 'Máximo 255 caracteres'
        } else {
          delete newErrors.songTitle
        }
        break

      case 'lyrics':
        if (value && value.length > 5000) {
          newErrors.lyrics = `Excede el límite (${value.length}/5000)`
        } else {
          delete newErrors.lyrics
        }
        break

      case 'styleDescription':
        if (value && value.length > 1000) {
          newErrors.styleDescription = `Excede el límite (${value.length}/1000)`
        } else {
          delete newErrors.styleDescription
        }
        break

      case 'excludedStyle':
        if (value && value.length > 1000) {
          newErrors.excludedStyle = `Excede el límite (${value.length}/1000)`
        } else {
          delete newErrors.excludedStyle
        }
        break

      case 'weirdness':
        const weirdness = Number(value)
        if (isNaN(weirdness) || weirdness < 0 || weirdness > 100) {
          newErrors.weirdness = 'Debe estar entre 0 y 100'
        } else {
          delete newErrors.weirdness
        }
        break

      case 'styleInfluence':
        const influence = Number(value)
        if (isNaN(influence) || influence < 0 || influence > 100) {
          newErrors.styleInfluence = 'Debe estar entre 0 y 100'
        } else {
          delete newErrors.styleInfluence
        }
        break

      default:
        break
    }

    setErrors(newErrors)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.songTitle || formData.songTitle.trim() === '') {
      newErrors.songTitle = 'El título es obligatorio'
    }

    if (formData.lyrics && formData.lyrics.length > 5000) {
      newErrors.lyrics = 'Excede el límite de 5000 caracteres'
    }

    if (formData.styleDescription && formData.styleDescription.length > 1000) {
      newErrors.styleDescription = 'Excede el límite de 1000 caracteres'
    }

    if (formData.excludedStyle && formData.excludedStyle.length > 1000) {
      newErrors.excludedStyle = 'Excede el límite de 1000 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ==================== HANDLERS - CAMPOS BÁSICOS ====================

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // ==================== HANDLERS - TAGS ====================

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // ==================== HANDLERS - SUBMIT ====================

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Marcar todos los campos como touched para mostrar errores
      setTouched({
        songTitle: true,
        lyrics: true,
        styleDescription: true,
        excludedStyle: true
      })
      return
    }

    if (onSave) {
      onSave(formData)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  // ==================== HELPERS ====================

  const getCharCount = (text, limit) => {
    const count = text ? text.length : 0
    const remaining = limit - count
    const isOverLimit = count > limit
    const percentage = Math.round((count / limit) * 100)

    return { count, remaining, isOverLimit, percentage }
  }

  const getGenreColor = () => {
    if (!formData.tags || formData.tags.length === 0) return '#00d4ff'

    const tag = formData.tags[0].toLowerCase()

    if (tag.includes('psytrance') || tag.includes('trance')) return '#ff6600'
    if (tag.includes('edm') || tag.includes('electronic')) return '#00ff41'
    if (tag.includes('ambient') || tag.includes('chill')) return '#ffd700'
    if (tag.includes('techno') || tag.includes('house')) return '#ff3333'
    if (tag.includes('cyberpunk') || tag.includes('cyber')) return '#ff0080'

    return '#00d4ff'
  }

  // ==================== RENDER CONSTANTS ====================

  const genreColor = getGenreColor()
  const lyricsInfo = getCharCount(formData.lyrics, 5000)
  const styleInfo = getCharCount(formData.styleDescription, 1000)
  const excludedInfo = getCharCount(formData.excludedStyle, 1000)

  // ==================== RENDER ====================

  return (
    <form className="soundtrack-form" onSubmit={handleSubmit}>
      {/* SONG TITLE */}
      <div className="form-section">
        <label className="form-label required">
          Song Title:
        </label>
        <input
          type="text"
          value={formData.songTitle}
          onChange={(e) => handleChange('songTitle', e.target.value)}
          onBlur={() => handleBlur('songTitle')}
          placeholder="Enter song title"
          className={`form-input song-title-input ${touched.songTitle && errors.songTitle ? 'error' : ''}`}
          disabled={isLoading}
        />
        {touched.songTitle && errors.songTitle && (
          <span className="error-message">{errors.songTitle}</span>
        )}
      </div>

      {/* LYRICS */}
      <div className="form-section">
        <label className="form-label">
          Lyrics:
          <span className={`char-counter ${lyricsInfo.isOverLimit ? 'over-limit' : ''}`}>
            {lyricsInfo.count}/5000 ({lyricsInfo.remaining} restantes)
          </span>
        </label>
        <textarea
          value={formData.lyrics}
          onChange={(e) => handleChange('lyrics', e.target.value)}
          onBlur={() => handleBlur('lyrics')}
          placeholder="Add your own lyrics here"
          rows={8}
          className={`form-textarea lyrics-textarea ${touched.lyrics && errors.lyrics ? 'error' : ''}`}
          maxLength={5000}
          disabled={isLoading}
        />
        {touched.lyrics && errors.lyrics && (
          <span className="error-message">{errors.lyrics}</span>
        )}
        <div className="char-progress-bar">
          <div 
            className="char-progress-fill"
            style={{ 
              width: `${lyricsInfo.percentage}%`,
              backgroundColor: lyricsInfo.isOverLimit ? '#ff3333' : '#00d4ff'
            }}
          />
        </div>
      </div>

      {/* STYLE DESCRIPTION */}
      <div className="form-section">
        <label className="form-label">
          Style Description:
          <span className={`char-counter ${styleInfo.isOverLimit ? 'over-limit' : ''}`}>
            {styleInfo.count}/1000 ({styleInfo.remaining} restantes)
          </span>
        </label>
        <textarea
          value={formData.styleDescription}
          onChange={(e) => handleChange('styleDescription', e.target.value)}
          onBlur={() => handleBlur('styleDescription')}
          placeholder="Enter style description"
          rows={4}
          className={`form-textarea style-description-textarea ${touched.styleDescription && errors.styleDescription ? 'error' : ''}`}
          maxLength={1000}
          disabled={isLoading}
        />
        {touched.styleDescription && errors.styleDescription && (
          <span className="error-message">{errors.styleDescription}</span>
        )}
        <div className="char-progress-bar">
          <div 
            className="char-progress-fill"
            style={{ 
              width: `${styleInfo.percentage}%`,
              backgroundColor: styleInfo.isOverLimit ? '#ff3333' : '#00ff41'
            }}
          />
        </div>
      </div>

      {/* EXCLUDED STYLE */}
      <div className="form-section">
        <label className="form-label">
          Exclude Styles:
          <span className={`char-counter ${excludedInfo.isOverLimit ? 'over-limit' : ''}`}>
            {excludedInfo.count}/1000 ({excludedInfo.remaining} restantes)
          </span>
        </label>
        <textarea
          value={formData.excludedStyle}
          onChange={(e) => handleChange('excludedStyle', e.target.value)}
          onBlur={() => handleBlur('excludedStyle')}
          placeholder="Exclude styles"
          rows={3}
          className={`form-textarea excluded-style-textarea ${touched.excludedStyle && errors.excludedStyle ? 'error' : ''}`}
          maxLength={1000}
          disabled={isLoading}
        />
        {touched.excludedStyle && errors.excludedStyle && (
          <span className="error-message">{errors.excludedStyle}</span>
        )}
        <div className="char-progress-bar">
          <div 
            className="char-progress-fill"
            style={{ 
              width: `${excludedInfo.percentage}%`,
              backgroundColor: excludedInfo.isOverLimit ? '#ff3333' : '#ff3333'
            }}
          />
        </div>
      </div>

      {/* SLIDERS */}
      <div className="form-section sliders-section">
        <div className="slider-group">
          <label className="form-label">
            Weirdness: {formData.weirdness}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.weirdness}
            onChange={(e) => handleChange('weirdness', e.target.value)}
            className="slider weirdness-slider"
            disabled={isLoading}
          />
        </div>

        <div className="slider-group">
          <label className="form-label">
            Style Influence: {formData.styleInfluence}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.styleInfluence}
            onChange={(e) => handleChange('styleInfluence', e.target.value)}
            className="slider style-influence-slider"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* VOCAL GENDER */}
      <div className="form-section">
        <label className="form-label">Vocal Gender:</label>
        <select
          value={formData.vocalGender || ''}
          onChange={(e) => handleChange('vocalGender', e.target.value || null)}
          className="form-select"
          disabled={isLoading}
        >
          <option value="">Sin especificar</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      {/* TAGS */}
      <div className="form-section tags-section">
        <label className="form-label">🏷️ Tags & Géneros:</label>
        <div className="tags-container">
          {formData.tags.map((tag, index) => (
            <span 
              key={index} 
              className="tag-chip"
              style={{ borderColor: genreColor }}
            >
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

      {/* NOTAS GENERALES */}
      <div className="form-section">
        <label className="form-label">📝 Notas Generales del Prompt:</label>
        <textarea
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          placeholder="Notas generales sobre este prompt (contexto, experimentos, variaciones que has probado, etc.)"
          rows={3}
          className="form-textarea notes-textarea"
          disabled={isLoading}
        />
      </div>

      {/* FORM ACTIONS */}
      <div className="form-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="btn secondary"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn primary"
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Crear Prompt')}
        </button>
      </div>
    </form>
  )
}

export default SoundtrackForm