import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();
const STORAGE_KEY = '@paises_favoritos';

export function FavoritesProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavoritos(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Erro ao carregar favoritos', error);
      }
    }

    loadFavorites();
  }, []);

  useEffect(() => {
    async function saveFavorites() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
      } catch (error) {
        console.log('Erro ao salvar favoritos', error);
      }
    }

    saveFavorites();
  }, [favoritos]);

  const alternarFavorito = pais => {
    const id = pais.cca3 || pais.cca2 || pais.name.common;
    const exists = favoritos.some(item => (item.cca3 || item.cca2 || item.name.common) === id);

    if (exists) {
      setFavoritos(prev => prev.filter(item => (item.cca3 || item.cca2 || item.name.common) !== id));
      return;
    }

    setFavoritos(prev => [...prev, pais]);
  };

  const ehFavorito = pais => {
    const id = pais.cca3 || pais.cca2 || pais.name.common;
    return favoritos.some(item => (item.cca3 || item.cca2 || item.name.common) === id);
  };

  const toggleFavorite = alternarFavorito;
  const isFavorite = ehFavorito;
  const favorites = favoritos;

  return (
    <FavoritesContext.Provider value={{ favoritos, favorites, alternarFavorito, toggleFavorite, ehFavorito, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
