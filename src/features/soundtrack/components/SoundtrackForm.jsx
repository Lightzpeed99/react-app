// src/features/soundtrack/components/SoundtrackForm.jsx

import { useState, useEffect } from 'react'
import './SoundtrackForm.css'

/**
 * SoundtrackForm - Formulario completo para crear/editar prompts de Suno
 * 
 * RESPONSABILIDADES:
 * - Todos los campos de Suno (extraídos de ComponentRenderer)
 * - Validaciones en tiempo real
 * - Contadores de caracteres
 * - Gestión de tags, estructura, cue points
 * - Sliders de Weirdness y Style Influence
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
        version: initialData.version || 'v4.5',
        duracion: initialData.duracion || '3:30',
        sunoUrl: initialData.sunoUrl || '',
        bpm: initialData.bpm || '',
        key: initialData.key || '',
        tags: initialData.tags || [],
        momento: initialData.momento || '',
        notas: initialData.notas || '',
        estructura: initialData.estructura || [],
        cuePoints: initialData.cuePoints || [],
      }
    }

    return {
      songTitle: '',
      lyrics: '',
      styleDescription: '',
      excludedStyle: '',
      weirdness: 50,
      styleInfluence: 50,
      version: 'v4.5',
      duracion: '3:30',
      sunoUrl: '',
      bpm: '',
      key: '',
      tags: [],
      momento: '',
      notas: '',
      estructura: [],
      cuePoints: [],
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

  // ==================== HANDLERS - ESTRUCTURA ====================

  const handleAddEstructura = () => {
    setFormData(prev => ({
      ...prev,
      estructura: [
        ...prev.estructura,
        {
          seccion: 'Intro',
          inicio: '0:00',
          fin: '0:16',
          descripcion: ''
        }
      ]
    }))
  }

  const handleUpdateEstructura = (index, field, value) => {
    setFormData(prev => {
      const newEstructura = [...prev.estructura]
      newEstructura[index] = {
        ...newEstructura[index],
        [field]: value
      }
      return { ...prev, estructura: newEstructura }
    })
  }

  const handleRemoveEstructura = (index) => {
    setFormData(prev => ({
      ...prev,
      estructura: prev.estructura.filter((_, i) => i !== index)
    }))
  }

  // ==================== HANDLERS - CUE POINTS ====================

  const handleAddCuePoint = () => {
    setFormData(prev => ({
      ...prev,
      cuePoints: [
        ...prev.cuePoints,
        {
          tiempo: '0:00',
          tipo: 'intro',
          etiqueta: '',
          color: '#00d4ff'
        }
      ]
    }))
  }

  const handleUpdateCuePoint = (index, field, value) => {
    setFormData(prev => {
      const newCuePoints = [...prev.cuePoints]
      newCuePoints[index] = {
        ...newCuePoints[index],
        [field]: value
      }

      // Si se cambia el tipo, actualizar el color automáticamente
      if (field === 'tipo') {
        const cueTypeColors = {
          intro: '#00d4ff',
          drop: '#ff3333',
          buildup: '#ff6600',
          breakdown: '#ffd700',
          outro: '#ff0080',
          vocal: '#00ff41',
          instrumental: '#ffffff',
          bridge: '#cc00ff'
        }
        newCuePoints[index].color = cueTypeColors[value] || '#00d4ff'
      }

      return { ...prev, cuePoints: newCuePoints }
    })
  }

  const handleRemoveCuePoint = (index) => {
    setFormData(prev => ({
      ...prev,
      cuePoints: prev.cuePoints.filter((_, i) => i !== index)
    }))
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

  // ==================== CONSTANTES ====================

  const estructuraTipos = [
    'Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Drop', 
    'Break', 'Bridge', 'Outro', 'Build-up', 'Breakdown'
  ]

  const cueTypes = [
    { value: 'intro', label: 'Intro', color: '#00d4ff' },
    { value: 'drop', label: 'Drop', color: '#ff3333' },
    { value: 'buildup', label: 'Build-up', color: '#ff6600' },
    { value: 'breakdown', label: 'Breakdown', color: '#ffd700' },
    { value: 'outro', label: 'Outro', color: '#ff0080' },
    { value: 'vocal', label: 'Vocal', color: '#00ff41' },
    { value: 'instrumental', label: 'Instrumental', color: '#ffffff' },
    { value: 'bridge', label: 'Bridge', color: '#cc00ff' }
  ]

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

      {/* TECHNICAL INFO */}
      <div className="form-section technical-section">
        <h3 className="section-title">⚙️ Información Técnica</h3>
        <div className="technical-grid">
          <div className="tech-input-group">
            <label className="form-label">BPM:</label>
            <input
              type="text"
              value={formData.bpm}
              onChange={(e) => handleChange('bpm', e.target.value)}
              placeholder="120"
              className="form-input bpm-input"
              disabled={isLoading}
            />
          </div>

          <div className="tech-input-group">
            <label className="form-label">Key:</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => handleChange('key', e.target.value)}
              placeholder="Am, C#"
              className="form-input key-input"
              disabled={isLoading}
            />
          </div>

          <div className="tech-input-group">
            <label className="form-label">Duración:</label>
            <input
              type="text"
              value={formData.duracion}
              onChange={(e) => handleChange('duracion', e.target.value)}
              placeholder="3:30"
              className="form-input duration-input"
              disabled={isLoading}
            />
          </div>

          <div className="tech-input-group">
            <label className="form-label">Versión:</label>
            <select
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
              className="form-select version-select"
              disabled={isLoading}
            >
              <option value="v4.5">v4.5</option>
              <option value="v4.0">v4.0</option>
              <option value="v3.5">v3.5</option>
            </select>
          </div>
        </div>

        <div className="tech-input-group full-width">
          <label className="form-label">Suno URL:</label>
          <input
            type="url"
            value={formData.sunoUrl}
            onChange={(e) => handleChange('sunoUrl', e.target.value)}
            placeholder="https://suno.com/song/..."
            className="form-input suno-url-input"
            disabled={isLoading}
          />
        </div>
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

      {/* ESTRUCTURA MUSICAL */}
      <div className="form-section estructura-section">
        <div className="section-header">
          <label className="form-label">📊 Estructura Musical:</label>
          <button
            type="button"
            onClick={handleAddEstructura}
            className="add-small-btn"
            disabled={isLoading}
          >
            + Sección
          </button>
        </div>
        <div className="estructura-list">
          {formData.estructura.map((seccion, index) => (
            <div key={index} className="estructura-item">
              <select
                value={seccion.seccion}
                onChange={(e) => handleUpdateEstructura(index, 'seccion', e.target.value)}
                className="estructura-select"
                disabled={isLoading}
              >
                {estructuraTipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>

              <input
                type="text"
                value={seccion.inicio}
                onChange={(e) => handleUpdateEstructura(index, 'inicio', e.target.value)}
                placeholder="0:00"
                className="time-input"
                disabled={isLoading}
              />

              <span className="time-separator">-</span>

              <input
                type="text"
                value={seccion.fin}
                onChange={(e) => handleUpdateEstructura(index, 'fin', e.target.value)}
                placeholder="0:16"
                className="time-input"
                disabled={isLoading}
              />

              <input
                type="text"
                value={seccion.descripcion}
                onChange={(e) => handleUpdateEstructura(index, 'descripcion', e.target.value)}
                placeholder="Descripción..."
                className="descripcion-input"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => handleRemoveEstructura(index)}
                className="remove-small-btn"
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CUE POINTS */}
      <div className="form-section cuepoints-section">
        <div className="section-header">
          <label className="form-label">🎯 Cue Points (para DJ/Mixing):</label>
          <button
            type="button"
            onClick={handleAddCuePoint}
            className="add-small-btn"
            disabled={isLoading}
          >
            + Cue Point
          </button>
        </div>
        <div className="cuepoints-list">
          {formData.cuePoints.map((cue, index) => (
            <div key={index} className="cuepoint-item">
              <input
                type="text"
                value={cue.tiempo}
                onChange={(e) => handleUpdateCuePoint(index, 'tiempo', e.target.value)}
                placeholder="1:23"
                className="time-input"
                disabled={isLoading}
              />

              <select
                value={cue.tipo}
                onChange={(e) => handleUpdateCuePoint(index, 'tipo', e.target.value)}
                className="cue-type-select"
                disabled={isLoading}
              >
                {cueTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={cue.etiqueta}
                onChange={(e) => handleUpdateCuePoint(index, 'etiqueta', e.target.value)}
                placeholder="Etiqueta del cue..."
                className="cue-label-input"
                disabled={isLoading}
              />

              <div 
                className="cue-color-indicator"
                style={{ backgroundColor: cue.color || '#00d4ff' }}
              />

              <button
                type="button"
                onClick={() => handleRemoveCuePoint(index)}
                className="remove-small-btn"
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MOMENTO NARRATIVO */}
      <div className="form-section">
        <label className="form-label">🎬 Momento Narrativo:</label>
        <input
          type="text"
          value={formData.momento}
          onChange={(e) => handleChange('momento', e.target.value)}
          placeholder="Cuándo se usa en la historia..."
          className="form-input momento-input"
          disabled={isLoading}
        />
      </div>

      {/* NOTAS */}
      <div className="form-section">
        <label className="form-label">📝 Notas & Variaciones:</label>
        <textarea
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          placeholder="Notas sobre iteraciones, cambios, ideas para remix..."
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