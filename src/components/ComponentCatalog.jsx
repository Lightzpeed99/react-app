// src/components/ComponentCatalog.jsx
import { useState } from 'react'
import './ComponentCatalog.css'

const ComponentCatalog = ({ itemType, onSelectComponent, onClose }) => {
  const [activeTab, setActiveTab] = useState('personajes')

  const componentsByCategory = {
    personajes: [
      {
        id: 'motivaciones',
        name: 'Motivaciones',
        description: 'Lista de motivaciones del personaje',
        icon: '🎯'
      },
      {
        id: 'habilidades',
        name: 'Habilidades',
        description: 'Capacidades y habilidades específicas',
        icon: '⚡'
      },
      {
        id: 'evolucion_arcos',
        name: 'Evolución por Arcos',
        description: 'Desarrollo del personaje a través de los arcos narrativos',
        icon: '📈'
      },
      {
        id: 'relaciones',
        name: 'Relaciones',
        description: 'Conexiones con otros personajes',
        icon: '🔗'
      },
      {
        id: 'atributos_clave',
        name: 'Atributos Clave',
        description: 'Características fundamentales del personaje',
        icon: '🗝️'
      },
      {
        id: 'manifestacion',
        name: 'Manifestación',
        description: 'Cómo se manifiesta visual, sonora y físicamente',
        icon: '👁️'
      },
      {
        id: 'debilidades',
        name: 'Debilidades',
        description: 'Puntos vulnerables del personaje',
        icon: '💔'
      },
      {
        id: 'rol_narrativo',
        name: 'Rol Narrativo',
        description: 'Función del personaje en la historia',
        icon: '🎭'
      },
      {
        id: 'giro_narrativo',
        name: 'Giro Narrativo',
        description: 'Revelaciones importantes sobre el personaje',
        icon: '🌀'
      },
      {
        id: 'fuentes_referencias',
        name: 'Fuentes y Referencias',
        description: 'Enlaces a arcos, capítulos y contenido relacionado',
        icon: '📚'
      }
    ],
    historias: [
      {
        id: 'tematica_principal',
        name: 'Temática Principal',
        description: 'El tema central del arco narrativo',
        icon: '🎭'
      },
      {
        id: 'estilo_visual',
        name: 'Estilo Visual',
        description: 'Paleta, efectos y transiciones visuales',
        icon: '🎨'
      },
      {
        id: 'perfil_sonoro',
        name: 'Perfil Sonoro',
        description: 'Música, efectos de audio característicos',
        icon: '🎵'
      },
      {
        id: 'emociones_clave',
        name: 'Emociones Clave',
        description: 'Emociones que se desbloquean o exploran',
        icon: '💭'
      },
      {
        id: 'entidades_activas',
        name: 'Entidades Activas',
        description: 'Qué Stayed/Ángeles aparecen en el arco',
        icon: '👹'
      },
      {
        id: 'tecnologias',
        name: 'Tecnologías',
        description: 'Tecnologías que se introducen o evolucionan',
        icon: '🔧'
      },
      {
        id: 'evento_culminante',
        name: 'Evento Culminante',
        description: 'El momento clave que define el arco',
        icon: '🌟'
      },
      {
        id: 'sinopsis',
        name: 'Sinopsis',
        description: 'Resumen del arco o capítulo',
        icon: '📝'
      },
      {
        id: 'secuencias_clave',
        name: 'Secuencias Clave',
        description: 'Momentos importantes paso a paso',
        icon: '🎬'
      },
      {
        id: 'estado_emocional',
        name: 'Estado Emocional',
        description: 'Cómo está LACE emocionalmente',
        icon: '🧠'
      },
      {
        id: 'conexiones',
        name: 'Conexiones',
        description: 'Referencias a otros capítulos/arcos',
        icon: '🔄'
      },
      {
        id: 'referencias_visuales',
        name: 'Referencias Visuales',
        description: 'Links, imágenes, mood boards',
        icon: '📸'
      },
      {
        id: 'soundtrack',
        name: 'Soundtrack',
        description: 'Música específica del capítulo',
        icon: '🎧'
      }
    ]
  }

  // Determinar tab inicial basado en el tipo de item
  useState(() => {
    if (itemType === 'arcos') {
      setActiveTab('historias')
    } else {
      setActiveTab('personajes')
    }
  }, [itemType])

  const currentComponents = componentsByCategory[activeTab] || []

  return (
    <div className="component-catalog-overlay">
      <div className="component-catalog-modal">
        <div className="modal-header">
          <h3>Seleccionar Componente</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Tabs */}
        <div className="component-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personajes' ? 'active' : ''}`}
            onClick={() => setActiveTab('personajes')}
          >
            <span className="tab-icon">👥</span>
            Personajes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historias' ? 'active' : ''}`}
            onClick={() => setActiveTab('historias')}
          >
            <span className="tab-icon">📖</span>
            Historias
          </button>
        </div>
        
        <div className="components-grid">
          {currentComponents.map(component => (
            <div 
              key={component.id}
              className="component-item"
              onClick={() => onSelectComponent(component.id)}
            >
              <div className="component-icon">{component.icon}</div>
              <div className="component-info">
                <h4>{component.name}</h4>
                <p>{component.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComponentCatalog