// src/components/DictionaryView.jsx
import { useState, useEffect } from "react";
import "./DictionaryView.css";

const DictionaryView = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Categorías iniciales con ejemplos
  const initialCategories = [
    {
      id: "poder_energia",
      name: "PODER/ENERGÍA",
      words: [],
      placeholder: "Ej: BLAST, BOLD, POWERFULL, ENERGY, POWER, PULSE",
    },
    {
      id: "prefijos",
      name: "PREFIJOS",
      words: [],
      placeholder: "Ej: RE-, MUTATION, DEVASTATION, REVELATION, IGNITE",
    },
    {
      id: "sufijos",
      name: "SUFIJOS",
      words: [],
      placeholder: "Ej: -ATION, -UTION",
    },
    {
      id: "actions",
      name: "ACTIONS",
      words: [],
      placeholder:
        "Ej: EVOLVE, MERGE, ROLLING, COMPLETE, DESTROY, RISE, CHARGING, DRAIN",
    },
    {
      id: "terms",
      name: "TERMS",
      words: [],
      placeholder:
        "Ej: SYSTEMS, SYLLABE, PRECISION, ULTIMATE, THERAPY, SCREAMS, SECRET, MASTER, RUPTURE, SHADOWS, DEMON, STAYED",
    },
    {
      id: "concepto",
      name: "CONCEPTO",
      words: [],
      placeholder:
        "Ej: REFLEX, UNREAL, GOD, FOREVER, LOOP, LIGHTNING, CYCLE, BRUTAL, PARTY, DARK, ESSENCE, QUANTUM",
    },
    {
      id: "tech_language",
      name: "TECH LANGUAGE",
      words: [],
      placeholder:
        "Ej: METAMORFOSIS, MORPH, DIGITAL, BOOT, TECH, HITECH, COMPLETE, PORTAL, CIBER",
    },
    {
      id: "universal",
      name: "UNIVERSAL",
      words: [],
      placeholder:
        "Ej: COSMIC, ETERNAL, REALITY, SIMULATION, FREQUENCY, PARTICLE, INFINITE, MATRIX, UNIVERSE",
    },
    {
      id: "fx",
      name: "FX",
      words: [],
      placeholder: "Ej: WARFARE, SPARK, CLICK, LIGHT, INDIAN SCREAM",
    },
    {
      id: "physics",
      name: "PHYSICS",
      words: [],
      placeholder: "Ej: HEAVY, FADE",
    },
    {
      id: "onomatopeyas",
      name: "ONOMATOPEYAS",
      words: [],
      placeholder:
        "Ej: DROPS, FLAUTAS, BEATS, CLAP, WOOOIII, YAAAAAIII, AAAHHH, SHIFT SHIFT, BOOHMBOOOW",
    },
    {
      id: "position",
      name: "POSITION",
      words: [],
      placeholder: "Ej: INSIDE",
    },
    {
      id: "phrases",
      name: "PHRASES",
      words: [],
      placeholder: "Ej: HERE WE GO, I WANT BACK, BACK GO AGAIN",
    },
  ];

  // Cargar categorías del localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("reloadxps_dictionary");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(initialCategories);
    }
  }, []);

  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("reloadxps_dictionary", JSON.stringify(categories));
    }
  }, [categories]);

  // NUEVAS FUNCIONES EXPORT/IMPORT
  const handleExportDictionary = () => {
    const exportData = {
      categories: categories,
      exportDate: new Date().toISOString().split("T")[0],
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "reloadxps_dictionary.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportDictionary = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          // Validar estructura
          if (
            importedData.categories &&
            Array.isArray(importedData.categories)
          ) {
            if (
              confirm(
                "¿Estás seguro de reemplazar el diccionario actual? Esta acción no se puede deshacer."
              )
            ) {
              setCategories(importedData.categories);
            }
          } else {
            alert(
              "Error: El archivo no tiene el formato correcto de diccionario."
            );
          }
        } catch (error) {
          alert(
            "Error al importar el archivo. Verifica que sea un JSON válido."
          );
        }
      };
      reader.readAsText(file);
    }
    // Limpiar el input para permitir reimportar el mismo archivo
    event.target.value = "";
  };

  const handleCategoryClick = (index) => {
    setSelectedCategoryIndex(index);
    setShowModal(true);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.toUpperCase(),
        words: [],
        placeholder: "Ej: palabra1, palabra2, palabra3",
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setShowNewCategoryModal(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleRenameCategory = (index, newName) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = newName.toUpperCase();
    setCategories(updatedCategories);
  };

  const getNeighborCategories = (currentIndex) => {
    const neighbors = [];
    const totalCategories = categories.length;

    // Categoría actual en el centro
    const current = categories[currentIndex];

    // 4 vecinas: 2 anteriores y 2 siguientes (con wrap around)
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // Skip current category
      let neighborIndex =
        (currentIndex + i + totalCategories) % totalCategories;
      neighbors.push({ ...categories[neighborIndex], index: neighborIndex });
    }

    return { current: { ...current, index: currentIndex }, neighbors };
  };

  return (
    <div className="dictionary-view">
      <div className="dictionary-header">
        <h2>Diccionario Cósmico Suniversal</h2>
        <p>Banco de palabras y frases para prompts creativos</p>

        {/* NUEVOS BOTONES EXPORT/IMPORT */}
        <div className="dictionary-tools">
          <button className="dict-tool-btn" onClick={handleExportDictionary}>
            ⬇ Exportar Diccionario
          </button>

          <label className="dict-tool-btn file-input-label">
            ⬆ Importar Diccionario
            <input
              type="file"
              accept=".json"
              onChange={handleImportDictionary}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(index)}
          >
            <div className="category-icon">📝</div>
            <h3 className="category-name">{category.name}</h3>
            <div className="category-stats">
              <span className="word-count">
                {category.words.length} palabras
              </span>
            </div>
            <button
              className="delete-category-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button
        className="floating-add-btn"
        onClick={() => setShowNewCategoryModal(true)}
      >
        +
      </button>

      {showModal && selectedCategoryIndex !== null && (
        <DictionaryModal
          categoryData={getNeighborCategories(selectedCategoryIndex)}
          categories={categories}
          setCategories={setCategories}
          onClose={() => setShowModal(false)}
          onRenameCategory={handleRenameCategory}
        />
      )}

      {showNewCategoryModal && (
        <div className="modal-overlay">
          <div className="new-category-modal">
            <h3>Nueva Categoría</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="btn secondary"
                onClick={() => setShowNewCategoryModal(false)}
              >
                Cancelar
              </button>
              <button className="btn primary" onClick={handleCreateCategory}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// COMPONENTE MODAL ACTUALIZADO CON SISTEMA DE BADGES
const DictionaryModal = ({
  categoryData,
  categories,
  setCategories,
  onClose,
  onRenameCategory,
}) => {
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  const { current, neighbors } = categoryData;

  // NUEVA FUNCIÓN PARA AGREGAR PALABRA COMO BADGE
  const addWord = (categoryIndex, word) => {
    if (!word.trim()) return;

    const updatedCategories = [...categories];
    const category = updatedCategories[categoryIndex];

    // Evitar duplicados
    if (!category.words.includes(word.trim().toUpperCase())) {
      category.words.push(word.trim().toUpperCase());
      setCategories(updatedCategories);
    }
  };

  // NUEVA FUNCIÓN PARA ELIMINAR PALABRA
  const removeWord = (categoryIndex, wordIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].words.splice(wordIndex, 1);
    setCategories(updatedCategories);
  };

  const handleNameEdit = (index, currentName) => {
    setEditingName(index);
    setTempName(currentName);
  };

  const handleNameSave = (index) => {
    onRenameCategory(index, tempName);
    setEditingName(null);
  };

  // COMPONENTE PARA RENDERIZAR BADGES + INPUT
  const WordBadgesInput = ({ category, categoryIndex, isCurrentCategory }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        addWord(categoryIndex, inputValue);
        setInputValue("");
      }
    };

    const getWordColor = (word) => {
      // Colores basados en la primera letra o tipo de palabra
      const firstChar = word.charAt(0).toLowerCase();
      if (firstChar >= "a" && firstChar <= "f") return "#00d4ff";
      if (firstChar >= "g" && firstChar <= "l") return "#00ff41";
      if (firstChar >= "m" && firstChar <= "r") return "#ffd700";
      if (firstChar >= "s" && firstChar <= "z") return "#ff6600";
      return "#ff0080";
    };

    return (
      <div className="word-badges-container">
        <div className="badges-grid">
          {category.words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="word-badge"
              style={{ borderColor: getWordColor(word) }}
            >
              {word}
              <button
                onClick={() => removeWord(categoryIndex, wordIndex)}
                className="badge-remove"
                style={{ color: getWordColor(word) }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={category.placeholder}
          className={`word-input ${isCurrentCategory ? "current-input" : ""}`}
        />
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="dictionary-modal">
        <div className="modal-header">
          <h3>Gestionar Palabras</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="categories-grid-modal">
          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[0].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[0].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNameSave(neighbors[0].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleNameEdit(neighbors[0].index, neighbors[0].name)
                  }
                >
                  {neighbors[0].name}
                </h4>
              )}
            </div>
            <WordBadgesInput
              category={neighbors[0]}
              categoryIndex={neighbors[0].index}
              isCurrentCategory={false}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[1].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[1].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNameSave(neighbors[1].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleNameEdit(neighbors[1].index, neighbors[1].name)
                  }
                >
                  {neighbors[1].name}
                </h4>
              )}
            </div>
            <WordBadgesInput
              category={neighbors[1]}
              categoryIndex={neighbors[1].index}
              isCurrentCategory={false}
            />
          </div>

          <div className="current-category">
            <div className="category-header">
              {editingName === current.index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(current.index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNameSave(current.index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleNameEdit(current.index, current.name)}>
                  {current.name} ⭐
                </h4>
              )}
            </div>
            <WordBadgesInput
              category={current}
              categoryIndex={current.index}
              isCurrentCategory={true}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[2].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[2].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNameSave(neighbors[2].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleNameEdit(neighbors[2].index, neighbors[2].name)
                  }
                >
                  {neighbors[2].name}
                </h4>
              )}
            </div>
            <WordBadgesInput
              category={neighbors[2]}
              categoryIndex={neighbors[2].index}
              isCurrentCategory={false}
            />
          </div>

          <div className="neighbor-category">
            <div className="category-header">
              {editingName === neighbors[3].index ? (
                <div className="name-edit">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleNameSave(neighbors[3].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNameSave(neighbors[3].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleNameEdit(neighbors[3].index, neighbors[3].name)
                  }
                >
                  {neighbors[3].name}
                </h4>
              )}
            </div>
            <WordBadgesInput
              category={neighbors[3]}
              categoryIndex={neighbors[3].index}
              isCurrentCategory={false}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryView;
