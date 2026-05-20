import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { autenticacao } from './firebaseConfig';
import { ProvedorFavoritos } from './src/contexts/ContextoFavoritos';
import TelaEntrar from './src/telas/Login';
import TelaCadastro from './src/telas/cadastro';
import TelaInicio from './src/telas/home';
import TelaDetalhes from './src/telas/detalhes';
import TelaFavoritos from './src/telas/favoritos';
import TelaPerfil from './src/telas/perfil';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#234F9C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <HomeStack.Screen name="Países" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function AbasPrincipal() {
  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#234F9C',
        tabBarInactiveTintColor: '#7A8BAE',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#E1E7F5' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Favoritos') {
            iconName = 'heart';
          } else if (route.name === 'Perfil') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Abas.Screen name="Início" component={TelaPilhaInicio} />
      <Abas.Screen name="Favoritos" component={TelaFavoritos} />
      <Abas.Screen name="Perfil" component={TelaPerfil} />
    </Abas.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(autenticacao, usuarioAtual => {
      setUsuario(usuarioAtual);
      if (inicializando) setInicializando(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#234F9C" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <NavigationContainer>
        {usuario ? (
          <PilhaRaiz.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#234F9C' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '700' },
            }}
          >
            <RootStack.Screen name="Principal" component={AppTabs} options={{ headerShown: false }} />
            <RootStack.Screen
              name="Detalhes"
              component={DetailsScreen}
              options={({ route }) => ({
                title:
                  route.params?.country?.translations?.por?.common ||
                  route.params?.country?.name?.common ||
                  'Detalhes do País',
                headerBackTitle: 'Voltar',
              })}
            />
          </RootStack.Navigator>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Entrar" component={LoginScreen} />
            <AuthStack.Screen name="Cadastro" component={RegisterScreen} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5EFF9',
  },
  textoCarregando: {
    marginTop: 12,
    color: '#7A8BAE',
    fontSize: 16,
  },
});
