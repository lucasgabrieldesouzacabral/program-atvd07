import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FavoritesContext from '../contexts/FavoritesContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      <Text style={styles.subtitle}>Os países marcados na sua lista.</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum país favoritado ainda.</Text>
          <Text style={styles.emptyHint}>Favorite um país na lista principal para vê-lo aqui.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {favorites.map(item => (
            <TouchableOpacity
              key={item.cca3 || item.cca2 || item.name.common}
              style={styles.card}
              onPress={() => navigation.navigate('Detalhes', { country: item })}
            >
              <View style={styles.leftRow}>
                <Image source={{ uri: item.flags?.png || item.flags?.svg }} style={styles.flag} />
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name.common}</Text>
                  <Text style={styles.countrySubtitle}>{item.capital?.[0] || 'Sem capital'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <FontAwesome name="heart" size={22} color="#E63946" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EFF9',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F4E9C',
    marginBottom: 6,
  },
  subtitle: {
    color: '#7A8BAE',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E7F5',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    width: 52,
    height: 38,
    borderRadius: 10,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D325D',
  },
  countrySubtitle: {
    fontSize: 13,
    color: '#7A8BAE',
    marginTop: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F4E9C',
    marginBottom: 10,
  },
  emptyHint: {
    color: '#7A8BAE',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
