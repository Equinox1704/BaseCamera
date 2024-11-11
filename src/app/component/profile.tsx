import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Href, useRouter } from "expo-router";
import Sidebar from "../component/sidebar"; // Ensure Sidebar is correctly imported

const Profile = () => {
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Rahul",
    email: "rahul.123@example.com",
    phone: "123-456-7890",
    address: "123, New Delhi, India",
    nationality: "Indian",
    gender: "Male",
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    nationality: false,
    gender: false,
  });

  type Field =
    | "name"
    | "email"
    | "phone"
    | "address"
    | "nationality"
    | "gender";

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  const toggleEdit = (field: Field) => {
    setIsEditing((prevState) => ({ ...prevState, [field]: !prevState[field] }));
  };
  const handleInputChange = (field: Field, value: string) => {
    setUserInfo((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setIsSidebarVisible(false)}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.menuButton}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.profileText}>Profile</Text>
          </View>

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.userImage}
            />
          </View>

          {/* Profile Details */}
          <View style={styles.infoContainer}>
            {Object.keys(userInfo).map((field) => (
              <View style={styles.infoField} key={field}>
                <Text style={styles.label}>{`${field
                  .charAt(0)
                  .toUpperCase()}${field.slice(1)}:`}</Text>
                {isEditing[field as Field] ? (
                  <TextInput
                    style={styles.input}
                    value={userInfo[field as Field]}
                    onChangeText={(text) =>
                      handleInputChange(field as Field, text)
                    }
                  />
                ) : (
                  <Text style={styles.infoText}>
                    {userInfo[field as Field]}
                  </Text>
                )}
                <TouchableOpacity onPress={() => toggleEdit(field as Field)}>
                  <Text style={styles.editButton}>
                    {isEditing[field as Field] ? "Save" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Sidebar */}
      {isSidebarVisible && (
        <Sidebar
          isVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
          navigateToPage={(page: Href<string | object>) => {
            setIsSidebarVisible(false);
            router.push(page);
          }}
          currentPage="profile"
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingBottom: 70,
  },
  header: {
    backgroundColor: "#24A0ED",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    fontSize: 24,
    color: "#fff",
    paddingRight: 15,
  },
  profileText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    padding: 22,
  },
  infoField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  infoText: {
    flex: 2,
    fontSize: 18,
  },
  input: {
    flex: 2,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    fontSize: 18,
    padding: 4,
  },
  editButton: {
    fontSize: 16,
    color: "#24A0ED",
    marginLeft: 8,
  },
});
