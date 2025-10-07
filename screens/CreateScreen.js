import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import api from "../src/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function CreateScreen({ navigation }) {
  const [media, setMedia] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);

  // Camera - Record Video (TikTok style)
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to record videos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
      videoMaxDuration: 60,
      aspect: [9, 16],
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  // Gallery selection
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery access is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
      videoMaxDuration: 60,
      aspect: [9, 16],
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!media || !title.trim()) {
      Alert.alert("Missing information", "Please add a video and caption");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    const fileType = media.type === "video" ? "video/mp4" : "image/jpeg";
    const fileName =
      media.fileName || `tiktok_${Date.now()}.${media.uri.split(".").pop()}`;

    formData.append("post", {
      uri: media.uri,
      type: fileType,
      name: fileName,
    });

    try {
      const token = await AsyncStorage.getItem("access");

      if (!token) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const result = await api.uploadPost("/posts/post/", formData, token);

      Alert.alert("Success", "Your video has been posted!");
      setTitle("");
      setDescription("");
      setMedia(null);

      navigation.navigate("Home", {
        refresh: true,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const removeMedia = () => {
    setMedia(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!media || !title.trim() || loading) && styles.postButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!media || !title.trim() || loading}
        >
          <Text style={styles.postButtonText}>{loading ? "..." : "Post"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {media ? (
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Preview</Text>
              <TouchableOpacity onPress={removeMedia}>
                <Ionicons name="trash-outline" size={24} color="#ff0050" />
              </TouchableOpacity>
            </View>

            {media.type === "video" ? (
              <View style={styles.videoContainer}>
                <Video
                  ref={videoRef}
                  source={{ uri: media.uri }}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                />
                <View style={styles.videoOverlay}>
                  <Ionicons name="play" size={40} color="#fff" />
                </View>
              </View>
            ) : (
              <Image source={{ uri: media.uri }} style={styles.image} />
            )}
          </View>
        ) : (
          // Upload Options
          <View style={styles.uploadSection}>
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={60} color="#666" />
            </View>
            <Text style={styles.uploadTitle}>Upload video</Text>
            <Text style={styles.uploadSubtitle}>
              Your video will be private until you publish it
            </Text>

            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={openCamera}
              >
                <Ionicons name="videocam" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Record</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, styles.uploadButtonSecondary]}
                onPress={openGallery}
              >
                <Ionicons name="folder-open" size={24} color="#fff" />
                <Text style={styles.uploadButtonTextSecondary}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Caption Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Caption *</Text>
          <TextInput
            placeholder="Describe your video..."
            value={title}
            onChangeText={setTitle}
            style={styles.captionInput}
            multiline
            maxLength={150}
            placeholderTextColor="#888"
          />
          <Text style={styles.charCount}>{title.length}/150</Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            placeholder="Add more details about your video..."
            value={description}
            onChangeText={setDescription}
            style={[styles.captionInput, styles.descriptionInput]}
            multiline
            placeholderTextColor="#888"
          />
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.optionItem}>
            <Ionicons name="people-outline" size={24} color="#fff" />
            <Text style={styles.optionText}>Who can watch this video</Text>
            <Text style={styles.optionValue}>Public</Text>
          </View>

          <View style={styles.optionItem}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.optionText}>Comments</Text>
            <Text style={styles.optionValue}>Everyone</Text>
          </View>

          <View style={styles.optionItem}>
            <Ionicons name="duplicate-outline" size={24} color="#fff" />
            <Text style={styles.optionText}>Allow Duet</Text>
            <Text style={styles.optionValue}>Everyone</Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff0050" />
            <Text style={styles.loadingText}>Uploading your video...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#000",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  postButton: {
    backgroundColor: "#ff0050",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 30,
  },
  postButtonDisabled: {
    backgroundColor: "#333",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  uploadSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    borderWidth: 2,
    borderColor: "#333",
    borderStyle: "dashed",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#111",
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff0050",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    gap: 8,
  },
  uploadButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadButtonTextSecondary: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  videoContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: width * 1.77, // 9:16 aspect ratio
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  image: {
    width: "100%",
    height: width * 1.77,
    borderRadius: 8,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#111",
    minHeight: 100,
    textAlignVertical: "top",
    color: "#fff",
  },
  descriptionInput: {
    minHeight: 80,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  optionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  optionValue: {
    fontSize: 14,
    color: "#888",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#111",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
  },
});
