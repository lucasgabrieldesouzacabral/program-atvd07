import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContextoFavoritos = createContext();
const CHAVE_ARMAZENAMENTO = '@paises_favoritos';

export function ProvedorFavoritos({ filhos }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
        if (dadosSalvos) {
          setFavoritos(JSON.parse(dadosSalvos));
        }
      } catch (erro) {
        console.log('Erro ao carregar favoritos', erro);
      }
    }

    carregarFavoritos();
  }, []);

  useEffect(() => {
    async function salvarFavoritos() {
      try {
        await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(favoritos));
      } catch (erro) {
        console.log('Erro ao salvar favoritos', erro);
      }
    }

    salvarFavoritos();
  }, [favoritos]);

  const alternarFavorito = pais => {
    const id = pais.cca3 || pais.cca2 || pais.name.common;
    const jaExiste = favoritos.some(item => (item.cca3 || item.cca2 || item.name.common) === id);

    if (jaExiste) {
      setFavoritos(anterior => anterior.filter(item => (item.cca3 || item.cca2 || item.name.common) !== id));
      return;
    }

    setFavoritos(anterior => [...anterior, pais]);
  };

  const ehFavorito = pais => {
    const id = pais.cca3 || pais.cca2 || pais.name.common;
    return favoritos.some(item => (item.cca3 || item.cca2 || item.name.common) === id);
  };

  return (
    <ContextoFavoritos.Provider value={{ favoritos, alternarFavorito, ehFavorito }}>
      {filhos}
    </ContextoFavoritos.Provider>
  );
}

export default ContextoFavoritos;
