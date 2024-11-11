import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Image, Animated } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions } from 'react-native-vision-camera';
import { useFocusEffect } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [showUpload, setShowUpload] = useState(false); // State for showing only the upload button

  const camera = useRef<Camera>(null);

  // Activate camera when screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  const device = useCameraDevice('back', { physicalDevices: ['ultra-wide-angle-camera'] });

  // Request permissions for camera and (later microphone also)
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // Capture a photo
  const onTakePicture = async () => {
    const photo = await camera.current?.takePhoto({ flash });
    setPhoto(photo);
    setShowUpload(false); // Reset the upload state when a new photo is taken
  };

  // Upload function for photo or video
  const uploadPhoto = async () => {
    if (!photo) return;
    const result = await fetch(`file://${photo.path}`);
    const data = await result.blob();
    console.log(data); // Display the photo blob in the console
  };

  // Scale animation for capture button press
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onTakePicture(); // Capture photo on release
  };

  // Show loading spinner if permissions are not granted
  if (!hasPermission) return <ActivityIndicator />;
  if (!device) return <Text>Camera device not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        ref={camera}
        style={styles.container}
        device={device}
        isActive={isActive && !photo}
        photo={true}
      />

      {photo ? (
        <>
          <Image style={styles.photo} source={{ uri: 'file://' + photo.path }} />

          {!showUpload ? (
            <View style={styles.buttonContainer}>
              {/* Confirm Button */}
              <Pressable
                onPress={() => setShowUpload(true)} // Show only upload button upon confirmation
                style={styles.confirmButton}
              >
                <FontAwesome name="check" size={24} color="black" />
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>

              {/* Retake Button */}
              <Pressable onPress={() => setPhoto(undefined)} style={styles.retakeButton}>
                <FontAwesome name="repeat" size={24} color="black" />
                <Text style={styles.buttonText}>Retake</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.footer}>
              {/* Upload Button */}
              <Pressable onPress={uploadPhoto} style={styles.uploadButton}>
                <MaterialIcons name="cloud-upload" size={24} color="black" />
                <Text style={styles.uploadText}>Upload</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.flash}>
            <Ionicons
              name={flash === 'off' ? 'flash-off' : 'flash'}
              onPress={() => setFlash((curValue) => (curValue === 'off' ? 'on' : 'off'))}
              size={28}
              color="white"
            />
          </View>

          <View style={styles.captureButtonContainer}>
            <Animated.View style={[styles.outerRing, { transform: [{ scale: scaleValue }] }]}>
              <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.innerCircle} />
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  flash: {
    position: 'absolute',
    right: 10,
    top: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    backgroundColor: '#24A0ED',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24A0ED',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  uploadText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 5,
  },
  captureButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
  },
  outerRing: {
    width: 85,
    height: 85,
    backgroundColor: '#24A0ED',
    borderRadius: 85 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 65,
    height: 65,
    backgroundColor: 'white',
    borderRadius: 65 / 2,
  },
});

export default CameraScreen;
