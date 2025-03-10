import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

// 🔹 RootStackParamList määrittää pääreitit
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("authToken");
            setIsAuthenticated(!!token);  // Jos token on olemassa, käyttäjä on kirjautunut
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <View><ActivityIndicator size="large" /></View>;  // Latausanimaatio
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
    );
    
};

export default AppNavigator;
