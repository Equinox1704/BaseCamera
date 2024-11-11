// Sidebar.tsx
import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

type SidebarProps = {
    isVisible: boolean;
    toggleSidebar: () => void;
  };
  
  const Sidebar: FC<SidebarProps> = ({ isVisible, toggleSidebar }) => {
  const router = useRouter();

  if (!isVisible) return null;

  return (
    <View style={styles.sidebar}>
      {/* Profile Image */}
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image
        style={styles.profileImage}
      />

      {/* Menu Options */}
      <TouchableOpacity onPress={() => { toggleSidebar(); router.push('../component/dashboard'); }}>
        <Text style={styles.menuOption}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); router.push('../component/friendList'); }}>
        <Text style={styles.menuOption}>Friends List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); router.push('../component/profile'); }}>
        <Text style={styles.menuOption}>Profile</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={toggleSidebar}>
        <Text style={styles.menuOption}>Settings</Text>
      </TouchableOpacity> */}

      {/* Login/Logout Button */}
      <TouchableOpacity onPress={() => { toggleSidebar(); router.push('../component/login'); }}>
        <Text style={styles.menuOption}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#24A0ED', // Solid background color
    padding: 36,
    elevation: 15,
    zIndex: 10, // Ensure sidebar appears on top
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuOption: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
});
