// src/components/DictionaryView.jsx
import { useState, useEffect } from 'react'
import './DictionaryView.css'

const DictionaryView = () => {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Categorías iniciales con ejemplos
  const initialCategories = [
    {
      id: 'poder_energia',
      name: 'PODER/ENERGÍA',
      words: [],
      placeholder: 'Ej: BLAST, BOLD, POWERFULL, ENERGY, POWER, PULSE'
    },
    {
      id: 'prefijos',
      name: 'PREFIJOS',
      words: [],
      placeholder: 'Ej: RE-, MUTATION, DEVASTATION, REVELATION, IGNITE'
    },
    {
      id: 'sufijos',
      name: 'SUFIJOS',
      words: [],
      placeholder: 'Ej: -ATION, -UTION'
    },
    {
      id: 'actions',
      name: 'ACTIONS',
      words: [],
      placeholder: 'Ej: EVOLVE, MERGE, ROLLING, COMPLETE, DESTROY, RISE, CHARGING, DRAIN'
    },
    {
      id: 'terms',
      name: 'TERMS',
      words: [],
      placeholder: 'Ej: SYSTEMS, SYLLABE, PRECISION, ULTIMATE, THERAPY, SCREAMS, SECRET, MASTER, RUPTURE, SHADOWS, DEMON, STAYED'
    },
    {
      id: 'concepto',
      name: 'CONCEPTO',
      words: [],
      placeholder: 'Ej: REFLEX, UNREAL, GOD, FOREVER, LOOP, LIGHTNING, CYCLE, BRUTAL, PARTY, DARK, ESSENCE, QUANTUM'
    },
    {
      id: 'tech_language',
      name: 'TECH LANGUAGE',
      words: [],
      placeholder: 'Ej: METAMORFOSIS, MORPH, DIGITAL, BOOT, TECH, HITECH, COMPLETE, PORTAL, CIBER'
    },
    {
      id: 'universal',
      name: 'UNIVERSAL',
      words: [],
      placeholder: 'Ej: COSMIC, ETERNAL, REALITY, SIMULATION, FREQUENCY, PARTICLE, INFINITE, MATRIX, UNIVERSE'
    },
    {
      id: 'fx',
      name: 'FX',
      words: [],
      placeholder: 'Ej: WARFARE, SPARK, CLICK, LIGHT, INDIAN SCREAM'
    },
    {
      id: 'physics',
      name: 'PHYSICS',
      words: [],
      placeholder: 'Ej: HEAVY, FADE'
    },
    {
      id: 'onomatopeyas',
      name: 'ONOMATOPEYAS',
      words: [],
      placeholder: 'Ej: DROPS, FLAUTAS, BEATS, CLAP, WOOOIII, YAAAAAIII, AAAHHH, SHIFT SHIFT, BOOHMBOOOW'
    },
    {
      id: 'position',
      name: 'POSITION',
      words: [],
      placeholder: 'Ej: INSIDE'
    },
    {
      id: 'phrases',
      name: 'PHRASES',
      words: [],
      placeholder: 'Ej: HERE WE GO, I WANT BACK, BACK GO AGAIN'
    }
  ]

  // Cargar categorías del localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('reloadxps_dictionary')
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      setCategories(initialCategories)
    }
  }, [])

  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('reloadxps_dictionary', JSON.stringify(categories))
    }
  }, [categories])

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index)
    setShowModal(true)
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.toUpperCase(),
        words: [],
        placeholder: 'Ej: palabra1, palabra2, palabra3'
      }
      setCategories([...categories, newCategory])
      setNewCategoryName('')
      setShowNewCategoryModal(false)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleRenameCategory = (index, newName) => {
    const updatedCategories = [...categories]
    updatedCategories[index].name = newName.toUpperCase()
    setCategories(updatedCategories)
  }

  const getNeighborCategories = (currentIndex) => {
    const neighbors = []
    const totalCategories = categories.length
    
    // Categoría actual en el centro
    const current = categories[currentIndex]
    
    // 4 vecinas: 2 anteriores y 2 siguientes (con wrap around)
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue // Skip current category
      let neighborIndex = (currentIndex + i + totalCategories) % totalCategories
      neighbors.push({ ...categories[neighborIndex], index: neighborIndex })
    }
    
    return { current: { ...current, index: currentIndex }, neighbors }
  }

  return (
    <div className="dictionary-view">
      <div className="dictionary-header">
        <h2>Diccionario Cósmico Suniversal</h2>
        <p>Banco de palabras y frases para prompts creativos</p>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(index)}
          >
            <div className="category-icon">📝</div>
            <h3 className="category-name">{category.name}</h3>
            <div className="category-stats">
              <span className="word-count">{category.words.length} palabras</span>
            </div>
            <button 
              className="delete-category-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteCategory(category.id)
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button 
        className="floating-add-btn"
        onClick={() => setShowNewCategoryModal(true)}
      >
        +
      </button>

      {showModal && selectedCategoryIndex !== null && (
        <DictionaryModal
          categoryData={getNeighborCategories(selectedCategoryIndex)}
          categories={categories}
          setCategories={setCategories}
          onClose={() => setShowModal(false)}
          onRenameCategory={handleRenameCategory}
        />
      )}

      {showNewCategoryModal && (
        <div className="modal-overlay">
          <div className="new-category-modal">
            <h3>Nueva Categoría</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              autoFocus
            />
            <div className="modal-buttons">
              <button 
                className="btn secondary" 
                onClick={() => setShowNewCategoryModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn primary" 
                onClick={handleCreateCategory}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const DictionaryModal = ({ categoryData, categories, setCategories, onClose, onRenameCategory }) => {
  const [wordInputs, setWordInputs] = useState({})
  const [editingName, setEditingName] = useState(null)
  const [tempName, setTempName] = useState('')

  const { current, neighbors } = categoryData

  useEffect(() => {
    const initialInputs = {}
    initialInputs[current.index] = current.words.join(', ')
    neighbors.forEach(neighbor => {
      initialInputs[neighbor.index] = neighbor.words.join(', ')
    })
    setWordInputs(initialInputs)
  }, [current, neighbors])

  const handleWordChange = (categoryIndex, value) => {
    setWordInputs(prev => ({
      ...prev,
      [categoryIndex]: value
    }))
  }

  const handleSave = () => {
    const updatedCategories = [...categories]
    
    Object.entries(wordInputs).forEach(([index, wordsString]) => {
      const categoryIndex = parseInt(index)
      const words = wordsString
        .split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0)
      
      updatedCategories[categoryIndex].words = words
    })
    
    setCategories(updatedCategories)
    onClose()
  }

  const handleNameEdit = (index, currentName) => {
    setEditingName(index)
    setTempName(currentName)
  }

  const handleNameSave = (index) => {
    onRenameCategory(index, tempName)
    setEditingName(null)
  }

  return (
    <div className="modal-overlay">
      <div className="dictionary-modal">
        <div className="modal-header">
          <h3>Gestionar Palabras</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="categories-grid-modal">
          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[0].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[0].index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave(neighbors[0].index)}
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(neighbors[0].index, neighbors[0].name)}>
                  {neighbors[0].name}
                </h4>
              )}
            </div>
            <textarea
              value={wordInputs[neighbors[0].index] || ''}
              onChange={(e) => handleWordChange(neighbors[0].index, e.target.value)}
              placeholder={neighbors[0].placeholder}
              rows={3}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[1].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[1].index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave(neighbors[1].index)}
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(neighbors[1].index, neighbors[1].name)}>
                  {neighbors[1].name}
                </h4>
              )}
            </div>
            <textarea
              value={wordInputs[neighbors[1].index] || ''}
              onChange={(e) => handleWordChange(neighbors[1].index, e.target.value)}
              placeholder={neighbors[1].placeholder}
              rows={3}
            />
          </div>

          <div className="current-category">
            <div className="category-header">
              {editingName === current.index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(current.index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave(current.index)}
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(current.index, current.name)}>
                  {current.name} ⭐
                </h4>
              )}
            </div>
            <textarea
              value={wordInputs[current.index] || ''}
              onChange={(e) => handleWordChange(current.index, e.target.value)}
              placeholder={current.placeholder}
              rows={4}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[2].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[2].index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave(neighbors[2].index)}
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(neighbors[2].index, neighbors[2].name)}>
                  {neighbors[2].name}
                </h4>
              )}
            </div>
            <textarea
              value={wordInputs[neighbors[2].index] || ''}
              onChange={(e) => handleWordChange(neighbors[2].index, e.target.value)}
              placeholder={neighbors[2].placeholder}
              rows={3}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[3].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[3].index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameSave(neighbors[3].index)}
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(neighbors[3].index, neighbors[3].name)}>
                  {neighbors[3].name}
                </h4>
              )}
            </div>
            <textarea
              value={wordInputs[neighbors[3].index] || ''}
              onChange={(e) => handleWordChange(neighbors[3].index, e.target.value)}
              placeholder={neighbors[3].placeholder}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn primary" onClick={handleSave}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default DictionaryView