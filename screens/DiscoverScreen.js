"use client";
import { Audio } from "expo-av";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";
import api from "../src/api/api";
const { width } = Dimensions.get("window");

const DiscoverScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Users");
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [hashtag, setHashtag] = useState([]);
  const [music, setMusic] = useState([]);
  const [sound, setSound] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  async function toggleSound(item) {
    try {
      if (currentTrackId === item.id && sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setCurrentTrackId(null);
        return;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.file },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentTrackId(item.id);
    } catch (err) {
      console.error("Audio error:", err);
    }
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await api.get("/posts/post/");
        const postsArray = Array.isArray(data) ? data : data.results || [];
        setVideos(postsArray);
      } catch (e) {
        console.error("Error fetching videos:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/");
        setAllUsers(res.results || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setLoading(true);
        const data = await api.get("/posts/hashtags/");
        const hashtagsArray = Array.isArray(data) ? data : data.results || [];
        setHashtag(hashtagsArray);
      } catch (e) {
        console.error("Error fetching hashtags:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        setLoading(true);
        const data = await api.get("/posts/musics/");
        const musicsArray = Array.isArray(data) ? data : data.results || [];
        setMusic(musicsArray);
      } catch (e) {
        console.error("Error fetching hashtags:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);

    try {
      if (activeTab === "Users") {
        if (text.trim().length === 0) {
          setFilteredData(allUsers);
        } else {
          const res = await api.get(`/users/?search=${text}`);
          setFilteredData(res.results || []);
        }
      } else if (activeTab === "Videos") {
        if (text.trim().length === 0) {
          const data = await api.get("/posts/post/");
          const postsArray = Array.isArray(data) ? data : data.results || [];
          setVideos(postsArray);
        } else {
          const res = await api.get(`/posts/post/?search=${text}`);
          const postsArray = Array.isArray(res) ? res : res.results || [];
          setVideos(postsArray);
        }
      } else if (activeTab === "Hashtags") {
        if (text.trim().length === 0) {
          const data = await api.get("/posts/hashtags/");
          const hashtagsArray = Array.isArray(data) ? data : data.results || [];
          setHashtag(hashtagsArray);
        } else {
          const res = await api.get(`/posts/hashtags/?search=${text}`);
          const hashtagsArray = Array.isArray(res) ? res : res.results || [];
          setHashtag(hashtagsArray);
        }
      } else if (activeTab === "Sounds") {
        if (text.trim().length === 0) {
          const data = await api.get("/posts/musics/");
          const musicsArray = Array.isArray(data) ? data : data.results || [];
          setMusic(musicsArray);
        } else {
          const res = await api.get(`/posts/musics/?search=${text}`);
          const musicsArray = Array.isArray(res) ? res : res.results || [];
          setMusic(musicsArray);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const sounds = [
    {
      id: 1,
      title: "Cool Beat",
      artist: "DJ Max",
      cover: "https://picsum.photos/100/100?random=1",
    },
  ];

  const tabs = ["Users", "Videos", "Sounds", "Hashtags"];

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userFollowers}>
          {item.first_name} {item.last_name}
        </Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
  const renderSoundItem = ({ item }) => (
    <View style={styles.soundItem}>
      <Image source={{ uri: item.cover }} style={styles.soundCover} />
      <View style={{ flex: 1 }}>
        <Text style={styles.soundTitle}>{item.music_name}</Text>
        <Text style={styles.soundArtist}>{item.singer}</Text>
      </View>
      <TouchableOpacity
        style={styles.useButton}
        onPress={() => toggleSound(item)}
      >
        <Text style={styles.useButtonText}>
          {currentTrackId === item.id ? "⏸ Stop" : "▶ Play"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVideoItem = ({ item }) => (
    <View style={styles.sectionVideo}>
      <Video
        source={{ uri: item.post }}
        style={{ width: "100%", height: 220, marginBottom: 10 }}
        useNativeControls
        resizeMode="cover"
      />
      <Text style={styles.hashtagText}>{item.title}</Text>
    </View>
  );

  const renderHashtagItem = ({ item }) => (
    <TouchableOpacity style={styles.hashtagItem}>
      <View style={styles.hashtagIcon}>
        <Text style={styles.hashtagSymbol}>#</Text>
      </View>
      <View style={styles.hashtagInfo}>
        <Text style={styles.hashtagText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#8A8A8A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8A8A8A"
            value={query}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#8A8A8A" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "Users" && (
          <View style={styles.section}>
            <FlatList
              data={filteredData.length > 0 || query ? filteredData : allUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === "Videos" && (
          <View style={styles.viewVideo}>
            {loading ? (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={videos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // yoki 3 ustun
                columnWrapperStyle={{ justifyContent: "space-between" }}
              />
            )}
          </View>
        )}

        {activeTab === "Sounds" && (
          <View style={styles.section}>
            <FlatList
              data={music}
              renderItem={renderSoundItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
        {activeTab === "Hashtags" && (
          <View style={styles.section}>
            <FlatList
              data={hashtag}
              renderItem={renderHashtagItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  scanButton: {
    marginLeft: 12,
    padding: 8,
  },
  tabContainer: {
    maxHeight: 50,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    color: "#8A8A8A",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  viewVideo: {
    paddingHorizontal: "10%",
    flex: 1,
  },
  sectionVideo: {
    width: "45%",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  hashtagItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  hashtagIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#FF0050",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  hashtagSymbol: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  hashtagInfo: {
    flex: 1,
  },
  hashtagText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  hashtagViews: {
    color: "#8A8A8A",
    fontSize: 14,
    marginTop: 2,
  },
  videoRow: {
    justifyContent: "space-between",
  },
  videoItem: {
    width: (width - 48) / 3,
    marginBottom: 8,
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
  },
  videoOverlay: {
    position: "absolute",
    bottom: 24,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDuration: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  videoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  videoViews: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#8A8A8A",
    fontSize: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 1,
  },
  userFollowers: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  followButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  soundItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  soundCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  soundTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  soundArtist: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  useButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#8A8A8A",
  },
  useButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default DiscoverScreen;
