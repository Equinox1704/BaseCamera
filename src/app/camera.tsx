import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        // #to check for the active state set to false after moving away
        // console.log('navigating away');
        setIsActive(false);
      };
    }, [])
  );

  const device = useCameraDevice('back', {physicalDevices: ['ultra-wide-angle-camera']});

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if(!hasPermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found</Text>
  }

  // #to check for permissions
  // console.log("hasPermission:", hasPermission);

  // #to check for the active state of the camera when it's accessed
  // console.log("isActive:", isActive);

  return (
    <View style={{flex:1}}>
      <Stack.Screen options={{headerShown: false}} />
      <Camera style={styles.container} device={device} isActive={isActive} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});

export default CameraScreen;