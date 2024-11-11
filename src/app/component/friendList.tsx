// FriendList.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import Sidebar from "../component/sidebar";
import { Entypo } from "@expo/vector-icons";

const FriendList = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        {/* Sidebar Overlay */}
        {isSidebarVisible && (
          <TouchableWithoutFeedback onPress={toggleSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {/* Sidebar */}
        <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

        {/* Header with Toggle Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
            <Entypo name="menu" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Friends List</Text>
        </View>

        {/* Friends List */}
        <FlatList
          data={[
            {
              id: "1",
              name: "Alice",
              relation: "Sister",
              status: "Registered",
            },
            {
              id: "2",
              name: "Bob",
              relation: "Colleague",
              status: "Registered",
            },
            { id: "3", name: "Charlie", relation: "Son", status: "Registered" },
            {
              id: "4",
              name: "David",
              relation: "Friend",
              status: "Not Registered",
            },
            {
              id: "5",
              name: "Eve",
              relation: "Friend",
              status: "Not Registered",
            },
          ]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.friendListContainer}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.friendRelation}>{item.relation}</Text>
              <Text style={styles.friendStatus}>{item.status}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#24A0ED",
    elevation: 5,
  },
  toggleButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  friendListContainer: {
    paddingTop: 20, // Adds space below the header for list content
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  friendName: {
    flex: 1,
    fontSize: 18,
  },
  friendRelation: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  friendStatus: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
});
