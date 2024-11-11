import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Image, Animated } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import { useFocusEffect } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Video } from 'expo-av';
 // Check for use later

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: microphonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();
  const [showUpload, setShowUpload] = useState(false); // Show only upload button after confirmation

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

  // Request permissions for camera and microphone
  useEffect(() => {
    if (!hasPermission) requestPermission();
    if (!microphonePermission) requestMicrophonePermission();
  }, [hasPermission, microphonePermission]);

  // Capture a photo
  const onTakePicture = async () => {
    if (isRecording) {
      camera.current?.stopRecording(); // Stop recording if ongoing
      return;
    }
    const photo = await camera.current?.takePhoto({ flash });
    setPhoto(photo);
    setShowUpload(false); // Reset upload state
  };

  // Start video recording
  const onStartRecording = async () => {
    if (!camera.current) return; // Ensure camera is ready
    setIsRecording(true); // Set recording state to true

    camera.current.startRecording({
      onRecordingFinished: (video) => {
        setVideo(video); // Save recorded video
        setIsRecording(false); // Reset recording state
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false); // Reset on error
      }
    });
  };

  // Upload function for photo or video
  const uploadMedia = async () => {
    if(!photo && !video) return;
    if (photo || video) {
      const mediaPath = photo ? photo.path : video?.path;
      if (!mediaPath) return;
      const result = await fetch(`file://${mediaPath}`);
      const data = await result.blob();
      console.log(data); // Media blob logged
      // Implement upload to storage (e.g., Supabase)
    }
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
  if (!hasPermission || !microphonePermission) return <ActivityIndicator />;
  if (!device) return <Text>Camera device not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        ref={camera}
        style={styles.container}
        device={device}
        isActive={isActive && !photo && !video}
        photo
        video
        audio
      />

      {photo || video ? (
        <>
          {photo ? (
            <Image style={styles.photo} source={{ uri: 'file://' + photo.path }} />
          ) : (
            // Optional: Video component for video preview
            <>
            <Video
              style={styles.photo}
              source={{ uri: 'file://' + video?.path }}
              useNativeControls
              isLooping
            />
            <Text style={styles.videoPreviewText}>Video Preview Not Available: {video?.path as string}</Text>
            </>
          )}

          {!showUpload ? (
            <View style={styles.buttonContainer}>
              {/* Confirm Button */}
              <Pressable onPress={() => setShowUpload(true)} style={styles.confirmButton}>
                <FontAwesome name="check" size={24} color="black" />
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>

              {/* Retake Button */}
              <Pressable onPress={() => {
                setPhoto(undefined);
                setVideo(undefined);
              }} style={styles.retakeButton}>
                <FontAwesome name="repeat" size={24} color="black" />
                <Text style={styles.buttonText}>Retake</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.footer}>
              {/* Upload Button */}
              <Pressable onPress={uploadMedia} style={styles.uploadButton}>
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
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLongPress={onStartRecording} // Start video recording on long press
                style={[styles.innerCircle, isRecording && styles.recordingButton]} // Red color when recording
              />
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
  videoPreviewText: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
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
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    fontSize: 16,
    marginLeft: 5,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  outerRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'red',
  },
});

export default CameraScreen;
