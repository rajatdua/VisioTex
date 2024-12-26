import React, { useEffect } from 'react';
import { Modal, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { Icon } from "app/components"
import { colors } from "app/theme"

interface BoundingBox {
  bounding_box: number[];
  vertices?: string[];
  isOutlier?: boolean;
}

interface FullscreenViewerProps {
  visible: boolean;
  onClose: () => void;
  imageUri: string;
  boundingBoxes: BoundingBox[];
  originalImageWidth: number;
  originalImageHeight: number;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
                                                                    visible,
                                                                    onClose,
                                                                    imageUri,
                                                                    boundingBoxes,
                                                                    originalImageWidth,
                                                                    originalImageHeight,
                                                                  }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Reset values when modal closes
  useEffect(() => {
    if (!visible) {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  }, [visible]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Calculate image dimensions maintaining aspect ratio
  const imageAspectRatio = originalImageWidth / originalImageHeight;
  const screenAspectRatio = screenWidth / screenHeight;

  let displayWidth: number;
  let displayHeight: number;

  if (imageAspectRatio > screenAspectRatio) {
    displayWidth = screenWidth;
    displayHeight = screenWidth / imageAspectRatio;
  } else {
    displayHeight = screenHeight;
    displayWidth = screenHeight * imageAspectRatio;
  }

  const snapToNormalScale = () => {
    if (scale.value < 1) {
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  };

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, 0.5), 5); // Limit scale between 0.5 and 5
    })
    .onEnd(() => {
      runOnJS(snapToNormalScale)();
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateX = savedTranslateX.value + event.translationX;
      const newTranslateY = savedTranslateY.value + event.translationY;

      // Calculate bounds based on current scale
      const maxTranslateX = (displayWidth * scale.value - displayWidth) / 2;
      const maxTranslateY = (displayHeight * scale.value - displayHeight) / 2;

      translateX.value = Math.min(Math.max(newTranslateX, -maxTranslateX), maxTranslateX);
      translateY.value = Math.min(Math.max(newTranslateY, -maxTranslateY), maxTranslateY);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const combinedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // const calculateScaledCoordinates = (box: Instance<typeof BoundingBoxModel>) => {
  //   const [x1, y1, x2, y2] = box.bounding_box;
  //
  //   // Scale coordinates based on displayed image dimensions
  //   const scaleX = displayWidth / originalImageWidth;
  //   const scaleY = displayHeight / originalImageHeight;
  //
  //   return {
  //     x: x1 * scaleX,
  //     y: y1 * scaleY,
  //     width: (x2 - x1) * scaleX,
  //     height: (y2 - y1) * scaleY,
  //   };
  // };

  const calculateScaledCoordinates = (box: BoundingBox) => {
    const scaleX = displayWidth / originalImageWidth;
    const scaleY = displayHeight / originalImageHeight;
    if (box.bounding_box) {
      const [x1, y1, x2, y2] = box.bounding_box;
      return {
        x: x1 * scaleX,
        y: y1 * scaleY,
        width: (x2 - x1) * scaleX,
        height: (y2 - y1) * scaleY,
      };
    }

    if (box.vertices) {
      const coords = box.vertices.map(v => {
        const [x, y] = v.replace(/[()]/g, '').split(',').map(Number);
        return { x: x * scaleX, y: y * scaleY };
      });

      const minX = Math.min(...coords.map(c => c.x));
      const minY = Math.min(...coords.map(c => c.y));
      const maxX = Math.max(...coords.map(c => c.x));
      const maxY = Math.max(...coords.map(c => c.y));

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    return null;
  };

  if (!imageUri) return null;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { width: displayWidth, height: displayHeight }]}
            resizeMode="contain"
          />
          <Svg
            width={displayWidth}
            height={displayHeight}
            style={[styles.svgOverlay, { width: displayWidth, height: displayHeight }]}
          >
            {boundingBoxes.map((box, index) => {
              const scaledCoords = calculateScaledCoordinates(box);
              if (scaledCoords == null) return;
              return (
                <Rect
                  key={index}
                  x={scaledCoords.x}
                  y={scaledCoords.y}
                  width={scaledCoords.width}
                  height={scaledCoords.height}
                  stroke={box.isOutlier === undefined ? "red" : box.isOutlier ? "#E66100" : "#5D3A9B"}
                  strokeWidth="1"
                  fill="none"
                />
              );
            })}
          </Svg>
        </Animated.View>
      </GestureDetector>

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Icon icon="x" color={colors.palette.primary100} size={30} />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
  svgOverlay: {
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});