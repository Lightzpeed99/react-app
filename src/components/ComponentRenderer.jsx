// src/components/ComponentRenderer.jsx
import { useState } from 'react'
import './ComponentRenderer.css'

const ComponentRenderer = ({ componentId, component, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const getComponentName = (type) => {
    const names = {
      // Componentes de Personajes
      motivaciones: 'Motivaciones',
      habilidades: 'Habilidades',
      evolucion_arcos: 'Evolución por Arcos',
      relaciones: 'Relaciones',
      atributos_clave: 'Atributos Clave',
      manifestacion: 'Manifestación',
      debilidades: 'Debilidades',
      rol_narrativo: 'Rol Narrativo',
      giro_narrativo: 'Giro Narrativo',
      fuentes_referencias: 'Fuentes y Referencias',
      
      // Componentes de Historias
      tematica_principal: 'Temática Principal',
      estilo_visual: 'Estilo Visual',
      perfil_sonoro: 'Perfil Sonoro',
      emociones_clave: 'Emociones Clave',
      entidades_activas: 'Entidades Activas',
      tecnologias: 'Tecnologías',
      evento_culminante: 'Evento Culminante',
      sinopsis: 'Sinopsis',
      secuencias_clave: 'Secuencias Clave',
      estado_emocional: 'Estado Emocional',
      conexiones: 'Conexiones',
      referencias_visuales: 'Referencias Visuales',
      soundtrack: 'Soundtrack'
    }
    return names[type] || type
  }

  const renderComponentContent = () => {
    switch (component.type) {
      // Componentes de Personajes (existentes)
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
      
      // Componentes de Historias (nuevos)
      case 'tematica_principal':
        return <TematicaPrincipalComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'estilo_visual':
        return <EstiloVisualComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'perfil_sonoro':
        return <PerfilSonoroComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'emociones_clave':
        return <EmocionesClaveComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'entidades_activas':
        return <EntidadesActivasComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'tecnologias':
        return <TecnologiasComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'evento_culminante':
        return <EventoCulminanteComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'sinopsis':
        return <SinopsisComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'secuencias_clave':
        return <SecuenciasClaveComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'estado_emocional':
        return <EstadoEmocionalComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'conexiones':
        return <ConexionesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'referencias_visuales':
        return <ReferenciasVisualesComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      case 'soundtrack':
        return <SoundtrackComponent data={component.data} onUpdate={onUpdate} componentId={componentId} />
      
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

// ========== COMPONENTES DE PERSONAJES (EXISTENTES) ==========

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

// ========== COMPONENTES DE HISTORIAS (NUEVOS) ==========

// Componente para Temática Principal
const TematicaPrincipalComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (field, value) => {
    onUpdate(componentId, { ...data, [field]: value })
  }

  return (
    <div className="tematica-principal-component">
      <div className="field-group">
        <label>Tema Central</label>
        <input
          type="text"
          value={data.tema || ''}
          onChange={(e) => handleChange('tema', e.target.value)}
          placeholder="Ej: Naturaleza de la consciencia y la realidad"
        />
      </div>
      <div className="field-group">
        <label>Descripción</label>
        <textarea
          value={data.descripcion || ''}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          placeholder="Descripción detallada del tema"
          rows={4}
        />
      </div>
    </div>
  )
}

// Componente para Estilo Visual
const EstiloVisualComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (field, value) => {
    onUpdate(componentId, { ...data, [field]: value })
  }

  return (
    <div className="estilo-visual-component">
      <div className="field-group">
        <label>Paleta de Colores</label>
        <input
          type="text"
          value={data.paleta || ''}
          onChange={(e) => handleChange('paleta', e.target.value)}
          placeholder="Ej: Minimalista con colores fríos"
        />
      </div>
      <div className="field-group">
        <label>Efectos Visuales</label>
        <input
          type="text"
          value={data.efectos || ''}
          onChange={(e) => handleChange('efectos', e.target.value)}
          placeholder="Ej: Glitches sutiles, líneas simples"
        />
      </div>
      <div className="field-group">
        <label>Transiciones</label>
        <input
          type="text"
          value={data.transiciones || ''}
          onChange={(e) => handleChange('transiciones', e.target.value)}
          placeholder="Ej: Transiciones fluidas, fadeIn"
        />
      </div>
    </div>
  )
}

// Componente para Perfil Sonoro
const PerfilSonoroComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (field, value) => {
    onUpdate(componentId, { ...data, [field]: value })
  }

  return (
    <div className="perfil-sonoro-component">
      <div className="field-group">
        <label>Música</label>
        <textarea
          value={data.musica || ''}
          onChange={(e) => handleChange('musica', e.target.value)}
          placeholder="Describe el estilo musical del arco"
          rows={2}
        />
      </div>
      <div className="field-group">
        <label>Efectos de Audio</label>
        <textarea
          value={data.efectos_audio || ''}
          onChange={(e) => handleChange('efectos_audio', e.target.value)}
          placeholder="Efectos sonoros característicos"
          rows={2}
        />
      </div>
      <div className="field-group">
        <label>Ambiente</label>
        <textarea
          value={data.ambiente || ''}
          onChange={(e) => handleChange('ambiente', e.target.value)}
          placeholder="Ambiente sonoro general"
          rows={2}
        />
      </div>
    </div>
  )
}

// Componente para Emociones Clave
const EmocionesClaveComponent = ({ data, onUpdate, componentId }) => {
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
    <div className="emociones-clave-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Ej: Miedo, Curiosidad"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar emoción</button>
    </div>
  )
}

