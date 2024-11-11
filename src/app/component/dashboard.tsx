// Dashboard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../component/sidebar";
import { Link } from "expo-router";

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Handle overlay press to close the sidebar
  const handleOutsidePress = () => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        {/* Toggle Sidebar Button */}
        <TouchableOpacity
          onPress={() => setSidebarVisible(!sidebarVisible)}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.dashboardText}>Dashboard</Text>

        {/* Overlay for closing sidebar when clicking outside */}
        {sidebarVisible && (
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        <Link href="/camera" asChild>
          <Button title="Go to Camera" />
        </Link>
        {/* Sidebar */}
        <Sidebar
          isVisible={sidebarVisible}
          toggleSidebar={() => setSidebarVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container1: { flex: 1, justifyContent: "center", alignItems: "center" },
  menuButton: { position: "absolute", top: 40, left: 20 },
  menuButtonText: { fontSize: 24, color: "#24A0ED" },
  dashboardText: { fontSize: 40, fontWeight: "bold" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
});
