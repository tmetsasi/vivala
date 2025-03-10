import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:4000/api'  // 🔥 Android-emulaattorin API-osoite
  : 'http://127.0.0.1:4000/api';  // 🔥 iOS:n ja selaimen API-osoite

export const guestLogin = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error("⚠️ Server error");

        const data = await response.json();
        console.log("📡 Saatiin vastaus:", data);

        return data;
    } catch (error) {
        console.error("❌ Guest login failed:", error);
        return { success: false, message: "Guest login request failed." };
    }
};

export const getUserProfile = async (token: string) => {
    try {
        console.log("📡 Lähetetään GET /api/user/profile pyyntö tokenilla:", token);

        const response = await fetch(`${API_URL}/user/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("🔄 Response status:", response.status);
        const data = await response.json();
        console.log("📡 Saatiin vastaus:", data);

        return data;
    } catch (error) {
        console.error("❌ Käyttäjätietojen haku epäonnistui:", error);
        return { success: false, message: "Error fetching user profile" };
    }
};
