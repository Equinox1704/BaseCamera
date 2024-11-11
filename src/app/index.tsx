import { View, Text, Button } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import MarkdownDisplay from "./component/MarkDownDisplay";
import { SafeAreaView } from "react-native-safe-area-context";

const description = `
# Camera app 
Take photos and record videos with React Native Vision Camera`;

const DayDetailsScreen = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "X: Camera" }} />

      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="../component/login" asChild>
        <Button title="Go to App" />
      </Link>
    </SafeAreaView>
  );
};

export default DayDetailsScreen;
