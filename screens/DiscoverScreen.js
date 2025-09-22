"use client";

import { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const DiscoverScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Top");

  // Sample trending hashtags
  const trendingHashtags = [
    { id: 1, tag: "#fyp", views: "2.1B" },
    { id: 2, tag: "#viral", views: "1.8B" },
    { id: 3, tag: "#dance", views: "956M" },
    { id: 4, tag: "#comedy", views: "743M" },
    { id: 5, tag: "#food", views: "621M" },
  ];

  // Sample discover videos
  const discoverVideos = [
    { id: 1, thumbnail: "/dancing-girl.jpg", views: "1.2M", duration: "0:15" },
    {
      id: 2,
      thumbnail: "/cooking-recipe.png",
      views: "856K",
      duration: "0:30",
    },
    { id: 3, thumbnail: "/funny-cat.png", views: "2.1M", duration: "0:12" },
    {
      id: 4,
      thumbnail: "/makeup-tutorial.png",
      views: "743K",
      duration: "0:45",
    },
    { id: 5, thumbnail: "/travel-vlog.png", views: "1.5M", duration: "0:28" },
    {
      id: 6,
      thumbnail: "/workout-fitness.png",
      views: "923K",
      duration: "0:22",
    },
  ];

  const tabs = ["Top", "Users", "Videos", "Sounds", "LIVE", "Hashtags"];

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
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#8A8A8A" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="scan" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
        {activeTab === "Top" && (
          <>
            {/* Trending Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending hashtags</Text>
              <FlatList
                data={trendingHashtags}
                renderItem={renderHashtagItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            {/* Discover Videos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover</Text>
              <FlatList
                data={discoverVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.videoRow}
              />
            </View>
          </>
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

        {/* Other tabs content would go here */}
        {activeTab !== "Top" && activeTab !== "Hashtags" && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No results found</Text>
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
});

export default DiscoverScreen;
