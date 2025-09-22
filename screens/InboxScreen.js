"use client";

import React from "react";

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

const InboxScreen = () => {
  const messages = [
    {
      id: "1",
      username: "@jamil_kandimov",
      message: "Assalomu alaykum ustoz",
      time: "2 daqiqa",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6d87zy2l97Gbuz1xheO71Fzw31vhLFurSyg&s",
      unread: true,
    },
    {
      id: "2",
      username: "@aziz_fitnes",
      message: "Obuna bo‘lganing uchun rahmat!",
      time: "1 soat",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUW0u5Eiiy3oM6wcpeEE6sXCzlh8G-tX1_Iw&s",
      unread: false,
    },
    {
      id: "3",
      username: "@dilnoza_taomlar",
      message: "Retseptini ulashasanmi? 😍",
      time: "3 soat",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUW0u5Eiiy3oM6wcpeEE6sXCzlh8G-tX1_Iw&s",
      unread: true,
    },
    {
      id: "4",
      username: "@oshpaz_sardor",
      message: "Hamkorlik qilamizmi? Menga yoz! 📩",
      time: "1 kun",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUW0u5Eiiy3oM6wcpeEE6sXCzlh8G-tX1_Iw&s",
      unread: true,
    },
  ];

  const activities = [
    {
      id: "1",
      type: "like",
      username: "@travel_blogger",
      message: "liked your video",
      time: "5m",
      avatar: "/travel-vlog.png",
      videoThumbnail: "/dancing-girl.jpg",
    },
    {
      id: "2",
      type: "follow",
      username: "@fitness_guru",
      message: "started following you",
      time: "15m",
      avatar: "/workout-fitness.png",
    },
    {
      id: "3",
      type: "comment",
      username: "@makeup_artist",
      message: 'commented: "Amazing tutorial! 💄"',
      time: "1h",
      avatar: "/makeup-tutorial.png",
      videoThumbnail: "/makeup-tutorial.png",
    },
  ];

  const [activeTab, setActiveTab] = React.useState("All activity");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "All activity" && styles.activeTab]}
          onPress={() => setActiveTab("All activity")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "All activity" && styles.activeTabText,
            ]}
          >
            All activity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Messages" && styles.activeTab]}
          onPress={() => setActiveTab("Messages")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Messages" && styles.activeTabText,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "All activity" ? (
          <>
            {activities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.activityItem}>
                <Image
                  source={{ uri: activity.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    <Text style={styles.username}>{activity.username}</Text>
                    <Text style={styles.activityMessage}>
                      {" "}
                      {activity.message}
                    </Text>
                  </Text>
                  <Text style={styles.time}>{activity.time}</Text>
                </View>
                {activity.videoThumbnail && (
                  <Image
                    source={{ uri: activity.videoThumbnail }}
                    style={styles.videoThumbnail}
                  />
                )}
                {activity.type === "follow" && (
                  <TouchableOpacity style={styles.followBackButton}>
                    <Text style={styles.followBackText}>Follow back</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {messages.map((message) => (
              <TouchableOpacity key={message.id} style={styles.messageItem}>
                <Image source={{ uri: message.avatar }} style={styles.avatar} />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.username}>{message.username}</Text>
                    <Text style={styles.time}>{message.time}</Text>
                  </View>
                  <Text style={styles.messageText}>{message.message}</Text>
                </View>
                {message.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </>
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
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  time: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  messageText: {
    color: "#CCCCCC",
    fontSize: 15,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0050",
    marginLeft: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    marginBottom: 4,
  },
  activityMessage: {
    color: "#CCCCCC",
    fontSize: 15,
  },
  videoThumbnail: {
    width: 40,
    height: 56,
    borderRadius: 4,
    marginLeft: 12,
  },
  followBackButton: {
    backgroundColor: "#FF0050",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  followBackText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default InboxScreen;
