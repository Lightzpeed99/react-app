// src/features/soundtrack/components/SoundtrackCatalog.jsx

import { useState, useEffect, useMemo } from 'react'
import { useSoundtrack } from '../hooks/useSoundtrack'
import SoundtrackCard from './SoundtrackCard'
import './SoundtrackCatalog.css'

/**
 * SoundtrackCatalog - Vista principal del catálogo de prompts Suno
 * 
 * RESPONSABILIDADES:
 * - Mostrar grid de SoundtrackCards
 * - Búsqueda y filtrado en tiempo real
 * - Ordenamiento de prompts
 * - Navegación a detalle/creación
 * - Acciones rápidas (duplicar, calificar)
 * 
 * PROPS:
 * @param {Function} onViewDetail - Callback al ver detalle de un prompt
 * @param {Function} onCreateNew - Callback al crear nuevo prompt
 */

const SoundtrackCatalog = ({ onViewDetail, onCreateNew }) => {
  // ==================== HOOKS ====================
  
  const {
    prompts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    minRating,
    setMinRating,
    filteredPrompts,
    getAllPrompts,
    ratePrompt,
    duplicatePrompt,
    getStatistics
  } = useSoundtrack()

// ==================== EFFECTS ====================

useEffect(() => {
  getAllPrompts();
}, [getAllPrompts]);

  // ==================== ESTADOS LOCALES ====================

  const [sortBy, setSortBy] = useState('recent') // recent, rating, title, bpm
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(false)

  // ==================== TAGS DISPONIBLES ====================

  /**
   * Extraer todos los tags únicos de todos los prompts
   */
  const availableTags = useMemo(() => {
    const tagsSet = new Set()
    prompts.forEach(prompt => {
      if (prompt.tags && Array.isArray(prompt.tags)) {
        prompt.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }, [prompts])

  // ==================== ORDENAMIENTO ====================

  /**
   * Ordenar prompts filtrados según criterio seleccionado
   */
  const sortedPrompts = useMemo(() => {
    const sorted = [...filteredPrompts]

    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB - dateA
        })

      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = a.calificacion || 0
          const ratingB = b.calificacion || 0
          return ratingB - ratingA
        })

      case 'title':
        return sorted.sort((a, b) => {
          const titleA = (a.songTitle || '').toLowerCase()
          const titleB = (b.songTitle || '').toLowerCase()
          return titleA.localeCompare(titleB)
        })

      case 'bpm':
        return sorted.sort((a, b) => {
          const bpmA = parseInt(a.bpm) || 0
          const bpmB = parseInt(b.bpm) || 0
          return bpmB - bpmA
        })

      default:
        return sorted
    }
  }, [filteredPrompts, sortBy])

  // ==================== HANDLERS ====================

  const handleViewDetail = (prompt) => {
    if (onViewDetail) {
      onViewDetail(prompt)
    }
  }

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew()
    }
  }

  const handleRate = async (promptId, rating) => {
    try {
      await ratePrompt(promptId, rating)
    } catch (err) {
      console.error('Error rating prompt:', err)
    }
  }

  const handleDuplicate = async (promptId) => {
    try {
      const duplicated = await duplicatePrompt(promptId)
      if (duplicated && onViewDetail) {
        onViewDetail(duplicated)
      }
    } catch (err) {
      console.error('Error duplicating prompt:', err)
    }
  }

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setMinRating(0)
  }

  const handleLoadStats = async () => {
    const statistics = await getStatistics()
    setStats(statistics)
    setShowStats(true)
  }

  // ==================== RENDER HELPERS ====================

  const hasActiveFilters = () => {
    return searchQuery.trim() !== '' || selectedTags.length > 0 || minRating > 0
  }

  const getFilterCount = () => {
    let count = 0
    if (searchQuery.trim()) count++
    if (selectedTags.length > 0) count += selectedTags.length
    if (minRating > 0) count++
    return count
  }

  // ==================== RENDER ====================

  if (loading && prompts.length === 0) {
    return (
      <div className="soundtrack-catalog loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <p>Cargando prompts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="soundtrack-catalog error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <h3>Error al cargar prompts</h3>
          <p>{error}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="soundtrack-catalog">
      {/* HEADER */}
      <div className="catalog-header">
        <div className="header-title">
          <h1 className="catalog-title">🎵 Reload Soundtrack</h1>
          <span className="catalog-subtitle">
            {sortedPrompts.length} {sortedPrompts.length === 1 ? 'prompt' : 'prompts'}
          </span>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn secondary"
            onClick={handleLoadStats}
          >
            📊 Estadísticas
          </button>
          <button 
            className="btn blue"
            onClick={handleCreateNew}
          >
            ➕ Crear Nuevo Prompt
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="catalog-controls">
        {/* Search Bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título, lyrics, style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Controls Row */}
        <div className="controls-row">
          {/* Sort */}
          <div className="control-group">
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Más recientes</option>
              <option value="rating">Mejor calificados</option>
              <option value="title">Título (A-Z)</option>
              <option value="bpm">BPM (Mayor-Menor)</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="control-group">
            <label>Vista:</label>
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vista Grid"
              >
                ⊞
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Vista Lista"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Filters Toggle */}
          <button
            className={`filters-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ Filtros {hasActiveFilters() && `(${getFilterCount()})`}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <button
              className="clear-filters-btn"
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            {/* Rating Filter */}
            <div className="filter-section">
              <label>Rating mínimo: {minRating}/10</label>
              <input
                type="range"
                min="0"
                max="10"
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                className="rating-slider"
              />
            </div>

            {/* Tags Filter */}
            <div className="filter-section">
              <label>Filtrar por tags:</label>
              <div className="tags-filter-list">
                {availableTags.length === 0 ? (
                  <p className="no-tags-message">No hay tags disponibles</p>
                ) : (
                  availableTags.map(tag => (
                    <button
                      key={tag}
                      className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROMPTS GRID/LIST */}
      {sortedPrompts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h3>No se encontraron prompts</h3>
          {hasActiveFilters() ? (
            <p>Intenta ajustar los filtros o búsqueda</p>
          ) : (
            <p>Crea tu primer prompt de Suno</p>
          )}
          <button className="btn blue" onClick={handleCreateNew}>
            ➕ Crear Primer Prompt
          </button>
        </div>
      ) : (
        <div className={`prompts-container ${viewMode}`}>
          {sortedPrompts.map(prompt => (
            <SoundtrackCard
              key={prompt.id}
              prompt={prompt}
              onClick={handleViewDetail}
              onRate={handleRate}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      {/* STATISTICS MODAL */}
      {showStats && stats && (
        <div className="stats-modal-overlay" onClick={() => setShowStats(false)}>
          <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="stats-modal-header">
              <h2>📊 Estadísticas del Soundtrack</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowStats(false)}
              >
                ✕
              </button>
            </div>
            <div className="stats-modal-content">
              <div className="stat-item">
                <span className="stat-label">Total de Prompts:</span>
                <span className="stat-value">{stats.totalPrompts}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Prompts con Rating:</span>
                <span className="stat-value">{stats.totalWithRating}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rating Promedio:</span>
                <span className="stat-value">{stats.averageRating}/10</span>
              </div>
              
              {stats.topGenres && stats.topGenres.length > 0 && (
                <div className="stat-section">
                  <h3>Top Géneros:</h3>
                  <div className="genre-list">
                    {stats.topGenres.slice(0, 10).map((genre, index) => (
                      <div key={index} className="genre-item">
                        <span className="genre-name">{genre.genre}</span>
                        <span className="genre-count">{genre.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {loading && prompts.length > 0 && (
        <div className="loading-overlay">
          <div className="spinner-ring"></div>
        </div>
      )}
    </div>
  )
}

export default SoundtrackCatalog