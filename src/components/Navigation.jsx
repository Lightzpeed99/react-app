// src/components/Navigation.jsx
import './Navigation.css'

const Navigation = ({ 
  onHome, 
  onCreateItem, 
  onExportData, 
  onImportData, 
  onGoToDictionary,
  onGoToNotebook,
  onGoToSoundtrack,
  currentView 
}) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <button 
          className="nav-brand-btn"
          onClick={onHome}
        >
          <h1>Reload</h1>
          <span className="nav-subtitle">The Project Verse</span>
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
            className="nav-tool-btn"
            onClick={onExportData}
          >
            ⬇ Exportar
          </button>
          
          <label className="nav-tool-btn file-input-label">
            ⬆ Importar
            <input 
              type="file" 
              accept=".json"
              onChange={onImportData}
              style={{ display: 'none' }}
            />
          </label>

          <button 
            className="nav-tool-btn"
            onClick={onGoToDictionary}
          >
            📚 Diccionario
          </button>

          <button 
            className="nav-tool-btn"
            onClick={onGoToNotebook}
          >
            📓 Libreta
          </button>

          <button 
            className="nav-tool-btn"
            onClick={onGoToSoundtrack}
          >
            🎵 Soundtrack
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation