import React, { FC, useRef, useState } from "react"
import { ImageStyle, TouchableOpacity, View, ViewStyle, Image, Alert, TextStyle } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing, typography } from "../theme"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import * as ImagePicker from "expo-image-picker";
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"

export const ScanScreen: FC<DemoTabScreenProps<"Scan">> =
  observer(function ScanScreen(_props) {
    const { navigation } = _props;
    const { scanStore: { imageCount, lastImage, hasImages, popImage, pushImage, clearScannedImages }} = useStores()
    const [facing, setFacing] = useState<CameraType>('back');
    const [continueTakingPicture, setContinueTakingPicture] = useState<boolean>(!hasImages);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    if (hasImages && continueTakingPicture) {
      Alert.alert('Continue from previous images?', 'You can use your current progress', [
        {
          text: 'No',
          onPress: () => clearScannedImages(),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => console.log('OK Pressed')},
      ])
    }
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
          <Text>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} text="grant permission" />
        </Screen>
      );
    }

    function toggleCameraFacing() {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takeImage() {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo !== undefined) {
          pushImage(photo.uri);
          setContinueTakingPicture(false);
        }
      }
    }

    async function uploadImage() {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        exif: false,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        pushImage(result.assets[0].uri);
        setContinueTakingPicture(false);
      }
    }

    function deleteImage() {
      if (!hasImages) setContinueTakingPicture(true);
      else popImage();
    }

    function handleTakeMoreImages() {
      setContinueTakingPicture(true);
    }

    function handleToPreStage(){
      navigation.navigate("PreStage");
    }


    return (
      <Screen preset="scroll" contentContainerStyle={$container}>
        {!hasImages || continueTakingPicture ? (
          <CameraView ref={cameraRef} style={$cameraView} facing={facing}>
            <View style={$fixedTopContainer}>
              <TouchableOpacity style={$circularButtonStyle} onPress={toggleCameraFacing}>
                <Icon icon="flip" size={30} />
              </TouchableOpacity>
            </View>
            <View style={$fixedBottomContainer}>
              <TouchableOpacity style={$circularButtonStyle} onPress={takeImage}>
                <Icon icon="circle" size={30} />
              </TouchableOpacity>
              <TouchableOpacity style={$circularButtonStyle} onPress={uploadImage}>
                <Icon icon="imageUpload" size={30} />
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : (
          <View style={$imagePreviewContainer}>
            <Image source={{ uri: lastImage ?? '' }} style={$imagePreview} />
            <View style={$fixedTopContainer}>
              <TouchableOpacity style={$circularButtonStyle} onPress={deleteImage}>
                <Icon icon="delete" size={30} />
              </TouchableOpacity>
            </View>
            <View style={$fixedBottomContainer}>
              <TouchableOpacity style={{ ...$circularButtonStyle, position: "relative" }} onPress={handleTakeMoreImages}>
                <Text style={$imageCountLabel}>{imageCount}</Text>
                <Icon icon="moreImage" size={30} />
              </TouchableOpacity>
              <TouchableOpacity style={$circularButtonStyle} onPress={handleToPreStage}>
                <Icon icon="caretRight" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </Screen>
    );
  })

const $container: ViewStyle = {
  flex: 1,
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $cameraView: ViewStyle = {
  flex: 1,
  justifyContent: "space-between"
}

const $imagePreviewContainer: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  position: "relative",
};

const $imagePreview: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "contain",
};

const $commonContainer: ViewStyle = {
  flexDirection: "row",
  position: "absolute",
  justifyContent: "space-between",
  left: spacing.sm,
  right: spacing.sm,
}

const $fixedTopContainer: ViewStyle = {
  ...$commonContainer,
  top: spacing.sm,
};

const $fixedBottomContainer: ViewStyle = {
  ...$commonContainer,
  bottom: spacing.sm,
}

const $imageCountLabel: TextStyle = {
  position: "absolute",
  top: -spacing.md,
  right: spacing.none,
  backgroundColor: colors.palette.primary300,
  padding: spacing.xxs,
  borderRadius: spacing.md,
  fontFamily: typography.primary.bold
};

const $circularButtonStyle: ViewStyle= {
  backgroundColor: colors.background,
  borderRadius: spacing.xxl,
  padding: spacing.sm,
}

