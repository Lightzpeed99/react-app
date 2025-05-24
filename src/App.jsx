// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import CharacterCatalog from './components/CharacterCatalog'
import CharacterDetail from './components/CharacterDetail'
import Navigation from './components/Navigation'

function App() {
  const [currentView, setCurrentView] = useState('catalog')
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [characters, setCharacters] = useState([])

  // Cargar personajes del localStorage al iniciar
  useEffect(() => {
    const savedCharacters = localStorage.getItem('reloadxps_characters')
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters))
    }
  }, [])

  // Guardar personajes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('reloadxps_characters', JSON.stringify(characters))
  }, [characters])

  const handleViewCharacter = (character) => {
    setSelectedCharacter(character)
    setCurrentView('detail')
  }

  const handleCreateCharacter = () => {
    setSelectedCharacter(null)
    setCurrentView('detail')
  }

  const handleSaveCharacter = (characterData) => {
    if (selectedCharacter) {
      // Editar personaje existente
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? { ...characterData, id: selectedCharacter.id } : char
      ))
    } else {
      // Crear nuevo personaje
      const newCharacter = {
        ...characterData,
        id: Date.now().toString()
      }
      setCharacters([...characters, newCharacter])
    }
    setCurrentView('catalog')
  }

  const handleDeleteCharacter = (characterId) => {
    setCharacters(characters.filter(char => char.id !== characterId))
    setCurrentView('catalog')
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(characters, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'reloadxps_characters.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          setCharacters(importedData)
        } catch (error) {
          alert('Error al importar el archivo. Verifica que sea un JSON válido.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="app">
      <Navigation 
        onHome={() => setCurrentView('catalog')}
        onCreateCharacter={handleCreateCharacter}
        onExportData={handleExportData}
        onImportData={handleImportData}
        currentView={currentView}
      />
      
      <main className="main-content">
        {currentView === 'catalog' ? (
          <CharacterCatalog 
            characters={characters}
            onViewCharacter={handleViewCharacter}
            onCreateCharacter={handleCreateCharacter}
          />
        ) : (
          <CharacterDetail 
            character={selectedCharacter}
            onSave={handleSaveCharacter}
            onDelete={handleDeleteCharacter}
            onCancel={() => setCurrentView('catalog')}
          />
        )}
      </main>
    </div>
  )
}

export default App