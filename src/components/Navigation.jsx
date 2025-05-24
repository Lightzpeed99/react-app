// src/components/Navigation.jsx
import './Navigation.css'

const Navigation = ({ 
  onHome, 
  onCreateCharacter, 
  onExportData, 
  onImportData, 
  currentView 
}) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>ReloadXPs</h1>
        <span className="nav-subtitle">Character Platform</span>
      </div>
      
      <div className="nav-actions">
        <button 
          className={`nav-btn ${currentView === 'catalog' ? 'active' : ''}`}
          onClick={onHome}
        >
          Catálogo
        </button>
        
        <button 
          className="nav-btn primary"
          onClick={onCreateCharacter}
        >
          + Crear Personaje
        </button>
        
        <div className="nav-tools">
          <button 
            className="nav-btn secondary"
            onClick={onExportData}
          >
            Exportar
          </button>
          
          <label className="nav-btn secondary file-input-label">
            Importar
            <input 
              type="file" 
              accept=".json"
              onChange={onImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </nav>
  )
}

export default Navigation