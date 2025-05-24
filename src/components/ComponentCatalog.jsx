// src/components/ComponentCatalog.jsx
import './ComponentCatalog.css'

const ComponentCatalog = ({ onSelectComponent, onClose }) => {
  const components = [
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
  ]

  return (
    <div className="component-catalog-overlay">
      <div className="component-catalog-modal">
        <div className="modal-header">
          <h3>Seleccionar Componente</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="components-grid">
          {components.map(component => (
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