// src/components/CharacterCatalog.jsx
import CharacterCard from './CharacterCard'
import './CharacterCatalog.css'

const CharacterCatalog = ({ characters, onViewCharacter, onCreateCharacter }) => {
  return (
    <div className="character-catalog">
      <div className="catalog-header">
        <h2>Personajes del Universo</h2>
        <p className="catalog-count">{characters.length} personajes registrados</p>
      </div>
      
      {characters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No hay personajes registrados</h3>
          <p>Comienza creando tu primer personaje del universo ReloadXPs</p>
          <button 
            className="btn primary"
            onClick={onCreateCharacter}
          >
            Crear Primer Personaje
          </button>
        </div>
      ) : (
        <div className="characters-grid">
          {characters.map(character => (
            <CharacterCard 
              key={character.id}
              character={character}
              onClick={() => onViewCharacter(character)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CharacterCatalog