"use client";

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

const { width } = Dimensions.get("window");

const DiscoverScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Users");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.71.53:8000/posts/post/")
      .then((res) => res.json())
      .then((json) => {
        console.log("Backenddan kelgan:", json);
        setData(json.results);
        setFilteredData(json.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);
    try {
      const res = await fetch(
        `http://192.168.71.53:8000/posts/post/?search=${text}`
      );
      const json = await res.json();
      console.log("Search natijasi:", json);
      setFilteredData(json.results);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const trendingHashtags = [{ id: 1, tag: "#fyp", views: "2.1B" }];

  const discoverVideos = [
    { id: 1, thumbnail: "/dancing-girl.jpg", views: "1.2M", duration: "0:15" },
  ];
  const sounds = [
    {
      id: 1,
      title: "Cool Beat",
      artist: "DJ Max",
      cover: "https://picsum.photos/100/100?random=1",
    },
  ];
  const users = [
    {
      id: 1,
      name: "john_doe",
      followers: "120K",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
  ];

  const tabs = ["Users", "Videos", "Sounds", "Hashtags"];

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userFollowers}>{item.followers} followers</Text>
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
        <Text style={styles.soundTitle}>{item.title}</Text>
        <Text style={styles.soundArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity style={styles.useButton}>
        <Text style={styles.useButtonText}>Use</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVideoItem = ({ item, index }) => (
    <TouchableOpacity style={styles.videoItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoOverlay}>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
      <View style={styles.videoInfo}>
        <Ionicons name="play" size={12} color="#FFFFFF" />
        <Text style={styles.videoViews}>{item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHashtagItem = ({ item }) => (
    <TouchableOpacity style={styles.hashtagItem}>
      <View style={styles.hashtagIcon}>
        <Text style={styles.hashtagSymbol}>#</Text>
      </View>
      <View style={styles.hashtagInfo}>
        <Text style={styles.hashtagText}>{item.tag}</Text>
        <Text style={styles.hashtagViews}>{item.views} views</Text>
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
              data={filteredData}
              renderItem={({ item }) => (
                <Text style={styles.item}>{item.title}</Text>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
        {activeTab === "Videos" && (
          <>
            <View style={styles.section}>
              <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: "#fff" }}>{item.title}</Text>
                    <Video
                      source={{ uri: item.post }}
                      style={{ width: "100%", height: 200 }}
                      useNativeControls
                      resizeMode="contain"
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </>
        )}

        {activeTab === "Sounds" && (
          <View style={styles.section}>
            <FlatList
              data={sounds}
              renderItem={renderSoundItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
        {activeTab === "Hashtags" && (
          <View style={styles.section}>
            <FlatList
              data={trendingHashtags}
              renderItem={renderHashtagItem}
              keyExtractor={(item) => item.id.toString()}
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
