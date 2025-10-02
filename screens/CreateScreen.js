"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

const { width, height } = Dimensions.get("window");

const CreateScreen = () => {
  const [recordingMode, setRecordingMode] = useState("60s");
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const recordingModes = ["15s", "60s", "3m", "10m"];

  // Check camera permissions
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Take photo function
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert("Success!", "Photo taken successfully");
        console.log("Photo URI:", photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  // Record video function
  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        Alert.alert("Success!", "Video recorded successfully");
        console.log("Video URI:", video.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to record video");
      } finally {
        setIsRecording(false);
      }
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.recordingModes}>
          {recordingModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                recordingMode === mode && styles.activeModeButton,
              ]}
              onPress={() => setRecordingMode(mode)}
            >
              <Text
                style={[
                  styles.modeText,
                  recordingMode === mode && styles.activeModeText,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="flash-off" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Expo Camera View */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.cameraOverlay}>
          <Text style={styles.recordingText}>
            {isRecording ? "Recording..." : "Ready to create"}
          </Text>
        </View>
      </CameraView>

      {/* Side Controls */}
      <View style={styles.sideControls}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() =>
            setFacing((current) => (current === "back" ? "front" : "back"))
          }
        >
          <Ionicons name="camera-reverse" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.recordingControls}>
          {/* Record/Stop Button */}
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : recordVideo}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordingButtonInner,
              ]}
            />
          </TouchableOpacity>

          {/* Photo Button */}
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 1,
  },
  headerButton: {
    padding: 4,
  },
  recordingModes: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeModeButton: {
    backgroundColor: "#FFFFFF",
  },
  modeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  activeModeText: {
    color: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
  },
  recordingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sideControls: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -100 }],
    alignItems: "center",
  },
  sideButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  recordingControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF0050",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  recordingButton: {
    backgroundColor: "#FF0050",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  recordingButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  photoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateScreen;
