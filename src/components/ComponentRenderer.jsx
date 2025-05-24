// src/components/ComponentRenderer.jsx
import { useState } from 'react'
import './ComponentRenderer.css'

const ComponentRenderer = ({ componentId, component, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const getComponentName = (type) => {
    const names = {
      motivaciones: 'Motivaciones',
      habilidades: 'Habilidades',
      evolucion_arcos: 'Evolución por Arcos',
      relaciones: 'Relaciones',
      atributos_clave: 'Atributos Clave',
      manifestacion: 'Manifestación',
      debilidades: 'Debilidades',
      rol_narrativo: 'Rol Narrativo',
      giro_narrativo: 'Giro Narrativo',
      fuentes_referencias: 'Fuentes y Referencias'
    }
    return names[type] || type
  }

  const renderComponentContent = () => {
    switch (component.type) {
      case 'motivaciones':
        return <MotivacionesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'habilidades':
        return <HabilidadesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'evolucion_arcos':
        return <EvolucionArcosComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'relaciones':
        return <RelacionesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'atributos_clave':
        return <AtributosClave data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'manifestacion':
        return <ManifestacionComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'debilidades':
        return <DebilidadesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'rol_narrativo':
        return <RolNarrativoComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'giro_narrativo':
        return <GiroNarrativoComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'fuentes_referencias':
        return <FuentesReferenciasComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      default:
        return <div>Componente no reconocido</div>
    }
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <div className="component-title">
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <h4>{getComponentName(component.type)}</h4>
        </div>
        <button 
          className="delete-component-btn"
          onClick={() => onDelete(componentId)}
        >
          🗑️
        </button>
      </div>
      
      {isExpanded && (
        <div className="component-content">
          {renderComponentContent()}
        </div>
      )}
    </div>
  )
}

// Componente para Motivaciones
const MotivacionesComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, value) => {
    const newItems = [...data.items]
    newItems[index] = value
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, ''] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="motivaciones-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Descripción de la motivación"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar motivación</button>
    </div>
  )
}

