import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FavoritesContext from '../contexts/FavoritesContext.js';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EFF9',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  flag: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F4E9C',
  },
  subtitle: {
    fontSize: 15,
    color: '#7A8BAE',
    marginTop: 4,
  },
  favoriteButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F4E9C',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#7A8BAE',
    fontSize: 14,
  },
  value: {
    color: '#1D325D',
    fontSize: 14,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
