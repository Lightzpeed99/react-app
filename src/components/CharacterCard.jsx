// src/components/CharacterCard.jsx
import './CharacterCard.css'

const CharacterCard = ({ item, onClick }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'lace': return '#00d4ff'
      case 'ia_cuantica': return '#ffd700'
      case 'stayed': return '#ff3333'
      case 'angeles': return '#ff6600'
      case 'arcos': return '#00ff41'
      default: return '#ffffff'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'lace': return 'LACE'
      case 'ia_cuantica': return 'IA Cuántica'
      case 'stayed': return 'Stayed'
      case 'angeles': return 'Ángeles'
      case 'arcos': return 'Arco Narrativo'
      default: return 'Desconocido'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lace': return '🤖'
      case 'ia_cuantica': return '⚡'
      case 'stayed': return '👹'
      case 'angeles': return '👼'
      case 'arcos': return '📖'
      default: return '❓'
    }
  }

  return (
    <div className="character-card" onClick={onClick}>
      <div className="card-image">
        {item.imagen ? (
          <img src={item.imagen} alt={item.nombre} />
        ) : (
          <div className="placeholder-image">
            <span>{getTypeIcon(item.tipo)}</span>
          </div>
        )}
        <div 
          className="type-overlay"
          style={{ background: `linear-gradient(135deg, ${getTypeColor(item.tipo)}20, ${getTypeColor(item.tipo)}10)` }}
        >
          <span className="type-icon">{getTypeIcon(item.tipo)}</span>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="character-name">{item.nombre}</h3>
        <span 
          className="character-type"
          style={{ 
            color: getTypeColor(item.tipo),
            borderColor: getTypeColor(item.tipo),
            boxShadow: `0 0 10px ${getTypeColor(item.tipo)}30`
          }}
        >
          {getTypeLabel(item.tipo)}
        </span>
        <p className="character-description">
          {item.descripcion || 'Sin descripción'}
        </p>
      </div>
      
      <div className="card-footer">
        <div className="component-count">
          {item.components ? Object.keys(item.components).length : 0} componentes
        </div>
        <button 
          className="view-btn"
          style={{ color: getTypeColor(item.tipo) }}
        >
          Ver detalles →
        </button>
      </div>
    </div>
  )
}

export default CharacterCard