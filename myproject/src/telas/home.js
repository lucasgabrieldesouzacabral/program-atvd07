import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FavoritesContext from '../contexts/FavoritesContext.js';
import styles from '../../css/telas.style.js';

const fields = 'name,capital,flags,cca3,cca2,region,subregion,population,currencies,languages';

export default function HomeScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { ehFavorito, alternarFavorito } = useContext(FavoritesContext);

  useEffect(() => {
    async function carregarPaises() {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/all?fields=${fields}`);
        const sorted = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      } catch (err) {
        setError('Não foi possível carregar os países.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    carregarPaises();
  }, []);

  const filteredCountries = countries.filter(country => {
    const name = country.name.common.toLowerCase();
    const capital = country.capital?.[0]?.toLowerCase() || '';
    const query = search.toLowerCase();
    return name.includes(query) || capital.includes(query);
  });

  const renderCountry = ({ item }) => {
    const favorite = ehFavorito(item);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes', { country: item })}>
        <View style={styles.leftRow}>
          <Image source={{ uri: item.flags?.png || item.flags?.svg }} style={styles.flag} />
          <View style={styles.countryInfo}>
            <Text style={styles.countryName}>{item.name.common}</Text>
            <Text style={styles.countrySubtitle}>{item.capital?.[0] || 'Sem capital'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => alternarFavorito(item)}>
          <FontAwesome name={favorite ? 'heart' : 'heart-o'} size={22} color={favorite ? '#E63946' : '#7A8BAE'} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Países</Text>
        <Text style={styles.headerSubtitle}>Explore destinos e adicione aos favoritos.</Text>
      </View>
      <View style={styles.searchBox}>
        <FontAwesome name="search" size={18} color="#7A8BAE" style={styles.searchIcon} />
        <TextInput
          placeholder="Pesquisar país..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#234F9C" style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={pais => pais.cca3 || pais.cca2 || pais.name.common}
          renderItem={renderCountry}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}
