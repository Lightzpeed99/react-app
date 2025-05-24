// src/components/CharacterCard.jsx
import './CharacterCard.css'

const CharacterCard = ({ character, onClick }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'protagonista': return '#00ff41'
      case 'entidad_superior': return '#ff0080'
      case 'entidad_colectiva': return '#8000ff'
      default: return '#ffffff'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'protagonista': return 'Protagonista'
      case 'entidad_superior': return 'Entidad Superior'
      case 'entidad_colectiva': return 'Entidad Colectiva'
      default: return 'Tipo desconocido'
    }
  }

  return (
    <div className="character-card" onClick={onClick}>
      <div className="card-image">
        {character.imagen ? (
          <img src={character.imagen} alt={character.nombre} />
        ) : (
          <div className="placeholder-image">
            <span>🎭</span>
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="character-name">{character.nombre}</h3>
        <span 
          className="character-type"
          style={{ color: getTypeColor(character.tipo) }}
        >
          {getTypeLabel(character.tipo)}
        </span>
        <p className="character-description">
          {character.descripcion || 'Sin descripción'}
        </p>
      </div>
      
      <div className="card-footer">
        <div className="component-count">
          {character.components ? Object.keys(character.components).length : 0} componentes
        </div>
        <button className="view-btn">Ver detalles →</button>
      </div>
    </div>
  )
}

export default CharacterCard