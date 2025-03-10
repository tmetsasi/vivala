import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// 📌 Navigoinnin tyyppi
type AuthStackParamList = {
    Auth: undefined;   // Kirjautumissivu
    Main: undefined;   // Sovelluksen pääsivu
};
type NavigationProps = StackNavigationProp<AuthStackParamList, 'Auth'>;

const ProfileScreen = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem("token");  // 🔥 Haetaan token AsyncStoragesta
            console.log("🔑 Haettu token AsyncStoragesta:", token);

            if (!token) {
                console.log("⛔ Ei tokenia tallennettuna, ohjataan kirjautumissivulle.");
                setLoading(false);
                navigation.replace("Auth");  // 🔥 Ohjataan kirjautumissivulle
                return;
            }

            const response = await getUserProfile(token);
            console.log("📡 API-vastaus:", response);

            if (response.success) {
                setUser(response.user);
            } else {
                console.error("⚠️ Käyttäjätietojen haku epäonnistui:", response.message);
            }

            setLoading(false);
        };

        fetchUserData();
    }, []);

    // 📌 Kirjaudu ulos -toiminto
    const handleLogout = async () => {
        console.log("🔑 Kirjaudutaan ulos...");
        await AsyncStorage.removeItem("token");  // 🔥 Poistetaan token
        await AsyncStorage.removeItem("userId");  // 🔥 Poistetaan userId
        navigation.replace("Auth");  // 🔥 Ohjataan takaisin kirjautumissivulle
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profiili</Text>
            {user ? (
                <>
                    <Text style={styles.info}>🆔 ID: {user.id}</Text>
                    <Text style={styles.info}>👤 Käyttäjänimi: {user.username}</Text>
                    <Text style={styles.info}>📧 Sähköposti: {user.email || "Ei asetettu"}</Text>
                    <Text style={styles.info}>🎭 Vieraskäyttäjä: {user.is_guest ? "Kyllä" : "Ei"}</Text>

                    {/* 🔥 Kirjaudu ulos -nappi */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Kirjaudu ulos</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.info}>Käyttäjätietoja ei saatavilla.</Text>
            )}
        </View>
    );
};

// 📌 Tyylit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff3b30',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
