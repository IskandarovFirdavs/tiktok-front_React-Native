"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");

  const trendingHashtags = [
    { tag: "#fyp", views: "15.2B" },
    { tag: "#viral", views: "8.9B" },
    { tag: "#trending", views: "6.1B" },
    { tag: "#dance", views: "4.8B" },
    { tag: "#comedy", views: "3.2B" },
  ];

  const suggestedUsers = [
    {
      id: "1",
      username: "@trending_creator",
      followers: "2.1M",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      id: "2",
      username: "@viral_dancer",
      followers: "1.8M",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending hashtags</Text>
          {trendingHashtags.map((item, index) => (
            <TouchableOpacity key={index} style={styles.hashtagItem}>
              <View>
                <Text style={styles.hashtag}>{item.tag}</Text>
                <Text style={styles.views}>{item.views} views</Text>
              </View>
              <Ionicons name="trending-up" size={20} color="#FF0050" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested accounts</Text>
          {suggestedUsers.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userItem}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.followers}>{user.followers} followers</Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  hashtagItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  hashtag: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  views: {
    color: "#999",
    fontSize: 14,
    marginTop: 2,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  followers: {
    color: "#999",
    fontSize: 14,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  followText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SearchScreen;
