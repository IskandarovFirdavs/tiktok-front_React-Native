"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

const CreateScreen = () => {
  const [recordingMode, setRecordingMode] = useState("60s");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState("1x");
  const [selectedFilter, setSelectedFilter] = useState("Normal");

  const recordingModes = ["15s", "60s", "3m", "10m"];
  const speeds = ["0.3x", "0.5x", "1x", "2x", "3x"];
  const filters = ["Normal", "Portrait", "Food", "Vibe", "G6"];
  const effects = ["None", "Beauty", "Stickers", "AR", "Voice"];

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

      <View style={styles.cameraPreview}>
        <View style={styles.previewPlaceholder}>
          <Ionicons name="camera" size={80} color="#333" />
          <Text style={styles.previewText}>Camera Preview</Text>
        </View>
      </View>

      <View style={styles.sideControls}>
        <TouchableOpacity style={styles.sideButton}>
          <Ionicons name="camera-reverse" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton}>
          <Ionicons name="sparkles" size={28} color="white" />
          <Text style={styles.sideButtonText}>Effects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton}>
          <Ionicons name="color-filter" size={28} color="white" />
          <Text style={styles.sideButtonText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton}>
          <Ionicons name="timer" size={28} color="white" />
          <Text style={styles.sideButtonText}>Timer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        {/* Speed and Filter Controls */}
        <View style={styles.controlsRow}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Speed</Text>
            <View style={styles.speedControls}>
              {speeds.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedButton,
                    selectedSpeed === speed && styles.activeSpeedButton,
                  ]}
                  onPress={() => setSelectedSpeed(speed)}
                >
                  <Text
                    style={[
                      styles.speedText,
                      selectedSpeed === speed && styles.activeSpeedText,
                    ]}
                  >
                    {speed}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Main Recording Controls */}
        <View style={styles.recordingControls}>
          <TouchableOpacity style={styles.galleryButton}>
            <View style={styles.galleryPreview}>
              <Ionicons name="images" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={() => setIsRecording(!isRecording)}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordingButtonInner,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.templatesButton}>
            <Ionicons name="apps" size={24} color="white" />
            <Text style={styles.templatesText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Options */}
        <View style={styles.bottomOptions}>
          <TouchableOpacity style={styles.bottomOption}>
            <Text style={styles.bottomOptionText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOption}>
            <Text style={styles.bottomOptionText}>Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOption}>
            <Text style={styles.bottomOptionText}>Live</Text>
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
  cameraPreview: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  previewPlaceholder: {
    alignItems: "center",
  },
  previewText: {
    color: "#666",
    fontSize: 16,
    marginTop: 12,
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
  sideButtonText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  bottomControls: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  controlsRow: {
    marginBottom: 20,
  },
  controlGroup: {
    alignItems: "center",
  },
  controlLabel: {
    color: "white",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "500",
  },
  speedControls: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 4,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeSpeedButton: {
    backgroundColor: "#FFFFFF",
  },
  speedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  activeSpeedText: {
    color: "#000",
  },
  recordingControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryPreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
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
  templatesButton: {
    alignItems: "center",
    width: 50,
  },
  templatesText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  bottomOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  bottomOption: {
    alignItems: "center",
  },
  bottomOptionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateScreen;
