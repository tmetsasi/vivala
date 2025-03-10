import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:4000/api'  // 🔥 Android-emulaattorin API-osoite
  : 'http://127.0.0.1:4000/api';  // 🔥 iOS:n ja selaimen API-osoite


  export const guestLogin = async () => {
      try {
          // 🔍 Tarkistetaan, onko käyttäjä jo kirjautunut
          const storedUserId = await AsyncStorage.getItem("userId");
          const storedToken = await AsyncStorage.getItem("token");
  
          if (storedUserId && storedToken) {
              console.log("✅ Käyttäjä on jo kirjautuneena:", storedUserId);
              return { success: true, userId: storedUserId, token: storedToken };
          }
  
          // 📡 Tehdään pyyntö backendille uuden vierailijatunnuksen luomiseksi
          const response = await fetch(`${API_URL}/auth/guest`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
          });
  
          if (!response.ok) throw new Error("⚠️ Server error");
  
          const data = await response.json();
          console.log("📡 Saatiin vastaus:", data);
  
          if (data.success) {
              // 💾 Tallennetaan käyttäjän token ja userId AsyncStorageen
              await AsyncStorage.setItem("userId", data.userId);
              await AsyncStorage.setItem("token", data.token);
              console.log("💾 Tallennettu AsyncStorageen:", data.userId, data.token);
          }
  
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
