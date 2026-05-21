import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut, updatePassword } from 'firebase/auth';
import FavoritesContext from '../contexts/FavoritesContext.js';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EFF9',
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F4E9C',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D325D',
    marginBottom: 6,
  },
  email: {
    color: '#7A8BAE',
    fontSize: 14,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 22,
  },
  statLabel: {
    color: '#7A8BAE',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F4E9C',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F4E9C',
    marginBottom: 14,
  },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6DAE7',
    backgroundColor: '#F7F9FD',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  message: {
    color: '#1F4E9C',
    marginBottom: 12,
  },
  button: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#234F9C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: '#E63946',
    fontWeight: '700',
  },
});
