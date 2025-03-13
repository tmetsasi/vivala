import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser, guestLogin, loginUser } from '../../api/authApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { RootStackParamList } from '../../navigation/AppNavigator';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    type NavigationProps = StackNavigationProp<RootStackParamList & AuthStackParamList>;
    const navigation = useNavigation<NavigationProps>();
    
    // 📌 Rekisteröityminen sähköpostilla
    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert("Virhe", "Täytä kaikki kentät!");
            return;
        }
        setLoading(true);
    
        // 🟢 1. Rekisteröi käyttäjä
        const registerResponse = await registerUser(email, password);
    
        if (!registerResponse.success) {
            setLoading(false);
            Alert.alert("❌ Virhe", registerResponse.message || "Rekisteröinti epäonnistui.");
            return;
        }
    
        // 🟢 2. Kirjaudu automaattisesti sisään
        const loginResponse = await loginUser(email, password);
        setLoading(false);
    
        if (loginResponse.success) {
            Alert.alert("✅ Rekisteröinti ja kirjautuminen onnistui!");
        } else {
            Alert.alert("❌ Kirjautumisvirhe", loginResponse.message || "Kirjautuminen epäonnistui.");
        }
    };
    
    

    // 📌 Jatka vieraana (Guest Login)
    const handleGuestLogin = async () => {
        setLoading(true);
        const response = await guestLogin();
        setLoading(false);

        if (response.success) {
            navigation.replace("Main"); // Siirrytään suoraan etusivulle
        } else {
            Alert.alert("Virhe", "Vierastilille kirjautuminen epäonnistui.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Luo tili</Text>

            {/* 🔹 Sähköposti-kenttä */}
            <TextInput
                style={styles.input}
                placeholder="Sähköposti"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            />

            {/* 🔹 Salasana-kenttä */}
            <TextInput
                style={styles.input}
                placeholder="Salasana"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
            />

            {/* 🔹 Rekisteröidy-painike */}
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Ladataan..." : "Rekisteröidy"}</Text>
            </TouchableOpacity>

            {/* 🔹 Jatka vieraana-painike */}
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} disabled={loading}>
                <Text style={styles.guestButtonText}>{loading ? "Ladataan..." : "Jatka vieraana"}</Text>
            </TouchableOpacity>

            {/* 🔹 Linkki kirjautumissivulle */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>Onko sinulla jo tili? Kirjaudu sisään</Text>
            </TouchableOpacity>
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
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    guestButton: {
        width: '100%',
        backgroundColor: '#6c757d',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    guestButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    loginText: {
        fontSize: 14,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
