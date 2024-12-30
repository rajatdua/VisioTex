import { Text } from "app/components"
import React, { useEffect, useRef } from "react"
import { Animated, TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"

export function Loading() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value is 0

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 250, // Animation duration in ms
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    return () => {
      // Fade-out animation when unmounting
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully invisible
        duration: 250, // Animation duration in ms
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, $loadingContainer]}>
      <Text tx="common.loading" style={$loadingText} />
      <View style={$loadingBackground} />
    </Animated.View>
  );
}

const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
};

const $loadingBackground: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  backgroundColor: colors.background,
  opacity: 0.2,
};

const $loadingText: TextStyle = {
  backgroundColor: colors.background,
  padding: spacing.sm,
  borderRadius: spacing.lg,
};
