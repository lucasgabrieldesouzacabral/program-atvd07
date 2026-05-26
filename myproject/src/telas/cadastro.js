import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import '../../firebaseConfig';
import styles from '../../css/telas.style.js';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });
    } catch (err) {
      setError('Não foi possível cadastrar. Verifique os dados.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar.</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}> Faça login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
