"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const transformPostData = (post) => {
  return {
    id: post.id.toString(),
    uri: post.post,
    username: `@${post.user?.username || "user"}`,
    description: post.description || post.title || "No description",
    sound: post.music
      ? `${post.music.music_name} - ${post.music.singer}`
      : "Original Sound",
    likes: post.likes_count?.toString() || "0",
    comments: post.comments_count?.toString() || "0",
    saves: "0",
    shares: "0",
    profileImage: "https://randomuser.me/api/portraits/lego/1.jpg",
    albumImage: "https://randomuser.me/api/portraits/lego/2.jpg",
    isFollowing: false,
    fileName: post.post?.split("/").pop() || "video.mp4",
    extension: "mp4",
    title: post.title || "Video",
  };
};

const VideoItem = ({ item, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef(null);
  const isFocused = useIsFocused();

  const togglePlayback = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  return (
    <View style={styles.videoContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: item.uri }}
        paused={!isFocused}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping
        isMuted={false}
      />

      {/* Tap to play/pause overlay */}
      <TouchableOpacity
        style={styles.videoOverlay}
        onPress={togglePlayback}
        activeOpacity={1}
      >
        {!isPlaying && isActive && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={60} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.rightBar}>
        {/* Profile with red dot indicator */}
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={{ uri: item.profileImage }}
            style={styles.profileImage}
          />
          {!item.isFollowing && <View style={styles.followDot} />}
        </TouchableOpacity>

        {/* Like button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsLiked(!isLiked)}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={35}
            color={isLiked ? "#FF0050" : "white"}
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        {/* Comment button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={32} color="white" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        {/* Save/Bookmark button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={32}
            color={isSaved ? "#FFD700" : "white"}
          />
          <Text style={styles.actionText}>{item.saves}</Text>
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-redo-outline" size={32} color="white" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>

        {/* Spinning album art */}
        <TouchableOpacity style={styles.albumContainer}>
          <View style={styles.albumArt}>
            <Image
              source={{ uri: item.albumImage }}
              style={styles.albumImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.bottomInfo}>
          <TouchableOpacity>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <TouchableOpacity style={styles.soundInfo}>
            <Ionicons name="musical-notes" size={14} color="white" />
            <Text style={styles.soundText} numberOfLines={1}>
              {item.sound}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching videos from API...");
      const response = await fetch("http://192.168.71.53:8000/posts/post/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      let postsArray = [];

      if (Array.isArray(data)) {
        postsArray = data;
      } else if (data.results && Array.isArray(data.results)) {
        postsArray = data.results;
      } else if (data.posts && Array.isArray(data.posts)) {
        postsArray = data.posts;
      } else if (data.data && Array.isArray(data.data)) {
        postsArray = data.data;
      } else {
        console.warn("Unexpected API response format:", data);
        postsArray = [];
      }

      console.log("Posts array:", postsArray);

      const transformedVideos = postsArray.map(transformPostData);
      setVideos(transformedVideos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading videos: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No videos found</Text>
        <Text style={styles.emptySubtext}>
          {loading ? "Loading..." : "The API returned no videos"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVideos}>
          <Text style={styles.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab("Following")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Following" && styles.activeTabText,
                ]}
              >
                Following
              </Text>
              {activeTab === "Following" && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab("For You")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "For You" && styles.activeTabText,
                ]}
              >
                For You
              </Text>
              {activeTab === "For You" && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Video Feed */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VideoItem item={item} isActive={index === currentVideoIndex} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubtext: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  videoContainer: {
    width: width,
    height: height,
    position: "relative",
  },
  video: {
    width: width,
    height: height,
    position: "absolute",
  },
  videoOverlay: {
    width: width,
    height: height,
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 50,
    padding: 20,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingTop: StatusBar.currentHeight || 44,
  },
  topBarContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: 8,
    position: "relative",
  },
  tabText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    fontSize: 18,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -2,
    width: 28,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 1.5,
  },
  rightBar: {
    position: "absolute",
    right: 12,
    bottom: 40,
    alignItems: "center",
    zIndex: 10,
  },
  profileContainer: {
    marginBottom: 10,
    position: "relative",
    alignItems: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  followDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FF0050",
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
    textAlign: "center",
  },
  albumContainer: {
    marginTop: 8,
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  albumImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: -60,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 8,
  },
  bottomInfo: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 80,
    zIndex: 10,
  },
  username: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  videoDescription: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: "400",
  },
  soundInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    maxWidth: 280,
  },
  soundText: {
    color: "white",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
    flex: 1,
  },
});

export default HomeScreen;
