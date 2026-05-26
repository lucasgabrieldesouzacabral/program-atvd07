import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut, updatePassword } from 'firebase/auth';
import FavoritesContext from '../contexts/FavoritesContext.js';
import { auth } from '../../firebaseConfig';
import styles from '../../css/telas.style.js';

export default function ProfileScreen() {
  const { favorites } = useContext(FavoritesContext);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
      console.log(err);
    }
  };
  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      await updatePassword(user, newPassword);
      setMessage('Senha alterada com sucesso!');
      setNewPassword('');
    } catch (err) {
      console.log(err);
      setMessage('Erro ao alterar a senha. Refaça o login e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Meu Perfil</Text>

      <View style={styles.profileCard}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user?.email || 'E-mail não disponível'}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Favoritos</Text>
        <Text style={styles.statValue}>{favorites.length}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alterar Senha</Text>
        <TextInput
          placeholder="Nova senha"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Alterando...' : 'Alterar senha'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
