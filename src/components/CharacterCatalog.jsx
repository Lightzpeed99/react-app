// src/components/CharacterCatalog.jsx
import CharacterCard from './CharacterCard'
import './CharacterCatalog.css'

const CharacterCatalog = ({ items, onViewItem, onCreateItem }) => {
  // Filtrar por tipos
  const personajes = items.filter(item => ['lace', 'ia_cuantica', 'stayed', 'angeles'].includes(item.tipo))
  const arcos = items.filter(item => item.tipo === 'arcos')

  return (
    <div className="character-catalog">
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌌</div>
          <h3>Universo Vacío</h3>
          <p>Comienza creando las entidades y arcos narrativos del universo ReloadXPs</p>
          <button 
            className="btn blue"
            onClick={onCreateItem}
          >
            Crear Primer Elemento
          </button>
        </div>
      ) : (
        <div className="catalog-sections">
          {personajes.length > 0 && (
            <section className="catalog-section">
              <h3 className="section-title">
                <span className="section-icon">👥</span>
                Entidades del Universo
                <span className="entity-count">({personajes.length})</span>
              </h3>
              <div className="items-grid">
                {personajes.map(item => (
                  <CharacterCard 
                    key={item.id}
                    item={item}
                    onClick={() => onViewItem(item)}
                  />
                ))}
              </div>
            </section>
          )}

          {arcos.length > 0 && (
            <section className="catalog-section">
              <h3 className="section-title">
                <span className="section-icon">📖</span>
                Arcos Narrativos
                <span className="entity-count">({arcos.length})</span>
              </h3>
              <div className="items-grid">
                {arcos.map(item => (
                  <CharacterCard 
                    key={item.id}
                    item={item}
                    onClick={() => onViewItem(item)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default CharacterCatalog