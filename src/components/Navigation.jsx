// src/components/Navigation.jsx
import './Navigation.css'

const Navigation = ({ 
  onHome, 
  onCreateItem, 
  onExportData, 
  onImportData, 
  currentView 
}) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <button 
          className="nav-brand-btn"
          onClick={onHome}
        >
          <h1>ReloadXPs</h1>
          <span className="nav-subtitle">Universe Platform</span>
        </button>
      </div>
      
      <div className="nav-actions">
        <button 
          className="btn blue"
          onClick={onCreateItem}
        >
          Crear
        </button>
        
        <div className="nav-tools">
          <button 
            className="btn secondary"
            onClick={onExportData}
          >
            Exportar
          </button>
          
          <label className="btn secondary file-input-label">
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