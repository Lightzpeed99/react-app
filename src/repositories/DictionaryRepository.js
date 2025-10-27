// src/repositories/DictionaryRepository.js

import { LocalStorageRepository } from './LocalStorageRepository';

/**
 * DictionaryRepository - Repository para el Diccionario Cósmico Suniversal
 * 
 * GESTIONA: Categorías de palabras y frases para prompts creativos
 * 
 * ESTRUCTURA DE DATOS (PRESERVAR):
 * [
 *   {
 *     id: string,
 *     name: string (uppercase),
 *     words: string[] (uppercase),
 *     placeholder: string,
 *     createdAt: string (ISO),
 *     updatedAt: string (ISO)
 *   }
 * ]
 * 
 * CATEGORÍAS INICIALES:
 * - PODER/ENERGÍA
 * - PREFIJOS
 * - SUFIJOS
 * - ACTIONS
 * - TERMS
 * - CONCEPTO
 * - TECH LANGUAGE
 * - UNIVERSAL
 * - FX
 * - PHYSICS
 * - ONOMATOPEYAS
 * - POSITION
 * - PHRASES
 * 
 * IMPORTANTE: Esta estructura NO se modifica. Compatibilidad con JSON existente.
 */

export class DictionaryRepository extends LocalStorageRepository {
  constructor() {
    super('reloadxps_dictionary');
  }

  // ==================== MÉTODOS ESPECÍFICOS DE DICCIONARIO ====================

  /**
   * Obtener una categoría por nombre (case-insensitive)
   * @param {string} name - Nombre de la categoría
   * @returns {Promise<Object|null>}
   */
  async getCategoryByName(name) {
    const categories = await this.getAll();
    const nameLower = name.toLowerCase();
    
    return categories.find(cat => 
      cat.name.toLowerCase() === nameLower
    ) || null;
  }

