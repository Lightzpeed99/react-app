// src/components/CharacterCatalog.jsx
import CharacterCard from './CharacterCard'
import './CharacterCatalog.css'

const CharacterCatalog = ({ items, onViewItem, onCreateItem }) => {
  // Filtrar por tipos
  const personajes = items.filter(item => ['lace', 'ia_cuantica', 'stayed', 'angeles'].includes(item.tipo))
  const arcos = items.filter(item => item.tipo === 'arcos')

  return (
    <div className="character-catalog">
      <div className="catalog-header">
        <h2>Universo ReloadXPs</h2>
        <div className="catalog-stats">
          <span className="stat-item">
            <span className="stat-number">{personajes.length}</span>
            <span className="stat-label">Entidades</span>
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <span className="stat-number">{arcos.length}</span>
            <span className="stat-label">Arcos</span>
          </span>
        </div>
      </div>
      
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

          <div className="create-new-section">
            <button 
              className="btn blue create-new-btn"
              onClick={onCreateItem}
            >
              <span className="btn-icon">✨</span>
              Crear Nueva Entidad o Arco
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CharacterCatalog