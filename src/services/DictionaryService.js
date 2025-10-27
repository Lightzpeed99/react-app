// src/services/DictionaryService.js

import { dictionaryRepository } from '../repositories/DictionaryRepository';

/**
 * DictionaryService - Lógica de negocio para el Diccionario Cósmico Suniversal
 * 
 * RESPONSABILIDADES:
 * - Validaciones de negocio antes de guardar
 * - Normalización de datos (uppercase para palabras y categorías)
 * - Generación de prompts creativos
 * - Análisis y estadísticas del diccionario
 */

export class DictionaryService {
  constructor() {
    this.repository = dictionaryRepository;
  }

  // ==================== CRUD CON VALIDACIONES ====================

  /**
   * Crear una nueva categoría con validaciones
   * @param {Object} categoryData - { name, words?, placeholder? }
   * @returns {Promise<Object>} Categoría creada
   */
  async createCategory(categoryData) {
    // Validar datos
    const validation = this.validateCategoryData(categoryData);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizeCategoryData(categoryData);

    // Verificar que no exista categoría con ese nombre
    const existing = await this.repository.getCategoryByName(normalizedData.name);
    if (existing) {
      throw new Error(`Category "${normalizedData.name}" already exists`);
    }

    // Crear categoría
    return await this.repository.create(normalizedData);
  }

  /**
   * Actualizar una categoría existente
   * @param {string|number} id
   * @param {Object} categoryData
   * @returns {Promise<Object>}
   */
  async updateCategory(id, categoryData) {
    // Verificar que existe
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new Error(`Category with id ${id} not found`);
    }

    // Validar datos
    const validation = this.validateCategoryData(categoryData, true);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Normalizar datos
    const normalizedData = this._normalizeCategoryData(categoryData, existing);

    // Si se cambió el nombre, verificar que no exista otra con ese nombre
    if (normalizedData.name && normalizedData.name !== existing.name) {
      const duplicate = await this.repository.getCategoryByName(normalizedData.name);
      if (duplicate && duplicate.id !== String(id)) {
        throw new Error(`Category "${normalizedData.name}" already exists`);
      }
    }

