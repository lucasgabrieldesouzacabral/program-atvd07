import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();
const STORAGE_KEY = '@favorite_countries';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.log('Erro ao salvar favoritos', error);
      }
    }

    saveFavorites();
  }, [favorites]);

  const toggleFavorite = country => {
    const id = country.cca3 || country.cca2 || country.name.common;
    const exists = favorites.some(item => (item.cca3 || item.cca2 || item.name.common) === id);

    if (exists) {
      setFavorites(prev => prev.filter(item => (item.cca3 || item.cca2 || item.name.common) !== id));
      return;
    }

    setFavorites(prev => [...prev, country]);
  };

  const isFavorite = country => {
    const id = country.cca3 || country.cca2 || country.name.common;
    return favorites.some(item => (item.cca3 || item.cca2 || item.name.common) === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;
