import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";

// 🔹 RootStackParamList määrittää pääreitit
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 🔥 Lisätty lataustila

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true); // 🔥 Asetetaan lataustila ennen tarkistusta
            const token = await AsyncStorage.getItem("token");
            setIsAuthenticated(token !== null);
            setIsLoading(false); // 🔥 Poistetaan lataustila kun tarkistus on valmis
        };

        // 🔥 Kuunnellaan muutoksia `AsyncStorage`:ssa
        const listenToStorage = async () => {
            const token = await AsyncStorage.getItem("token");
            setIsAuthenticated(token !== null);
        };

        const interval = setInterval(listenToStorage, 500); // 🔥 Tarkistetaan 0,5 sekunnin välein

        checkAuth(); // Tarkistetaan tila heti alussa

        return () => clearInterval(interval); // 🔥 Poistetaan kuuntelija kun komponentti poistuu
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
    );
};

export default AppNavigator;
