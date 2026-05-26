import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut, updatePassword, getAuth } from 'firebase/auth';
import FavoritesContext from '../contexts/FavoritesContext.js';
import styles from '../../css/telas.style.js';

export default function ProfileScreen() {
  const { favorites } = useContext(FavoritesContext);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  const sairConta = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
      console.log(err);
    }
  };
  async function alterarSenha(novaSenha) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await updatePassword(user, novaSenha);

      return {
        success: true,
        message: 'Senha alterada com sucesso!',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  const alteracaoSenha = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await alterarSenha(newPassword);
    setMessage(result.message);

    if (result.success) {
      setNewPassword('');
    }

    setLoading(false);
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
        <TouchableOpacity style={styles.button} onPress={alteracaoSenha} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Alterando...' : 'Alterar senha'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={sairConta}>
        <Text style={styles.signOutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
