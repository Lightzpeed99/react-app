// src/components/CharacterDetail.jsx
import { useState, useEffect } from 'react'
import ComponentCatalog from './ComponentCatalog'
import ComponentRenderer from './ComponentRenderer'
import './CharacterDetail.css'

const CharacterDetail = ({ character, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'protagonista',
    descripcion: '',
    imagen: '',
    origen: '',
    actitud: '',
    primera_aparicion: '',
    components: {}
  })

  const [showComponentCatalog, setShowComponentCatalog] = useState(false)

  useEffect(() => {
    if (character) {
      setFormData(character)
    }
  }, [character])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('imagen', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddComponent = (componentType) => {
    const componentId = `${componentType}_${Date.now()}`
    setFormData(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [componentId]: {
          type: componentType,
          data: getDefaultComponentData(componentType)
        }
      }
    }))
    setShowComponentCatalog(false)
  }

  const getDefaultComponentData = (componentType) => {
    switch (componentType) {
      case 'motivaciones':
        return { items: [''] }
      case 'habilidades':
        return { items: [{ nombre: '', descripcion: '' }] }
      case 'evolucion_arcos':
        return { arcos: {} }
      case 'relaciones':
        return { relaciones: [{ personaje: '', tipo: '', descripcion: '' }] }
      case 'atributos_clave':
        return { atributos: {} }
      case 'manifestacion':
        return { visual: '', sonora: '', fisica: '' }
      case 'debilidades':
        return { items: [''] }
      case 'rol_narrativo':
        return { texto: '' }
      case 'giro_narrativo':
        return { texto: '' }
      case 'fuentes_referencias':
        return { items: [''] }
      default:
        return {}
    }
  }

  const handleUpdateComponent = (componentId, newData) => {
    setFormData(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [componentId]: {
          ...prev.components[componentId],
          data: newData
        }
      }
    }))
  }

  const handleDeleteComponent = (componentId) => {
    setFormData(prev => {
      const newComponents = { ...prev.components }
      delete newComponents[componentId]
      return {
        ...prev,
        components: newComponents
      }
    })
  }

  const handleSave = () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio')
      return
    }
    onSave(formData)
  }

  return (
    <div className="character-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onCancel}>
          ← Volver al catálogo
        </button>
        <h2>{character ? 'Editar Personaje' : 'Crear Personaje'}</h2>
        <div className="header-actions">
          <button className="btn secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn primary" onClick={handleSave}>
            Guardar
          </button>
          {character && (
            <button 
              className="btn danger" 
              onClick={() => {
                if (confirm('¿Estás seguro de eliminar este personaje?')) {
                  onDelete(character.id)
                }
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Formulario Base */}
        <section className="base-form">
          <h3>Información Básica</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Nombre del personaje"
              />
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                <option value="protagonista">Protagonista</option>
                <option value="entidad_superior">Entidad Superior</option>
                <option value="entidad_colectiva">Entidad Colectiva</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Descripción *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción del personaje"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.imagen && (
                <div className="image-preview">
                  <img src={formData.imagen} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Origen/Naturaleza</label>
              <input
                type="text"
                value={formData.origen}
                onChange={(e) => handleInputChange('origen', e.target.value)}
                placeholder="Origen del personaje"
              />
            </div>

            <div className="form-group">
              <label>Actitud</label>
              <input
                type="text"
                value={formData.actitud}
                onChange={(e) => handleInputChange('actitud', e.target.value)}
                placeholder="Actitud general"
              />
            </div>

            <div className="form-group">
              <label>Primera Aparición</label>
              <input
                type="text"
                value={formData.primera_aparicion}
                onChange={(e) => handleInputChange('primera_aparicion', e.target.value)}
                placeholder="Dónde aparece por primera vez"
              />
            </div>
          </div>
        </section>

        {/* Componentes */}
        <section className="components-section">
          <div className="components-header">
            <h3>Componentes del Personaje</h3>
            <button 
              className="btn primary"
              onClick={() => setShowComponentCatalog(true)}
            >
              + Agregar Componente
            </button>
          </div>

          <div className="components-list">
            {Object.entries(formData.components || {}).map(([componentId, component]) => (
              <ComponentRenderer
                key={componentId}
                componentId={componentId}
                component={component}
                onUpdate={handleUpdateComponent}
                onDelete={handleDeleteComponent}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Modal del catálogo de componentes */}
      {showComponentCatalog && (
        <ComponentCatalog
          onSelectComponent={handleAddComponent}
          onClose={() => setShowComponentCatalog(false)}
        />
      )}
    </div>
  )
}

export default CharacterDetail