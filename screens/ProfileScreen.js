"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/api/api";

const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("videos");
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      return token;
    } catch (e) {
      console.error("Error getting auth token:", e);
      return null;
    }
  };

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      // 👤 User info
      const userData = await api.get("/users/me/", token);
      setUserData(userData);

      // 🎬 User videos
      const posts = await api.get("/posts/post/", token);

      // Ba’zi backendlarda array bevosita keladi, ba’zilarida esa { results: [...] }
      const postsArray = Array.isArray(posts)
        ? posts
        : posts.results || posts.data || [];

      const transformedVideos = postsArray.map((post) => ({
        id: post.id,
        thumbnail: post.thumbnail || "https://via.placeholder.com/300x500.png",
        duration: post.duration || "0:30",
        views: post.views || "0",
      }));

      setVideos(transformedVideos);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message || "Failed to fetch data. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {userData?.username || "your_username"}
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                userData?.avatar ||
                "https://randomuser.me/api/portraits/men/10.jpg",
            }}
            style={styles.profileImage}
            onError={(e) =>
              console.log("Error loading image:", e.nativeEvent.error)
            }
          />

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.stat}>
              <Text style={styles.statNumber}>
                {userData?.following_count || 125}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stat}>
              <Text style={styles.statNumber}>
                {userData?.followers_count || "1.2M"}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stat}>
              <Text style={styles.statNumber}>15.8M</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>
            {userData?.first_name && userData?.last_name
              ? `${userData.first_name} ${userData.last_name}`
              : "Your Name"}
          </Text>
          <Text style={styles.bio}>
            {userData?.bio ||
              "Content creator 🎬 | Lifestyle & Travel ✈️\nDM for collabs 📩"}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareProfileButton}>
              <Text style={styles.shareProfileButtonText}>Share profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="person-add-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "videos" && styles.activeTab]}
            onPress={() => setActiveTab("videos")}
          >
            <Ionicons
              name="grid-outline"
              size={24}
              color={activeTab === "videos" ? "white" : "#8A8A8A"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "liked" && styles.activeTab]}
            onPress={() => setActiveTab("liked")}
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color={activeTab === "liked" ? "white" : "#8A8A8A"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "saved" && styles.activeTab]}
            onPress={() => setActiveTab("saved")}
          >
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={activeTab === "saved" ? "white" : "#8A8A8A"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.videosGrid}>
          {videos.map((video) => (
            <TouchableOpacity key={video.id} style={styles.videoItem}>
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.videoThumbnail}
              />
              <View style={styles.videoDurationOverlay}>
                <Text style={styles.videoDuration}>{video.duration}</Text>
              </View>
              <View style={styles.videoViewsOverlay}>
                <Ionicons name="play" size={12} color="white" />
                <Text style={styles.videoViews}>{video.views}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#0095f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
    gap: 32,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: "#8A8A8A",
    fontSize: 14,
    marginTop: 2,
  },
  displayName: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  bio: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    justifyContent: "center",
  },
  editProfileButton: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    flex: 1,
    maxWidth: 140,
  },
  editProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  shareProfileButton: {
    backgroundColor: "##1F1F1F",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    flex: 1,
    maxWidth: 140,
  },
  shareProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  moreButton: {
    backgroundColor: "#1F1F1F",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    marginTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  videosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 1,
  },
  videoItem: {
    width: width / 3,
    aspectRatio: 9 / 16,
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    borderWidth: 0.5,
    borderColor: "#111",
    backgroundColor: "#1A1A1A",
  },
  videoDurationOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDuration: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  videoViewsOverlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  videoViews: {
    color: "white",
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreen;