// Componente para Habilidades
const HabilidadesComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, { nombre: '', descripcion: '' }] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="habilidades-component">
      {data.items.map((item, index) => (
        <div key={index} className="habilidad-item">
          <div className="item-row">
            <input
              type="text"
              value={item.nombre}
              onChange={(e) => handleItemChange(index, 'nombre', e.target.value)}
              placeholder="Nombre de la habilidad"
            />
            <button onClick={() => removeItem(index)} className="remove-btn">×</button>
          </div>
          <textarea
            value={item.descripcion}
            onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
            placeholder="Descripción de la habilidad"
            rows={2}
          />
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar habilidad</button>
    </div>
  )
}

// Componente para Evolución por Arcos
const EvolucionArcosComponent = ({ data, onUpdate, componentId }) => {
  const arcos = ['Arco 1', 'Arco 2', 'Arco 3', 'Arco 4', 'Arco 5']

  const handleArcoChange = (arco, field, value) => {
    const newArcos = {
      ...data.arcos,
      [arco]: {
        ...data.arcos[arco],
        [field]: value
      }
    }
    onUpdate(componentId, { arcos: newArcos })
  }

  return (
    <div className="evolucion-arcos-component">
      {arcos.map(arco => (
        <div key={arco} className="arco-section">
          <h5>{arco}</h5>
          <div className="arco-fields">
            <input
              type="text"
              value={data.arcos[arco]?.estado || ''}
              onChange={(e) => handleArcoChange(arco, 'estado', e.target.value)}
              placeholder="Estado en este arco"
            />
            <input
              type="text"
              value={data.arcos[arco]?.evento_clave || ''}
              onChange={(e) => handleArcoChange(arco, 'evento_clave', e.target.value)}
              placeholder="Evento clave"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para Relaciones
const RelacionesComponent = ({ data, onUpdate, componentId }) => {
  const handleRelacionChange = (index, field, value) => {
    const newRelaciones = [...data.relaciones]
    newRelaciones[index] = { ...newRelaciones[index], [field]: value }
    onUpdate(componentId, { relaciones: newRelaciones })
  }

  const addRelacion = () => {
    onUpdate(componentId, { 
      relaciones: [...data.relaciones, { personaje: '', tipo: '', descripcion: '' }] 
    })
  }

  const removeRelacion = (index) => {
    const newRelaciones = data.relaciones.filter((_, i) => i !== index)
    onUpdate(componentId, { relaciones: newRelaciones })
  }

  return (
    <div className="relaciones-component">
      {data.relaciones.map((relacion, index) => (
        <div key={index} className="relacion-item">
          <div className="relacion-header">
            <input
              type="text"
              value={relacion.personaje}
              onChange={(e) => handleRelacionChange(index, 'personaje', e.target.value)}
              placeholder="Nombre del personaje"
            />
            <input
              type="text"
              value={relacion.tipo}
              onChange={(e) => handleRelacionChange(index, 'tipo', e.target.value)}
              placeholder="Tipo de relación"
            />
            <button onClick={() => removeRelacion(index)} className="remove-btn">×</button>
          </div>
          <textarea
            value={relacion.descripcion}
            onChange={(e) => handleRelacionChange(index, 'descripcion', e.target.value)}
            placeholder="Descripción de la relación"
            rows={2}
          />
        </div>
      ))}
      <button onClick={addRelacion} className="add-btn">+ Agregar relación</button>
    </div>
  )
}

// Componente para Atributos Clave
const AtributosClave = ({ data, onUpdate, componentId }) => {
  const [newKey, setNewKey] = useState('')

  const handleAtributoChange = (key, value) => {
    const newAtributos = { ...data.atributos, [key]: value }
    onUpdate(componentId, { atributos: newAtributos })
  }

  const addAtributo = () => {
    if (newKey.trim()) {
      handleAtributoChange(newKey, '')
      setNewKey('')
    }
  }

  const removeAtributo = (key) => {
    const newAtributos = { ...data.atributos }
    delete newAtributos[key]
    onUpdate(componentId, { atributos: newAtributos })
  }

  return (
    <div className="atributos-clave-component">
      {Object.entries(data.atributos || {}).map(([key, value]) => (
        <div key={key} className="atributo-item">
          <div className="atributo-header">
            <label>{key}</label>
            <button onClick={() => removeAtributo(key)} className="remove-btn">×</button>
          </div>
          <textarea
            value={value}
            onChange={(e) => handleAtributoChange(key, e.target.value)}
            placeholder={`Descripción de ${key}`}
            rows={2}
          />
        </div>
      ))}
      <div className="add-atributo">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Nombre del atributo"
        />
        <button onClick={addAtributo} className="add-btn">+ Agregar atributo</button>
      </div>
    </div>
  )
}

// Componente para Manifestación
const ManifestacionComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (field, value) => {
    onUpdate(componentId, { ...data, [field]: value })
  }

  return (
    <div className="manifestacion-component">
      <div className="manifestacion-field">
        <label>Manifestación Visual</label>
        <textarea
          value={data.visual || ''}
          onChange={(e) => handleChange('visual', e.target.value)}
          placeholder="Cómo se ve el personaje/entidad"
          rows={3}
        />
      </div>
      <div className="manifestacion-field">
        <label>Manifestación Sonora</label>
        <textarea
          value={data.sonora || ''}
          onChange={(e) => handleChange('sonora', e.target.value)}
          placeholder="Cómo suena el personaje/entidad"
          rows={3}
        />
      </div>
      <div className="manifestacion-field">
        <label>Manifestación Física</label>
        <textarea
          value={data.fisica || ''}
          onChange={(e) => handleChange('fisica', e.target.value)}
          placeholder="Cómo se manifiesta físicamente"
          rows={3}
        />
      </div>
    </div>
  )
}

// Componente para Debilidades
const DebilidadesComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, value) => {
    const newItems = [...data.items]
    newItems[index] = value
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, ''] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="debilidades-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <textarea
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Descripción de la debilidad"
            rows={2}
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar debilidad</button>
    </div>
  )
}

// Componente para Rol Narrativo
const RolNarrativoComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (value) => {
    onUpdate(componentId, { texto: value })
  }

  return (
    <div className="rol-narrativo-component">
      <textarea
        value={data.texto || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Describe el rol del personaje en la narrativa"
        rows={4}
      />
    </div>
  )
}

// Componente para Giro Narrativo
const GiroNarrativoComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (value) => {
    onUpdate(componentId, { texto: value })
  }

  return (
    <div className="giro-narrativo-component">
      <textarea
        value={data.texto || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Describe las revelaciones importantes sobre el personaje"
        rows={4}
      />
    </div>
  )
}

// Componente para Fuentes y Referencias
const FuentesReferenciasComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, value) => {
    const newItems = [...data.items]
    newItems[index] = value
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, ''] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="fuentes-referencias-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Enlace o referencia a arco/capítulo"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar referencia</button>
    </div>
  )
}

export default ComponentRenderer