    // Actualizar
    return await this.repository.update(id, normalizedData);
  }

  /**
   * Obtener una categoría por ID
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getCategoryById(id) {
    return await this.repository.getById(id);
  }

  /**
   * Obtener una categoría por nombre
   * @param {string} name
   * @returns {Promise<Object|null>}
   */
  async getCategoryByName(name) {
    return await this.repository.getCategoryByName(name);
  }

  /**
   * Obtener todas las categorías
   * @returns {Promise<Array>}
   */
  async getAllCategories() {
    return await this.repository.getAll();
  }

  /**
   * Eliminar una categoría
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async deleteCategory(id) {
    return await this.repository.delete(id);
  }

  /**
   * Renombrar una categoría
   * @param {string|number} id
   * @param {string} newName
   * @returns {Promise<Object>}
   */
  async renameCategory(id, newName) {
    if (!newName || newName.trim() === '') {
      throw new Error('New name cannot be empty');
    }

    return await this.repository.renameCategory(id, newName);
  }

  /**
   * Duplicar una categoría
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async duplicateCategory(id) {
    return await this.repository.duplicateCategory(id);
  }

  // ==================== GESTIÓN DE PALABRAS ====================

  /**
   * Agregar una palabra a una categoría (con validación)
   * @param {string|number} categoryId
   * @param {string} word
   * @returns {Promise<Object>}
   */
  async addWordToCategory(categoryId, word) {
    // Validar palabra
    if (!word || word.trim() === '') {
      throw new Error('Word cannot be empty');
    }

    const normalizedWord = word.trim().toUpperCase();

    // Verificar longitud razonable (max 100 chars)
    if (normalizedWord.length > 100) {
      throw new Error('Word is too long (max 100 characters)');
    }

    return await this.repository.addWordToCategory(categoryId, normalizedWord);
  }

  /**
   * Agregar múltiples palabras a una categoría
   * @param {string|number} categoryId
   * @param {string[]} words
   * @returns {Promise<Object>}
   */
  async addWordsToCategory(categoryId, words) {
    // Filtrar palabras vacías
    const validWords = words
      .filter(w => w && w.trim() !== '')
      .map(w => w.trim());

    if (validWords.length === 0) {
      throw new Error('No valid words to add');
    }

    return await this.repository.addWordsToCategory(categoryId, validWords);
  }

  /**
   * Eliminar una palabra de una categoría
   * @param {string|number} categoryId
   * @param {number} wordIndex
   * @returns {Promise<Object>}
   */
  async removeWordFromCategory(categoryId, wordIndex) {
    return await this.repository.removeWordFromCategory(categoryId, wordIndex);
  }

  /**
   * Eliminar una palabra por su valor
   * @param {string|number} categoryId
   * @param {string} word
   * @returns {Promise<Object>}
   */
  async removeWordByValue(categoryId, word) {
    return await this.repository.removeWordByValue(categoryId, word);
  }

  // ==================== BÚSQUEDA ====================

  /**
   * Buscar categorías que contienen una palabra
   * @param {string} word
   * @returns {Promise<Array>}
   */
  async searchCategoriesByWord(word) {
    if (!word || word.trim() === '') {
      return [];
    }
    return await this.repository.searchCategoriesByWord(word);
  }

  /**
   * Obtener todas las palabras únicas del diccionario
   * @returns {Promise<string[]>}
   */
  async getAllWords() {
    return await this.repository.getAllWords();
  }

  // ==================== GENERACIÓN DE PROMPTS ====================

  /**
   * Generar un prompt aleatorio combinando palabras
   * @param {number} wordCount - Número de palabras
   * @param {string[]} categoryNames - Categorías específicas (opcional)
   * @returns {Promise<string>}
   */
  async generateRandomPrompt(wordCount = 5, categoryNames = null) {
    if (wordCount < 1) {
      throw new Error('Word count must be at least 1');
    }

    if (wordCount > 50) {
      throw new Error('Word count cannot exceed 50');
    }

    return await this.repository.generateRandomPrompt(wordCount, categoryNames);
  }

  /**
   * Generar prompts balanceados por categoría
   * @param {Object} categoryWordCounts - { categoryName: count }
   * @returns {Promise<string>}
   * 
   * Ejemplo: { "PODER/ENERGÍA": 2, "ACTIONS": 3, "CONCEPTO": 1 }
   */
  async generateBalancedPrompt(categoryWordCounts) {
    const allCategories = await this.repository.getAll();
    const selectedWords = [];

    for (const [categoryName, count] of Object.entries(categoryWordCounts)) {
      const category = allCategories.find(
        cat => cat.name.toUpperCase() === categoryName.toUpperCase()
      );

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`);
      }

      if (!category.words || category.words.length === 0) {
        continue; // Skip empty categories
      }

      // Seleccionar N palabras aleatorias de esta categoría
      const availableWords = [...category.words];
      const wordsToSelect = Math.min(count, availableWords.length);

      for (let i = 0; i < wordsToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        selectedWords.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1);
      }
    }

    return selectedWords.join(', ');
  }

  /**
   * Generar múltiples variantes de prompts
   * @param {number} variantCount - Número de variantes
   * @param {number} wordsPerVariant - Palabras por variante
   * @param {string[]} categoryNames - Categorías a usar (opcional)
   * @returns {Promise<string[]>}
   */
  async generatePromptVariants(variantCount = 3, wordsPerVariant = 5, categoryNames = null) {
    if (variantCount < 1 || variantCount > 20) {
      throw new Error('Variant count must be between 1 and 20');
    }

    const variants = [];
    for (let i = 0; i < variantCount; i++) {
      const prompt = await this.generateRandomPrompt(wordsPerVariant, categoryNames);
      variants.push(prompt);
    }

    return variants;
  }

  // ==================== EXPORT/IMPORT ====================

  /**
   * Exportar todas las categorías
   * @returns {Promise<Object>}
   */
  async exportAll() {
    return await this.repository.exportData();
  }

  /**
   * Importar categorías
   * @param {Object|Array} data
   * @returns {Promise<Array>}
   */
  async importAll(data) {
    // Validar formato
    const categories = Array.isArray(data) ? data : (data.data || data);
    
    if (!Array.isArray(categories)) {
      throw new Error('Import data must be an array or object with data property');
    }

    // Validar cada categoría
    const invalidCategories = [];
    categories.forEach((category, index) => {
      const validation = this.validateCategoryData(category, true);
      if (!validation.valid) {
        invalidCategories.push({
          index,
          name: category.name || 'unknown',
          errors: validation.errors
        });
      }
    });

    if (invalidCategories.length > 0) {
      throw new Error(`Invalid categories found: ${JSON.stringify(invalidCategories)}`);
    }

    return await this.repository.importData(categories);
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtener estadísticas completas
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    return await this.repository.getStatistics();
  }

  /**
   * Analizar frecuencia de palabras en prompts generados
   * @param {number} sampleSize - Número de prompts a generar
   * @returns {Promise<Object>}
   */
  async analyzeWordFrequency(sampleSize = 100) {
    const wordCounts = {};

    for (let i = 0; i < sampleSize; i++) {
      const prompt = await this.generateRandomPrompt(5);
      const words = prompt.split(', ');
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    }

    // Convertir a array y ordenar
    const frequency = Object.entries(wordCounts)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / sampleSize) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      sampleSize,
      uniqueWords: frequency.length,
      frequency: frequency.slice(0, 20) // Top 20
    };
  }

  // ==================== VALIDACIONES ====================

  /**
   * Validar datos de categoría
   * @param {Object} categoryData
   * @param {boolean} isUpdate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateCategoryData(categoryData, isUpdate = false) {
    const errors = [];

    // Nombre (obligatorio solo en create)
    if (!isUpdate && (!categoryData.name || categoryData.name.trim() === '')) {
      errors.push('El nombre de la categoría es obligatorio');
    }

    // Validar nombre si existe
    if (categoryData.name) {
      if (categoryData.name.trim().length > 100) {
        errors.push('El nombre de la categoría no puede exceder 100 caracteres');
      }
    }

    // Validar words si existe
    if (categoryData.words !== undefined) {
      if (!Array.isArray(categoryData.words)) {
        errors.push('Words debe ser un array');
      } else {
        // Validar cada palabra
        categoryData.words.forEach((word, index) => {
          if (typeof word !== 'string') {
            errors.push(`Palabra en índice ${index} no es un string`);
          } else if (word.length > 100) {
            errors.push(`Palabra en índice ${index} excede 100 caracteres`);
          }
        });
      }
    }

    // Validar placeholder si existe
    if (categoryData.placeholder && typeof categoryData.placeholder !== 'string') {
      errors.push('Placeholder debe ser un string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== NORMALIZACIÓN PRIVADA ====================

  /**
   * Normalizar datos de categoría
   * @private
   * @param {Object} categoryData
   * @param {Object} existing - Datos existentes (para updates)
   * @returns {Object}
   */
  _normalizeCategoryData(categoryData, existing = null) {
    const normalized = { ...categoryData };

    // Normalizar nombre a UPPERCASE
    if (normalized.name) {
      normalized.name = normalized.name.trim().toUpperCase();
    }

    // Normalizar words a UPPERCASE
    if (normalized.words && Array.isArray(normalized.words)) {
      normalized.words = normalized.words
        .map(w => w.trim().toUpperCase())
        .filter(w => w.length > 0)
        .filter((word, index, self) => self.indexOf(word) === index); // Eliminar duplicados
    } else if (!normalized.words && !existing) {
      normalized.words = [];
    }

    // Normalizar placeholder
    if (normalized.placeholder) {
      normalized.placeholder = normalized.placeholder.trim();
    } else if (!normalized.placeholder && !existing) {
      normalized.placeholder = 'Ej: palabra1, palabra2, palabra3';
    }

    return normalized;
  }

  // ==================== HELPERS PÚBLICOS ====================

  /**
   * Contar palabras en una categoría
   * @param {string|number} categoryId
   * @returns {Promise<number>}
   */
  async countWordsInCategory(categoryId) {
    const category = await this.repository.getById(categoryId);
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    return category.words ? category.words.length : 0;
  }

  /**
   * Obtener categorías vacías
   * @returns {Promise<Array>}
   */
  async getEmptyCategories() {
    const allCategories = await this.repository.getAll();
    return allCategories.filter(cat => !cat.words || cat.words.length === 0);
  }

  /**
   * Obtener categorías más pobladas
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getMostPopulatedCategories(limit = 5) {
    const allCategories = await this.repository.getAll();
    
    return allCategories
      .map(cat => ({
        ...cat,
        wordCount: cat.words ? cat.words.length : 0
      }))
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, limit);
  }

  /**
   * Sugerir palabras similares en otras categorías
   * @param {string} word
   * @returns {Promise<Array>}
   */
  async findSimilarWords(word) {
    const allWords = await this.repository.getAllWords();
    const wordLower = word.toLowerCase();
    
    // Buscar palabras que contengan la palabra buscada
    const similar = allWords.filter(w => 
      w.toLowerCase().includes(wordLower) && w.toLowerCase() !== wordLower
    );

    return similar.slice(0, 10); // Limitar a 10 sugerencias
  }
}

// Exportar singleton
export const dictionaryService = new DictionaryService();

export default dictionaryService;