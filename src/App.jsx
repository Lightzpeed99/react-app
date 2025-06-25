// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import CharacterCatalog from './components/CharacterCatalog'
import CharacterDetail from './components/CharacterDetail'
import DictionaryView from './components/DictionaryView'
import Navigation from './components/Navigation'

function App() {
  const [currentView, setCurrentView] = useState('catalog')
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState([])

  // Cargar items del localStorage al iniciar
  useEffect(() => {
    const savedItems = localStorage.getItem('reloadxps_items')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Guardar items en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('reloadxps_items', JSON.stringify(items))
  }, [items])

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setCurrentView('detail')
  }

  const handleCreateItem = () => {
    setSelectedItem(null)
    setCurrentView('detail')
  }

  const handleSaveItem = (itemData) => {
    if (selectedItem) {
      // Editar item existente
      setItems(items.map(item => 
        item.id === selectedItem.id ? { ...itemData, id: selectedItem.id } : item
      ))
    } else {
      // Crear nuevo item
      const newItem = {
        ...itemData,
        id: Date.now().toString()
      }
      setItems([...items, newItem])
    }
    setCurrentView('catalog')
  }

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId))
    setCurrentView('catalog')
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(items, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'reloadxps_data.json'
    
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
          setItems(importedData)
        } catch (error) {
          alert('Error al importar el archivo. Verifica que sea un JSON válido.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleGoToDictionary = () => {
    setCurrentView('dictionary')
  }

  const handleGoHome = () => {
    setCurrentView('catalog')
    setSelectedItem(null)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'catalog':
        return (
          <CharacterCatalog 
            items={items}
            onViewItem={handleViewItem}
            onCreateItem={handleCreateItem}
          />
        )
      case 'detail':
        return (
          <CharacterDetail 
            item={selectedItem}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
            onCancel={handleGoHome}
          />
        )
      case 'dictionary':
        return <DictionaryView />
      default:
        return (
          <CharacterCatalog 
            items={items}
            onViewItem={handleViewItem}
            onCreateItem={handleCreateItem}
          />
        )
    }
  }

  return (
    <div className="app">
      <Navigation 
        onHome={handleGoHome}
        onCreateItem={handleCreateItem}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onGoToDictionary={handleGoToDictionary}
        currentView={currentView}
      />
      
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App