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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import api from "../src/api/api";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

const transformPostData = (post) => {
  // Fayl URL dan turini aniqlash
  const fileUri = post.post || "";
  const fileExtension = fileUri.split(".").pop()?.toLowerCase() || "";

  // Video formatlari
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "3gp"];
  const isVideo = videoExtensions.includes(fileExtension);

  // Rasm formatlari
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const isImage = imageExtensions.includes(fileExtension);

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
    cover: post.music?.cover || "https://via.placeholder.com/150",
    saves: "0",
    shares: "0",
    profileImage: post.user?.avatar
      ? post.user.avatar
      : "https://ui-avatars.com/api/?name=" + (post.user?.username || "U"),
    albumImage:
      post.user?.avatar || "https://randomuser.me/api/portraits/lego/2.jpg",
    isFollowing: false,
    fileName: post.post?.split("/").pop() || "file",
    extension: fileExtension,
    title: post.title || "Post",
    hashtags: post.hashtags?.map((h) => `#${h.name}`).join(" ") || "",

    // 🔥 YANGI: Media turi
    mediaType: isVideo ? "video" : isImage ? "image" : "unknown",
    isVideo: isVideo,
    isImage: isImage,
  };
};

const VideoItem = ({ item, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef(null);
  const isFocused = useIsFocused();
  const lastTapRef = useRef(null);
  const likeAnim = useRef(new Animated.Value(0)).current;

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

      setShowControls(true);

      setTimeout(() => setShowControls(false), 383682000);
    }
  };

  useEffect(() => {
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

  const handleTap = () => {
    const now = Date.now();

    if (lastTapRef.current && now - lastTapRef.current < 300) {
      setIsLiked(true);
      triggerLikeAnimation();
      lastTapRef.current = null;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current && now === lastTapRef.current) {
          togglePlayback();
          lastTapRef.current = null;
        }
      }, 300);
    }
  };

  const triggerLikeAnimation = () => {
    likeAnim.setValue(0);
    Animated.sequence([
      Animated.spring(likeAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const heartStyle = {
    opacity: likeAnim,
    transform: [
      {
        scale: likeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.5],
        }),
      },
    ],
  };

  return (
    <View style={styles.videoContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Video
        ref={videoRef}
        source={{ uri: item.uri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping
      />

      {/* Tap overlay */}
      <TouchableOpacity
        style={styles.videoOverlay}
        onPress={() => handleTap()}
        activeOpacity={1}
      >
        {showControls && (
          <View style={styles.centerControls}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={60}
              color="rgba(255,255,255,0.9)"
              style={{ marginBottom: 20 }}
            />
          </View>
        )}
      </TouchableOpacity>
      <Animated.View style={[styles.likeHeart, heartStyle]}>
        <Ionicons name="heart" size={100} color="red" />
      </Animated.View>

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
            <Image source={{ uri: item.cover }} style={styles.albumImage} />
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
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.hashtags}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MediaItem = ({ item, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef(null);
  const isFocused = useIsFocused();
  const lastTapRef = useRef(null);
  const likeAnim = useRef(new Animated.Value(0)).current;

  const togglePlayback = async () => {
    if (item.isVideo && videoRef.current) {
      const status = await videoRef.current.getStatusAsync();

      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }

      setShowControls(true);
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  useEffect(() => {
    if (item.isVideo && videoRef.current) {
      if (isActive && isFocused) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive, isFocused, item.isVideo]);

  const handleTap = () => {
    const now = Date.now();

    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // Double tap - like
      setIsLiked(true);
      triggerLikeAnimation();
      lastTapRef.current = null;
    } else {
      // Single tap - play/pause yoki hech narsa (rasm uchun)
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current && now === lastTapRef.current) {
          if (item.isVideo) {
            togglePlayback();
          }
          lastTapRef.current = null;
        }
      }, 300);
    }
  };

  const triggerLikeAnimation = () => {
    likeAnim.setValue(0);
    Animated.sequence([
      Animated.spring(likeAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const heartStyle = {
    opacity: likeAnim,
    transform: [
      {
        scale: likeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.5],
        }),
      },
    ],
  };

  return (
    <View style={styles.videoContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 🔥 VIDEO YOKI IMAGE KO'RSATISH */}
      {item.isVideo ? (
        <Video
          ref={videoRef}
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={isActive && isFocused}
          isLooping
        />
      ) : item.isImage ? (
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.unknownMedia}>
          <Ionicons name="document-outline" size={50} color="white" />
          <Text style={styles.unknownText}>Unknown media type</Text>
        </View>
      )}

      {/* Tap overlay */}
      <TouchableOpacity
        style={styles.videoOverlay}
        onPress={handleTap}
        activeOpacity={1}
      >
        {showControls && item.isVideo && (
          <View style={styles.centerControls}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={60}
              color="rgba(255,255,255,0.9)"
              style={{ marginBottom: 20 }}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Like heart animation */}
      <Animated.View style={[styles.likeHeart, heartStyle]}>
        <Ionicons name="heart" size={100} color="red" />
      </Animated.View>

      {/* Right action buttons */}
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

        {/* Media type indicator */}
        <View style={styles.mediaTypeIndicator}>
          {item.isVideo && <Ionicons name="videocam" size={16} color="white" />}
          {item.isImage && <Ionicons name="image" size={16} color="white" />}
        </View>

        {/* Spinning album art */}
        <TouchableOpacity style={styles.albumContainer}>
          <View style={styles.albumArt}>
            <Image
              source={{ uri: item.cover }}
              style={styles.albumImage}
              defaultSource={{ uri: "https://via.placeholder.com/150" }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom info overlay */}
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
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.hashtags}
          </Text>

          {/* Media type badge */}
          <View style={styles.mediaTypeBadge}>
            <Text style={styles.mediaTypeText}>
              {item.isVideo ? "VIDEO" : item.isImage ? "PHOTO" : "FILE"}
            </Text>
          </View>
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
  const navigation = useNavigation();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await api.get("/posts/post/");

      let postsArray = Array.isArray(data)
        ? data
        : data.results || data.posts || data.data || [];

      // Debug uchun har bir postni tekshirish
      postsArray.forEach((post, index) => {
        const fileUri = post.post || "";
        const fileExtension = fileUri.split(".").pop()?.toLowerCase() || "";
        console.log(`Post ${index}:`, {
          id: post.id,
          uri: fileUri,
          extension: fileExtension,
          type:
            fileExtension === "mp4"
              ? "video"
              : ["jpg", "jpeg", "png"].includes(fileExtension)
              ? "image"
              : "unknown",
        });
      });

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
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate("Discover")}
            >
              <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Video Feed */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MediaItem item={item} isActive={index === currentVideoIndex} />
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
  image: {
    width: width,
    height: height,
    position: "absolute",
  },
  unknownMedia: {
    width: width,
    height: height,
    position: "absolute",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  unknownText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  mediaTypeIndicator: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  mediaTypeBadge: {
    backgroundColor: "rgba(255,0,80,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  mediaTypeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

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
    bottom: 100,
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
    bottom: -1,
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
  headerButton: {
    marginLeft: 100,
  },
  centerControls: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  likeHeart: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    zIndex: 10,
  },
});

export default HomeScreen;
