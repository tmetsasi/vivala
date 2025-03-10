import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUserProfile } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// 📌 Määritellään navigoinnin tyypitys
type AuthStackParamList = {
    Auth: undefined;   // Kirjautumissivu
    Main: undefined;   // Sovelluksen pääsivu
};
type NavigationProps = StackNavigationProp<AuthStackParamList, 'Auth'>;

const ProfileScreen = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProps>();

    // 🔥 Kova koodattu token (testaamista varten)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNmFkZTJjNC1lYTU5LTRhZjgtYjZmZi1mYTQ4NGRmMzBmZTgiLCJndWVzdCI6dHJ1ZSwiaWF0IjoxNzQxNTk5MTI3LCJleHAiOjE3NDQxOTExMjd9.50muvgE8trT3_kVqSjltWmz4fj0EdR8BGje1NSBxTFA";

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("📡 Lähetetään GET /api/user/profile pyyntö tokenilla:", token);
        
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
    const handleLogout = () => {
        console.log("🔑 Kirjaudutaan ulos...");
        navigation.navigate("Auth");  // 🔥 Ohjataan kirjautumissivulle
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