  /**
   * Agregar una palabra a una categoría
   * @param {string|number} categoryId - ID de la categoría
   * @param {string} word - Palabra a agregar (se normalizará a uppercase)
   * @returns {Promise<Object>} Categoría actualizada
   */
  async addWordToCategory(categoryId, word) {
    const category = await this.getById(categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    // Normalizar palabra a uppercase
    const normalizedWord = word.trim().toUpperCase();

    if (!normalizedWord) {
      throw new Error('Word cannot be empty');
    }

    // Asegurar que existe el array de palabras
    if (!category.words) {
      category.words = [];
    }

    // Verificar que no exista duplicado
    if (category.words.includes(normalizedWord)) {
      throw new Error(`Word "${normalizedWord}" already exists in category`);
    }

    // Agregar palabra
    category.words.push(normalizedWord);

    // Actualizar categoría
    return await this.update(categoryId, category);
  }

  /**
   * Agregar múltiples palabras a una categoría
   * @param {string|number} categoryId - ID de la categoría
   * @param {string[]} words - Array de palabras
   * @returns {Promise<Object>} Categoría actualizada
   */
  async addWordsToCategory(categoryId, words) {
    const category = await this.getById(categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    // Normalizar palabras
    const normalizedWords = words
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0);

    if (!category.words) {
      category.words = [];
    }

    // Agregar solo palabras nuevas (sin duplicados)
    const uniqueWords = normalizedWords.filter(
      word => !category.words.includes(word)
    );

    category.words.push(...uniqueWords);

    return await this.update(categoryId, category);
  }

  /**
   * Eliminar una palabra de una categoría por índice
   * @param {string|number} categoryId - ID de la categoría
   * @param {number} wordIndex - Índice de la palabra en el array
   * @returns {Promise<Object>} Categoría actualizada
   */
  async removeWordFromCategory(categoryId, wordIndex) {
    const category = await this.getById(categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    if (!category.words || !Array.isArray(category.words)) {
      throw new Error('Category has no words');
    }

    if (wordIndex < 0 || wordIndex >= category.words.length) {
      throw new Error(`Invalid word index: ${wordIndex}`);
    }

    // Eliminar palabra
    category.words.splice(wordIndex, 1);

    // Actualizar categoría
    return await this.update(categoryId, category);
  }

  /**
   * Eliminar una palabra por valor (no por índice)
   * @param {string|number} categoryId - ID de la categoría
   * @param {string} word - Palabra a eliminar
   * @returns {Promise<Object>} Categoría actualizada
   */
  async removeWordByValue(categoryId, word) {
    const category = await this.getById(categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    if (!category.words || !Array.isArray(category.words)) {
      throw new Error('Category has no words');
    }

    const normalizedWord = word.trim().toUpperCase();
    const index = category.words.indexOf(normalizedWord);

    if (index === -1) {
      throw new Error(`Word "${normalizedWord}" not found in category`);
    }

    // Eliminar palabra
    category.words.splice(index, 1);

    return await this.update(categoryId, category);
  }

  /**
   * Renombrar una categoría
   * @param {string|number} categoryId - ID de la categoría
   * @param {string} newName - Nuevo nombre (se normalizará a uppercase)
   * @returns {Promise<Object>} Categoría actualizada
   */
  async renameCategory(categoryId, newName) {
    const category = await this.getById(categoryId);
    
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    const normalizedName = newName.trim().toUpperCase();

    if (!normalizedName) {
      throw new Error('Category name cannot be empty');
    }

    // Verificar que no exista otra categoría con ese nombre
    const existingCategory = await this.getCategoryByName(normalizedName);
    if (existingCategory && existingCategory.id !== String(categoryId)) {
      throw new Error(`Category "${normalizedName}" already exists`);
    }

    category.name = normalizedName;

    return await this.update(categoryId, category);
  }

  /**
   * Buscar categorías que contienen una palabra específica
   * @param {string} word - Palabra a buscar
   * @returns {Promise<Array>}
   */
  async searchCategoriesByWord(word) {
    const categories = await this.getAll();
    const wordLower = word.toLowerCase();

    return categories.filter(category => {
      if (!category.words) return false;
      return category.words.some(w => w.toLowerCase().includes(wordLower));
    });
  }

  /**
   * Obtener todas las palabras de todas las categorías (flat)
   * @returns {Promise<string[]>}
   */
  async getAllWords() {
    const categories = await this.getAll();
    
    const allWords = categories.reduce((words, category) => {
      if (category.words && Array.isArray(category.words)) {
        return [...words, ...category.words];
      }
      return words;
    }, []);

    // Eliminar duplicados y ordenar
    return [...new Set(allWords)].sort();
  }

  /**
   * Obtener estadísticas del diccionario
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const categories = await this.getAll();

    const totalCategories = categories.length;
    const totalWords = categories.reduce((sum, cat) => 
      sum + (cat.words ? cat.words.length : 0), 0
    );

    // Categorías con más palabras
    const categoriesWithMostWords = categories
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        wordCount: cat.words ? cat.words.length : 0
      }))
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, 5);

    // Categorías vacías
    const emptyCategories = categories.filter(
      cat => !cat.words || cat.words.length === 0
    );

    return {
      totalCategories,
      totalWords,
      averageWordsPerCategory: totalCategories > 0 
        ? (totalWords / totalCategories).toFixed(2) 
        : 0,
      categoriesWithMostWords,
      emptyCategories: emptyCategories.map(cat => ({
        id: cat.id,
        name: cat.name
      }))
    };
  }

  /**
   * Generar prompt aleatorio combinando palabras
   * @param {number} wordCount - Número de palabras a incluir
   * @param {string[]} categoryNames - Categorías a usar (opcional)
   * @returns {Promise<string>}
   */
  async generateRandomPrompt(wordCount = 5, categoryNames = null) {
    let categories = await this.getAll();

    // Filtrar por categorías específicas si se proporcionan
    if (categoryNames && categoryNames.length > 0) {
      const namesLower = categoryNames.map(n => n.toLowerCase());
      categories = categories.filter(cat => 
        namesLower.includes(cat.name.toLowerCase())
      );
    }

    // Recopilar todas las palabras disponibles
    const allWords = categories.reduce((words, category) => {
      if (category.words && Array.isArray(category.words)) {
        return [...words, ...category.words];
      }
      return words;
    }, []);

    if (allWords.length === 0) {
      return '';
    }

    // Seleccionar palabras aleatorias
    const selectedWords = [];
    const availableWords = [...allWords];

    for (let i = 0; i < Math.min(wordCount, availableWords.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      selectedWords.push(availableWords[randomIndex]);
      availableWords.splice(randomIndex, 1); // Evitar duplicados
    }

    return selectedWords.join(', ');
  }

  /**
   * Validar estructura de categoría
   * @param {Object} categoryData
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateCategoryData(categoryData) {
    const errors = [];

    // Validar nombre
    if (!categoryData.name || categoryData.name.trim() === '') {
      errors.push('El nombre de la categoría es obligatorio');
    }

    // Validar words si existe
    if (categoryData.words !== undefined) {
      if (!Array.isArray(categoryData.words)) {
        errors.push('Words debe ser un array');
      } else {
        // Validar que cada palabra sea string
        categoryData.words.forEach((word, index) => {
          if (typeof word !== 'string') {
            errors.push(`Palabra en índice ${index} no es un string`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Duplicar una categoría
   * @param {string|number} categoryId - ID de la categoría a duplicar
   * @returns {Promise<Object>} Nueva categoría duplicada
   */
  async duplicateCategory(categoryId) {
    const original = await this.getById(categoryId);
    
    if (!original) {
      throw new Error(`Category with id ${categoryId} not found`);
    }

    // Crear copia sin ID
    const { id: _, createdAt, updatedAt, ...categoryData } = original;

    // Agregar indicador de que es una copia
    const duplicated = {
      ...categoryData,
      name: `${categoryData.name} (COPY)`,
      words: [...(categoryData.words || [])] // Clonar array
    };

    return await this.create(duplicated);
  }
}

// Exportar singleton
export const dictionaryRepository = new DictionaryRepository();

export default dictionaryRepository;