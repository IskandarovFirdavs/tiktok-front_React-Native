"use client";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const FriendsScreen = () => {
  const [activeTab, setActiveTab] = useState("Discover");

  const suggestedUsers = [
    {
      id: "1",
      username: "@sarah_travels",
      name: "Sarah Johnson",
      followers: "125K",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isFollowing: false,
      mutualFriends: 3,
      videoThumbnail: "/travel-vlog.png",
    },
    {
      id: "2",
      username: "@mike_fitness",
      name: "Mike Chen",
      followers: "89K",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      isFollowing: false,
      mutualFriends: 7,
      videoThumbnail: "/workout-fitness.png",
    },
    {
      id: "3",
      username: "@foodie_anna",
      name: "Anna Rodriguez",
      followers: "234K",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isFollowing: true,
      mutualFriends: 12,
      videoThumbnail: "/cooking-recipe.png",
    },
    {
      id: "4",
      username: "@dance_queen_maya",
      name: "Maya Patel",
      followers: "456K",
      avatar: "/dancing-girl.jpg",
      isFollowing: false,
      mutualFriends: 5,
      videoThumbnail: "/dancing-girl.jpg",
    },
  ];

  const followingUsers = [
    {
      id: "1",
      username: "@chef_gordon_mini",
      name: "Gordon Mini",
      followers: "1.2M",
      avatar: "/cooking-recipe.png",
      isFollowing: true,
      lastActive: "2h ago",
    },
    {
      id: "2",
      username: "@makeup_artist",
      name: "Beauty Guru",
      followers: "678K",
      avatar: "/makeup-tutorial.png",
      isFollowing: true,
      lastActive: "5h ago",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Discover" && styles.activeTab]}
          onPress={() => setActiveTab("Discover")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Discover" && styles.activeTabText,
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Following" && styles.activeTab]}
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Followers" && styles.activeTab]}
          onPress={() => setActiveTab("Followers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Followers" && styles.activeTabText,
            ]}
          >
            Followers
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "Discover" && (
          <>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="search" size={24} color="#FF0050" />
                </View>
                <Text style={styles.actionText}>Find friends</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                  <Ionicons name="share" size={24} color="#FF0050" />
                </View>
                <Text style={styles.actionText}>Invite friends</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested for you</Text>
              {suggestedUsers.map((user) => (
                <View key={user.id} style={styles.userItem}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.followers}>
                      {user.followers} followers
                    </Text>
                    {user.mutualFriends > 0 && (
                      <Text style={styles.mutualFriends}>
                        {user.mutualFriends} mutual friends
                      </Text>
                    )}
                  </View>
                  <View style={styles.userActions}>
                    <Image
                      source={{ uri: user.videoThumbnail }}
                      style={styles.videoThumbnail}
                    />
                    <TouchableOpacity
                      style={[
                        styles.followButton,
                        user.isFollowing && styles.followingButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.followText,
                          user.isFollowing && styles.followingText,
                        ]}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === "Following" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Following ({followingUsers.length})
            </Text>
            {followingUsers.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.followers}>
                    {user.followers} followers
                  </Text>
                  <Text style={styles.lastActive}>
                    Active {user.lastActive}
                  </Text>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.messageButton}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.followingButton}>
                    <Text style={styles.followingText}>Following</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Followers" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Followers (1.2M)</Text>
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={60} color="#333" />
              <Text style={styles.emptyStateText}>
                Your followers will appear here
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  headerButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  tab: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    marginRight: 32,
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
    color: "white",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  quickActions: {
    flexDirection: "row",
    paddingVertical: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 0, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    color: "#CCCCCC",
    fontSize: 14,
    marginTop: 2,
  },
  followers: {
    color: "#8A8A8A",
    fontSize: 13,
    marginTop: 2,
  },
  mutualFriends: {
    color: "#8A8A8A",
    fontSize: 12,
    marginTop: 2,
  },
  lastActive: {
    color: "#8A8A8A",
    fontSize: 12,
    marginTop: 2,
  },
  userActions: {
    alignItems: "center",
    gap: 8,
  },
  videoThumbnail: {
    width: 32,
    height: 40,
    borderRadius: 4,
    marginBottom: 8,
  },
  followButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  followText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  followingText: {
    color: "#8A8A8A",
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: "#1A1A1A",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    marginTop: 16,
  },
});

export default FriendsScreen;