// Componente para Entidades Activas
const EntidadesActivasComponent = ({ data, onUpdate, componentId }) => {
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
    <div className="entidades-activas-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Ej: La Sombra, El Guardián del Equilibrio"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar entidad</button>
    </div>
  )
}

// Componente para Tecnologías
const TecnologiasComponent = ({ data, onUpdate, componentId }) => {
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
    <div className="tecnologias-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="Ej: Chip cuántico, Feel-ain"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar tecnología</button>
    </div>
  )
}

// Componente para Evento Culminante
const EventoCulminanteComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (value) => {
    onUpdate(componentId, { texto: value })
  }

  return (
    <div className="evento-culminante-component">
      <textarea
        value={data.texto || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Describe el momento clave que define el arco"
        rows={4}
      />
    </div>
  )
}

// Componente para Sinopsis
const SinopsisComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (value) => {
    onUpdate(componentId, { texto: value })
  }

  return (
    <div className="sinopsis-component">
      <textarea
        value={data.texto || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Resumen del arco o capítulo"
        rows={6}
      />
    </div>
  )
}

// Componente para Secuencias Clave
const SecuenciasClaveComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, { titulo: '', descripcion: '' }] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="secuencias-clave-component">
      {data.items.map((item, index) => (
        <div key={index} className="secuencia-item">
          <div className="item-row">
            <input
              type="text"
              value={item.titulo}
              onChange={(e) => handleItemChange(index, 'titulo', e.target.value)}
              placeholder="Título de la secuencia"
            />
            <button onClick={() => removeItem(index)} className="remove-btn">×</button>
          </div>
          <textarea
            value={item.descripcion}
            onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
            placeholder="Descripción de la secuencia"
            rows={2}
          />
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar secuencia</button>
    </div>
  )
}

// Componente para Estado Emocional
const EstadoEmocionalComponent = ({ data, onUpdate, componentId }) => {
  const handleChange = (field, value) => {
    onUpdate(componentId, { ...data, [field]: value })
  }

  return (
    <div className="estado-emocional-component">
      <div className="field-group">
        <label>Nivel Emocional</label>
        <input
          type="text"
          value={data.nivel || ''}
          onChange={(e) => handleChange('nivel', e.target.value)}
          placeholder="Ej: Estable, Fragmentado, Intenso"
        />
      </div>
      <div className="field-group">
        <label>Descripción</label>
        <textarea
          value={data.descripcion || ''}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          placeholder="Cómo está LACE emocionalmente en este momento"
          rows={3}
        />
      </div>
    </div>
  )
}

// Componente para Conexiones
const ConexionesComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, { tipo: '', referencia: '', descripcion: '' }] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="conexiones-component">
      {data.items.map((item, index) => (
        <div key={index} className="conexion-item">
          <div className="conexion-header">
            <input
              type="text"
              value={item.tipo}
              onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}
              placeholder="Tipo (Ej: Arco, Capítulo, Personaje)"
            />
            <input
              type="text"
              value={item.referencia}
              onChange={(e) => handleItemChange(index, 'referencia', e.target.value)}
              placeholder="Referencia específica"
            />
            <button onClick={() => removeItem(index)} className="remove-btn">×</button>
          </div>
          <textarea
            value={item.descripcion}
            onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
            placeholder="Descripción de la conexión"
            rows={2}
          />
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar conexión</button>
    </div>
  )
}

// Componente para Referencias Visuales
const ReferenciasVisualesComponent = ({ data, onUpdate, componentId }) => {
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
    <div className="referencias-visuales-component">
      {data.items.map((item, index) => (
        <div key={index} className="item-row">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder="URL de imagen o descripción visual"
          />
          <button onClick={() => removeItem(index)} className="remove-btn">×</button>
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar referencia</button>
    </div>
  )
}

// Componente para Soundtrack
const SoundtrackComponent = ({ data, onUpdate, componentId }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { items: [...data.items, { titulo: '', artista: '', momento: '' }] })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  return (
    <div className="soundtrack-component">
      {data.items.map((item, index) => (
        <div key={index} className="soundtrack-item">
          <div className="soundtrack-header">
            <input
              type="text"
              value={item.titulo}
              onChange={(e) => handleItemChange(index, 'titulo', e.target.value)}
              placeholder="Título de la canción"
            />
            <input
              type="text"
              value={item.artista}
              onChange={(e) => handleItemChange(index, 'artista', e.target.value)}
              placeholder="Artista"
            />
            <button onClick={() => removeItem(index)} className="remove-btn">×</button>
          </div>
          <input
            type="text"
            value={item.momento}
            onChange={(e) => handleItemChange(index, 'momento', e.target.value)}
            placeholder="Momento específico del capítulo"
          />
        </div>
      ))}
      <button onClick={addItem} className="add-btn">+ Agregar canción</button>
    </div>
  )
}

export default ComponentRenderer