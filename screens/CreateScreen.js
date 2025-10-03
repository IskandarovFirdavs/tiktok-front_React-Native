import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateScreen({ navigation }) {
  const [media, setMedia] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Kamera orqali olish
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ruxsat kerak", "Kameradan foydalanishga ruxsat bering");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  // Galereyadan tanlash
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ruxsat kerak", "Galereyadan foydalanishga ruxsat bering");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!media || !title) {
      Alert.alert("Xatolik", "Media va title majburiy!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // 🔧 FORMDA TANI TO'G'RI QO'SHISH
    const fileType = media.type === "video" ? "video/mp4" : "image/jpeg";
    const fileName =
      media.fileName || `upload_${Date.now()}.${media.uri.split(".").pop()}`;

    // To'g'ri formatda fayl qo'shish
    formData.append("post", {
      uri: media.uri,
      type: fileType,
      name: fileName,
    });

    try {
      const token = await AsyncStorage.getItem("access");

      if (!token) {
        Alert.alert("Xatolik", "Iltimos, avval tizimga kiring");
        return;
      }

      const API_URL = "http://192.168.0.103:8000";

      // 🔧 DEBUG: FormData ni ko'rish
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${API_URL}/posts/post/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type" ni O'CHIRISH - FormData avtomatik qo'shadi
        },
        body: formData,
      });

      // 🔧 Xatolikni batafsil ko'rish
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server xatosi:", errorText);
        throw new Error(
          `HTTP xatosi! Status: ${response.status}. Details: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Muvaffaqiyatli javob:", result);

      Alert.alert("✅ Post joylandi", `ID: ${result.id}`);
      setTitle("");
      setDescription("");
      setMedia(null);
      navigation.goBack();
    } catch (err) {
      console.error("Xato tafsilotlari:", err);
      Alert.alert("❌ Xatolik", err.message || "Serverga ulanmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Yangi Post</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btn} onPress={openCamera}>
          <Text style={styles.btnText}>📸 Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={openGallery}>
          <Text style={styles.btnText}>🖼️ Galereya</Text>
        </TouchableOpacity>
      </View>

      {media && (
        <View style={styles.preview}>
          {media.type === "video" ? (
            <Text>🎥 Video tanlandi: {media.uri.split("/").pop()}</Text>
          ) : (
            <Image source={{ uri: media.uri }} style={styles.image} />
          )}
        </View>
      )}

      <TextInput
        placeholder="Sarlavha (Title)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Tavsif (Description)"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#4CAF50", marginTop: 10 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "⏳ Yuklanyapti..." : "📤 Postni joylash"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  btnRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  preview: { marginVertical: 15, alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
});
