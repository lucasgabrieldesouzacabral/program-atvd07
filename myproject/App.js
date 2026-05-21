import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { FavoritesProvider } from './src/contexts/FavoritesContext.js';
import LoginScreen from './src/telas/Login';
import RegisterScreen from './src/telas/cadastro';
import HomeScreen from './src/telas/home';
import DetailsScreen from './src/telas/detalhes';
import FavoritesScreen from './src/telas/favoritos';
import ProfileScreen from './src/telas/perfil';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
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

function AppTabs() {
  return (
    <Tab.Navigator
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
      <Tab.Screen name="Início" component={HomeStackScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#234F9C" />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <NavigationContainer>
        {user ? (
          <RootStack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#234F9C' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '700' },
            }}
          >
            <RootStack.Screen name="MainTabs" component={AppTabs} options={{ headerShown: false }} />
            <RootStack.Screen
              name="Detalhes"
              component={DetailsScreen}
              options={({ route }) => ({ title: route.params?.country?.name?.common || 'Detalhes' })}
            />
          </RootStack.Navigator>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
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
});
