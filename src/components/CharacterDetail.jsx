// src/components/CharacterDetail.jsx
import { useState, useEffect } from 'react'
import ComponentCatalog from './ComponentCatalog'
import ComponentRenderer from './ComponentRenderer'
import './CharacterDetail.css'

const CharacterDetail = ({ item, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'lace',
    descripcion: '',
    imagen: '',
    origen: '',
    actitud: '',
    primera_aparicion: '',
    components: {}
  })

  const [showComponentCatalog, setShowComponentCatalog] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

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
      // Componentes de Personajes
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
      
      // Componentes de Historias/Arcos
      case 'tematica_principal':
        return { tema: '', descripcion: '' }
      case 'estilo_visual':
        return { paleta: '', efectos: '', transiciones: '' }
      case 'perfil_sonoro':
        return { musica: '', efectos_audio: '', ambiente: '' }
      case 'emociones_clave':
        return { items: [''] }
      case 'entidades_activas':
        return { items: [''] }
      case 'tecnologias':
        return { items: [''] }
      case 'evento_culminante':
        return { texto: '' }
      case 'sinopsis':
        return { texto: '' }
      case 'secuencias_clave':
        return { items: [{ titulo: '', descripcion: '' }] }
      case 'estado_emocional':
        return { nivel: '', descripcion: '' }
      case 'conexiones':
        return { items: [{ tipo: '', referencia: '', descripcion: '' }] }
      case 'referencias_visuales':
        return { items: [''] }
      case 'soundtrack':
        return { 
          items: [{
            titulo: '',
            prompt: '',
            tags: [],
            version: 'v4.5',
            duracion: '3:30',
            sunoUrl: '',
            bpm: '',
            key: '',
            momento: '',
            notas: '',
            estructura: [],
            cuePoints: [],
            energia: 50,
            intensidad: 50
          }]
        }
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

  const getTypeLabel = (tipo) => {
    switch (tipo) {
      case 'lace': return 'LACE'
      case 'ia_cuantica': return 'IA Cuántica'
      case 'stayed': return 'Stayed'
      case 'angeles': return 'Ángeles'
      case 'arcos': return 'Arco Narrativo'
      default: return 'Desconocido'
    }
  }

  return (
    <div className="character-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onCancel}>
          ← Volver
        </button>
        <h2>{item ? `Editar ${getTypeLabel(formData.tipo)}` : 'Crear Nuevo Elemento'}</h2>
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
                placeholder="Nombre del elemento"
              />
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                <optgroup label="Entidades">
                  <option value="lace">LACE</option>
                  <option value="ia_cuantica">IA Cuántica</option>
                  <option value="stayed">Stayed</option>
                  <option value="angeles">Ángeles</option>
                </optgroup>
                <optgroup label="Narrativa">
                  <option value="arcos">Arco Narrativo</option>
                </optgroup>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Descripción *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción del elemento"
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
                placeholder="Origen o naturaleza"
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
            <h3>Componentes</h3>
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
          
          <div className="floating-add-component">
            <button 
              className="btn blue"
              onClick={() => setShowComponentCatalog(true)}
            >
              + Agregar Componente
            </button>
          </div>
        </section>
      </div>

      {/* Botones flotantes */}
      <div className="sticky-buttons">
        <button className="btn secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn primary" onClick={handleSave}>
          Guardar
        </button>
        {item && (
          <button 
            className="btn danger" 
            onClick={() => {
              if (confirm('¿Estás seguro de eliminar este elemento?')) {
                onDelete(item.id)
              }
            }}
          >
            Eliminar
          </button>
        )}
      </div>

      {/* Modal del catálogo de componentes */}
      {showComponentCatalog && (
        <ComponentCatalog
          itemType={formData.tipo}
          onSelectComponent={handleAddComponent}
          onClose={() => setShowComponentCatalog(false)}
        />
      )}
    </div>
  )
}

export default CharacterDetail