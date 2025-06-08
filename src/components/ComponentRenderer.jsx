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
      soundtrack: 'Reload Soundtrack'  // Título con estilo Reload
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
            <h4 className={component.type === 'soundtrack' ? 'reload-title' : ''}>
              {getComponentName(component.type)}
            </h4>
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
// Componente para Soundtrack (SUNO Version)
const SoundtrackComponent = ({ data, onUpdate, componentId }) => {
  const [selectedTrack, setSelectedTrack] = useState(null)

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate(componentId, { items: newItems })
  }

  const addItem = () => {
    onUpdate(componentId, { 
      items: [...data.items, { 
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
    })
  }

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onUpdate(componentId, { items: newItems })
  }

  const addTag = (trackIndex, tag) => {
    if (!tag.trim()) return
    const newItems = [...data.items]
    if (!newItems[trackIndex].tags) newItems[trackIndex].tags = []
    if (!newItems[trackIndex].tags.includes(tag)) {
      newItems[trackIndex].tags.push(tag)
      onUpdate(componentId, { items: newItems })
    }
  }

  const removeTag = (trackIndex, tagIndex) => {
    const newItems = [...data.items]
    newItems[trackIndex].tags.splice(tagIndex, 1)
    onUpdate(componentId, { items: newItems })
  }

  const addCuePoint = (trackIndex) => {
    const newItems = [...data.items]
    if (!newItems[trackIndex].cuePoints) newItems[trackIndex].cuePoints = []
    newItems[trackIndex].cuePoints.push({
      tiempo: '0:00',
      etiqueta: '',
      tipo: 'general',
      color: '#00d4ff'
    })
    onUpdate(componentId, { items: newItems })
  }

  const updateCuePoint = (trackIndex, cueIndex, field, value) => {
    const newItems = [...data.items]
    newItems[trackIndex].cuePoints[cueIndex][field] = value
    onUpdate(componentId, { items: newItems })
  }

  const removeCuePoint = (trackIndex, cueIndex) => {
    const newItems = [...data.items]
    newItems[trackIndex].cuePoints.splice(cueIndex, 1)
    onUpdate(componentId, { items: newItems })
  }

  const addEstructura = (trackIndex) => {
    const newItems = [...data.items]
    if (!newItems[trackIndex].estructura) newItems[trackIndex].estructura = []
    newItems[trackIndex].estructura.push({
      seccion: 'Intro',
      inicio: '0:00',
      fin: '0:16',
      descripcion: ''
    })
    onUpdate(componentId, { items: newItems })
  }

  const updateEstructura = (trackIndex, estructuraIndex, field, value) => {
    const newItems = [...data.items]
    newItems[trackIndex].estructura[estructuraIndex][field] = value
    onUpdate(componentId, { items: newItems })
  }

  const removeEstructura = (trackIndex, estructuraIndex) => {
    const newItems = [...data.items]
    newItems[trackIndex].estructura.splice(estructuraIndex, 1)
    onUpdate(componentId, { items: newItems })
  }

  const getGenreColor = (tags) => {
    if (!tags || tags.length === 0) return '#00d4ff'
    const tag = tags[0].toLowerCase()
    if (tag.includes('psytrance') || tag.includes('trance')) return '#ff6600'
    if (tag.includes('edm') || tag.includes('electronic')) return '#00ff41'
    if (tag.includes('ambient') || tag.includes('chill')) return '#ffd700'
    if (tag.includes('techno') || tag.includes('house')) return '#ff3333'
    if (tag.includes('cyberpunk') || tag.includes('cyber')) return '#ff0080'
    return '#00d4ff'
  }

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

  const estructuraTipos = ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Drop', 'Break', 'Bridge', 'Outro', 'Build-up', 'Breakdown']

  return (
    <div className="suno-soundtrack-component">
      {data.items.map((track, trackIndex) => (
        <div key={trackIndex} className="suno-track-item" style={{ borderLeft: `4px solid ${getGenreColor(track.tags)}` }}>
          
          {/* Header del Track */}
          <div className="track-header">
            <div className="track-main-info">
              <input
                type="text"
                value={track.titulo}
                onChange={(e) => handleItemChange(trackIndex, 'titulo', e.target.value)}
                placeholder="Título de la canción"
                className="track-title-input"
              />
              <div className="track-meta">
                <input
                  type="text"
                  value={track.duracion}
                  onChange={(e) => handleItemChange(trackIndex, 'duracion', e.target.value)}
                  placeholder="3:30"
                  className="duration-input"
                />
                <select
                  value={track.version}
                  onChange={(e) => handleItemChange(trackIndex, 'version', e.target.value)}
                  className="version-select"
                >
                  <option value="v4.5">v4.5</option>
                  <option value="v4.0">v4.0</option>
                  <option value="v3.5">v3.5</option>
                </select>
              </div>
            </div>
            <button onClick={() => removeItem(trackIndex)} className="remove-btn">×</button>
          </div>

          {/* Información Técnica */}
          <div className="track-technical">
            <div className="tech-row">
              <input
                type="text"
                value={track.bpm}
                onChange={(e) => handleItemChange(trackIndex, 'bpm', e.target.value)}
                placeholder="BPM"
                className="bpm-input"
              />
              <input
                type="text"
                value={track.key}
                onChange={(e) => handleItemChange(trackIndex, 'key', e.target.value)}
                placeholder="Key (Ej: Am, C#)"
                className="key-input"
              />
              <input
                type="url"
                value={track.sunoUrl}
                onChange={(e) => handleItemChange(trackIndex, 'sunoUrl', e.target.value)}
                placeholder="https://suno.com/song/..."
                className="suno-url-input"
              />
            </div>
          </div>

          {/* Prompt de Suno */}
          <div className="prompt-section">
            <label>Prompt utilizado en Suno:</label>
            <textarea
              value={track.prompt}
              onChange={(e) => handleItemChange(trackIndex, 'prompt', e.target.value)}
              placeholder="Ingresa el prompt que usaste en Suno AI..."
              rows={3}
              className="prompt-textarea"
            />
          </div>

          {/* Tags/Géneros */}
          <div className="tags-section">
            <label>Tags & Géneros:</label>
            <div className="tags-container">
              {track.tags && track.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag-chip" style={{ borderColor: getGenreColor([tag]) }}>
                  {tag}
                  <button onClick={() => removeTag(trackIndex, tagIndex)} className="tag-remove">×</button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Agregar tag..."
                className="tag-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(trackIndex, e.target.value)
                    e.target.value = ''
                  }
                }}
              />
            </div>
          </div>

          {/* Controles de Energía e Intensidad */}
          <div className="energy-controls">
            <div className="energy-slider">
              <label>Energía: {track.energia}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={track.energia || 50}
                onChange={(e) => handleItemChange(trackIndex, 'energia', e.target.value)}
                className="slider energia-slider"
              />
            </div>
            <div className="intensity-slider">
              <label>Intensidad: {track.intensidad}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={track.intensidad || 50}
                onChange={(e) => handleItemChange(trackIndex, 'intensidad', e.target.value)}
                className="slider intensity-slider"
              />
            </div>
          </div>

          {/* Estructura Musical */}
          <div className="estructura-section">
            <div className="section-header">
              <label>Estructura Musical:</label>
              <button onClick={() => addEstructura(trackIndex)} className="add-small-btn">+ Sección</button>
            </div>
            {track.estructura && track.estructura.map((seccion, seccionIndex) => (
              <div key={seccionIndex} className="estructura-item">
                <select
                  value={seccion.seccion}
                  onChange={(e) => updateEstructura(trackIndex, seccionIndex, 'seccion', e.target.value)}
                  className="estructura-select"
                >
                  {estructuraTipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={seccion.inicio}
                  onChange={(e) => updateEstructura(trackIndex, seccionIndex, 'inicio', e.target.value)}
                  placeholder="0:00"
                  className="time-input"
                />
                <span>-</span>
                <input
                  type="text"
                  value={seccion.fin}
                  onChange={(e) => updateEstructura(trackIndex, seccionIndex, 'fin', e.target.value)}
                  placeholder="0:16"
                  className="time-input"
                />
                <input
                  type="text"
                  value={seccion.descripcion}
                  onChange={(e) => updateEstructura(trackIndex, seccionIndex, 'descripcion', e.target.value)}
                  placeholder="Descripción..."
                  className="descripcion-input"
                />
                <button onClick={() => removeEstructura(trackIndex, seccionIndex)} className="remove-small-btn">×</button>
              </div>
            ))}
          </div>

          {/* Cue Points */}
          <div className="cue-points-section">
            <div className="section-header">
              <label>Cue Points (para DJ/Mixing):</label>
              <button onClick={() => addCuePoint(trackIndex)} className="add-small-btn">+ Cue Point</button>
            </div>
            {track.cuePoints && track.cuePoints.map((cue, cueIndex) => (
              <div key={cueIndex} className="cue-point-item">
                <input
                  type="text"
                  value={cue.tiempo}
                  onChange={(e) => updateCuePoint(trackIndex, cueIndex, 'tiempo', e.target.value)}
                  placeholder="1:23"
                  className="time-input"
                />
                <select
                  value={cue.tipo}
                  onChange={(e) => {
                    updateCuePoint(trackIndex, cueIndex, 'tipo', e.target.value)
                    const selectedType = cueTypes.find(t => t.value === e.target.value)
                    if (selectedType) {
                      updateCuePoint(trackIndex, cueIndex, 'color', selectedType.color)
                    }
                  }}
                  className="cue-type-select"
                >
                  {cueTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={cue.etiqueta}
                  onChange={(e) => updateCuePoint(trackIndex, cueIndex, 'etiqueta', e.target.value)}
                  placeholder="Etiqueta del cue..."
                  className="cue-label-input"
                />
                <div 
                  className="cue-color-indicator" 
                  style={{ backgroundColor: cue.color || '#00d4ff' }}
                ></div>
                <button onClick={() => removeCuePoint(trackIndex, cueIndex)} className="remove-small-btn">×</button>
              </div>
            ))}
          </div>

          {/* Momento Narrativo */}
          <div className="narrative-section">
            <label>Momento Narrativo:</label>
            <input
              type="text"
              value={track.momento}
              onChange={(e) => handleItemChange(trackIndex, 'momento', e.target.value)}
              placeholder="Cuándo se usa en la historia..."
              className="momento-input"
            />
          </div>

          {/* Notas y Variaciones */}
          <div className="notes-section">
            <label>Notas & Variaciones:</label>
            <textarea
              value={track.notas}
              onChange={(e) => handleItemChange(trackIndex, 'notas', e.target.value)}
              placeholder="Notas sobre iteraciones, cambios, ideas para remix..."
              rows={2}
              className="notes-textarea"
            />
          </div>

        </div>
      ))}
      
      <button onClick={addItem} className="add-btn">
        🎵 + Agregar Track de Suno
      </button>
    </div>
  )
}

export default ComponentRenderer