import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginUser, guestLogin } from '../../api/authApi';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    type NavigationProps = CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'Login'>,
    StackNavigationProp<RootStackParamList, 'Auth'>
>;
const navigation = useNavigation<NavigationProps>();
const authContext = useContext(AuthContext);

if (!authContext) {
    console.error("❌ AuthContext on undefined! Varmista, että AuthProvider on käytössä.");
    return null; // Estetään virheet, jos AuthContext ei ole saatavilla
}
const { login } = authContext;

const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Virhe", "Täytä kaikki kentät!");
            return;
        }
        setLoading(true);
        const response = await loginUser(email, password);
        setLoading(false);

        if (response.success) {
            Alert.alert("Kirjautuminen onnistui!", "Tervetuloa takaisin!");
        } else {
            Alert.alert("Virhe", response.message || "Kirjautuminen epäonnistui.");
        }
    };

    // 📌 Jatka vieraana (Guest Login)
    const handleGuestLogin = async () => {
        setLoading(true);
    
        const response = await guestLogin(); // Kirjautuminen vierailijana
    
        setLoading(false);
    
        if (response.success) {
            console.log("✅ Vierailijakirjautuminen onnistui!");
            login(response.token)
            // 🔥 EI TARVITSE `navigation.replace("Main")`, koska AppNavigator hoitaa tämän
        } else {
            Alert.alert("❌ Kirjautumisvirhe", response.message || "Jotain meni pieleen.");
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kirjaudu sisään</Text>

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

            {/* 🔹 Kirjaudu sisään -painike */}
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Ladataan..." : "Kirjaudu sisään"}</Text>
            </TouchableOpacity>

            {/* 🔹 Jatka vieraana -painike */}
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} disabled={loading}>
                <Text style={styles.guestButtonText}>{loading ? "Ladataan..." : "Jatka vieraana"}</Text>
            </TouchableOpacity>

            {/* 🔹 Linkki rekisteröintisivulle */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerText}>Ei tiliä? Luo uusi tili</Text>
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
    registerText: {
        fontSize: 14,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
