import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCDoNpLYlBgahhMTDqiDvcszPhfId64auA",
  authDomain: "programatvd07.firebaseapp.com",
  projectId: "programatvd07",
  storageBucket: "programatvd07.firebasestorage.app",
  messagingSenderId: "103040265691",
  appId: "1:103040265691:web:01f9d652abd4b433928bfe",
  measurementId: "G-1DJ842XRNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const RootStack = createNativeStackNavigator();
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
              name="Details"
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
