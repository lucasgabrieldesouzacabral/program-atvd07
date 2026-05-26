import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FavoritesContext from '../contexts/FavoritesContext.js';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from '../../css/telas.style.js';

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

