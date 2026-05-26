import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FavoritesContext from '../contexts/FavoritesContext.js';
import styles from '../../css/telas.style.js';

export default function DetailsScreen({ route }) {
  const { country } = route.params;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(country);

  const parsedCurrencies = country.currencies
    ? Object.values(country.currencies).map(item => item.name).join(', ')
    : 'Não disponível';

  const parsedLanguages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'Não disponível';

  const infoRows = [
    { label: 'Capital', value: country.capital?.[0] || 'Não disponível' },
    { label: 'Região', value: country.region || '-' },
    { label: 'Sub-região', value: country.subregion || '-' },
    { label: 'População', value: country.population?.toLocaleString() || '-' },
    { label: 'Moeda', value: parsedCurrencies },
    { label: 'Idioma(s)', value: parsedLanguages },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: country.flags?.png || country.flags?.svg }} style={styles.flag} />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{country.name.common}</Text>
          <Text style={styles.subtitle}>{country.capital?.[0] || 'Capital desconhecida'}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(country)}>
          <FontAwesome name={favorite ? 'heart' : 'heart-o'} size={24} color={favorite ? '#E63946' : '#234F9C'} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informações</Text>
        {infoRows.map(row => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

