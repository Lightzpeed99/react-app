// src/components/NotebookView.jsx
import { useState, useEffect } from "react";
import "./NotebookView.css";

const NotebookView = () => {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

  // Páginas iniciales con ejemplos
  const initialPages = [
    {
      id: "welcome_page",
      title: "Bienvenida a tu Libreta",
      content: "Esta es tu primera página. Aquí puedes escribir todas tus ideas, notas y pensamientos sobre el universo Reload.\n\nUsa las páginas para organizar conceptos, tramas, diálogos o cualquier cosa que se te ocurra.",
      createdAt: new Date().toISOString().split("T")[0],
      tags: ["bienvenida", "tutorial"],
    },
    {
      id: "ideas_musicales",
      title: "Ideas Musicales",
      content: "• Combinar elementos de psytrance con ambient\n• Explorar frecuencias cuánticas\n• Crear soundtrack emocional para cada arco\n• Integrar sonidos de la naturaleza con síntesis digital",
      createdAt: new Date().toISOString().split("T")[0],
      tags: ["música", "soundtrack", "ideas"],
    },
    {
      id: "conceptos_visuales",
      title: "Conceptos Visuales",
      content: "Paleta de colores:\n- Azul cibernético (#00d4ff)\n- Verde cuántico (#00ff41)\n- Dorado cósmico (#ffd700)\n\nEstilo:\n- Minimalismo tecnológico\n- Efectos de glitch sutiles\n- Transiciones fluidas\n- Geometría fractal",
      createdAt: new Date().toISOString().split("T")[0],
      tags: ["visual", "colores", "estilo"],
    },
  ];

  // Cargar páginas del localStorage
  useEffect(() => {
    const savedPages = localStorage.getItem("reloadxps_notebook");
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      setPages(initialPages);
    }
  }, []);

  // Guardar en localStorage cuando cambien las páginas
  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem("reloadxps_notebook", JSON.stringify(pages));
    }
  }, [pages]);

  // Funciones Export/Import
  const handleExportNotebook = () => {
    const exportData = {
      pages: pages,
      exportDate: new Date().toISOString().split("T")[0],
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "reloadxps_notebook.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportNotebook = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          // Validar estructura
          if (importedData.pages && Array.isArray(importedData.pages)) {
            if (
              confirm(
                "¿Estás seguro de reemplazar la libreta actual? Esta acción no se puede deshacer."
              )
            ) {
              setPages(importedData.pages);
            }
          } else {
            alert(
              "Error: El archivo no tiene el formato correcto de libreta."
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

  const handlePageClick = (index) => {
    setSelectedPageIndex(index);
    setShowModal(true);
  };

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const newPage = {
        id: Date.now().toString(),
        title: newPageTitle,
        content: "",
        createdAt: new Date().toISOString().split("T")[0],
        tags: [],
      };
      setPages([...pages, newPage]);
      setNewPageTitle("");
      setShowNewPageModal(false);
    }
  };

  const handleDeletePage = (pageId) => {
    if (confirm("¿Estás seguro de eliminar esta página?")) {
      setPages(pages.filter((page) => page.id !== pageId));
    }
  };

  const handleUpdatePage = (index, updatedPage) => {
    const updatedPages = [...pages];
    updatedPages[index] = updatedPage;
    setPages(updatedPages);
  };

  const getNeighborPages = (currentIndex) => {
    const neighbors = [];
    const totalPages = pages.length;

    // Página actual en el centro
    const current = pages[currentIndex];

    // 4 vecinas: 2 anteriores y 2 siguientes (con wrap around)
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // Skip current page
      let neighborIndex = (currentIndex + i + totalPages) % totalPages;
      neighbors.push({ ...pages[neighborIndex], index: neighborIndex });
    }

    return { current: { ...current, index: currentIndex }, neighbors };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPagePreview = (content) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <div className="notebook-view">
      <div className="notebook-header">
        <h2>Libreta Digital Cósmica</h2>
        <p>Espacio para ideas, notas y pensamientos del universo Reload</p>

        <div className="notebook-tools">
          <button className="notebook-tool-btn" onClick={handleExportNotebook}>
            ⬇ Exportar Libreta
          </button>

          <label className="notebook-tool-btn file-input-label">
            ⬆ Importar Libreta
            <input
              type="file"
              accept=".json"
              onChange={handleImportNotebook}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      <div className="pages-grid">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="page-card"
            onClick={() => handlePageClick(index)}
          >
            <div className="page-icon">📄</div>
            <h3 className="page-title">{page.title}</h3>
            <p className="page-preview">{getPagePreview(page.content)}</p>
            <div className="page-meta">
              <span className="page-date">{formatDate(page.createdAt)}</span>
              {page.tags.length > 0 && (
                <div className="page-tags">
                  {page.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="page-tag">
                      {tag}
                    </span>
                  ))}
                  {page.tags.length > 2 && (
                    <span className="page-tag">+{page.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
            <button
              className="delete-page-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePage(page.id);
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button
        className="floating-add-btn"
        onClick={() => setShowNewPageModal(true)}
      >
        +
      </button>

      {showModal && selectedPageIndex !== null && (
        <NotebookModal
          pageData={getNeighborPages(selectedPageIndex)}
          pages={pages}
          setPages={setPages}
          onClose={() => setShowModal(false)}
          onUpdatePage={handleUpdatePage}
        />
      )}

      {showNewPageModal && (
        <div className="modal-overlay">
          <div className="new-page-modal">
            <h3>Nueva Página</h3>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Título de la página"
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="btn secondary"
                onClick={() => setShowNewPageModal(false)}
              >
                Cancelar
              </button>
              <button className="btn primary" onClick={handleCreatePage}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal para editar páginas
const NotebookModal = ({
  pageData,
  pages,
  setPages,
  onClose,
  onUpdatePage,
}) => {
  const [editingTitle, setEditingTitle] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  const { current, neighbors } = pageData;

  const handleTitleEdit = (index, currentTitle) => {
    setEditingTitle(index);
    setTempTitle(currentTitle);
  };

  const handleTitleSave = (index) => {
    const updatedPages = [...pages];
    updatedPages[index].title = tempTitle;
    setPages(updatedPages);
    setEditingTitle(null);
  };

  const handleContentChange = (index, newContent) => {
    const updatedPages = [...pages];
    updatedPages[index].content = newContent;
    setPages(updatedPages);
  };

  const handleTagsChange = (index, newTags) => {
    const updatedPages = [...pages];
    updatedPages[index].tags = newTags;
    setPages(updatedPages);
  };

  // Componente para editar contenido y tags
  const PageEditor = ({ page, pageIndex, isCurrentPage }) => {
    const [tagInput, setTagInput] = useState("");

    const addTag = (tag) => {
      if (!tag.trim()) return;
      const newTags = [...(page.tags || [])];
      if (!newTags.includes(tag.trim().toLowerCase())) {
        newTags.push(tag.trim().toLowerCase());
        handleTagsChange(pageIndex, newTags);
      }
    };

    const removeTag = (tagIndex) => {
      const newTags = [...page.tags];
      newTags.splice(tagIndex, 1);
      handleTagsChange(pageIndex, newTags);
    };

    const handleTagKeyPress = (e) => {
      if (e.key === "Enter") {
        addTag(tagInput);
        setTagInput("");
      }
    };

    const getTagColor = (tag) => {
      const firstChar = tag.charAt(0).toLowerCase();
      if (firstChar >= "a" && firstChar <= "f") return "#00d4ff";
      if (firstChar >= "g" && firstChar <= "l") return "#00ff41";
      if (firstChar >= "m" && firstChar <= "r") return "#ffd700";
      if (firstChar >= "s" && firstChar <= "z") return "#ff6600";
      return "#ff0080";
    };

    return (
      <div className="page-editor">
        <div className="content-section">
          <label>Contenido:</label>
          <textarea
            value={page.content || ""}
            onChange={(e) => handleContentChange(pageIndex, e.target.value)}
            placeholder="Escribe tus ideas aquí..."
            rows={isCurrentPage ? 15 : 8}
            className={`content-textarea ${
              isCurrentPage ? "current-content" : ""
            }`}
          />
        </div>

        <div className="tags-section">
          <label>Tags:</label>
          <div className="tags-container">
            {page.tags &&
              page.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="tag-badge"
                  style={{ borderColor: getTagColor(tag) }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tagIndex)}
                    className="tag-remove"
                    style={{ color: getTagColor(tag) }}
                  >
                    ×
                  </button>
                </span>
              ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Agregar tag..."
              className={`tag-input ${isCurrentPage ? "current-input" : ""}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="notebook-modal">
        <div className="modal-header">
          <h3>Editar Páginas</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="pages-grid-modal">
          <div className="neighbor-page">
            <div className="page-header">
              {editingTitle === neighbors[0].index ? (
                <div className="title-edit">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleTitleSave(neighbors[0].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTitleSave(neighbors[0].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleTitleEdit(neighbors[0].index, neighbors[0].title)
                  }
                >
                  {neighbors[0].title}
                </h4>
              )}
            </div>
            <PageEditor
              page={neighbors[0]}
              pageIndex={neighbors[0].index}
              isCurrentPage={false}
            />
          </div>

          <div className="neighbor-page">
            <div className="page-header">
              {editingTitle === neighbors[1].index ? (
                <div className="title-edit">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleTitleSave(neighbors[1].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTitleSave(neighbors[1].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleTitleEdit(neighbors[1].index, neighbors[1].title)
                  }
                >
                  {neighbors[1].title}
                </h4>
              )}
            </div>
            <PageEditor
              page={neighbors[1]}
              pageIndex={neighbors[1].index}
              isCurrentPage={false}
            />
          </div>

          <div className="current-page">
            <div className="page-header">
              {editingTitle === current.index ? (
                <div className="title-edit">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleTitleSave(current.index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTitleSave(current.index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4 onClick={() => handleTitleEdit(current.index, current.title)}>
                  {current.title} ⭐
                </h4>
              )}
            </div>
            <PageEditor
              page={current}
              pageIndex={current.index}
              isCurrentPage={true}
            />
          </div>

          <div className="neighbor-page">
            <div className="page-header">
              {editingTitle === neighbors[2].index ? (
                <div className="title-edit">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleTitleSave(neighbors[2].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTitleSave(neighbors[2].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleTitleEdit(neighbors[2].index, neighbors[2].title)
                  }
                >
                  {neighbors[2].title}
                </h4>
              )}
            </div>
            <PageEditor
              page={neighbors[2]}
              pageIndex={neighbors[2].index}
              isCurrentPage={false}
            />
          </div>

          <div className="neighbor-page">
            <div className="page-header">
              {editingTitle === neighbors[3].index ? (
                <div className="title-edit">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleTitleSave(neighbors[3].index)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTitleSave(neighbors[3].index)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <h4
                  onClick={() =>
                    handleTitleEdit(neighbors[3].index, neighbors[3].title)
                  }
                >
                  {neighbors[3].title}
                </h4>
              )}
            </div>
            <PageEditor
              page={neighbors[3]}
              pageIndex={neighbors[3].index}
              isCurrentPage={false}
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

export default NotebookView;