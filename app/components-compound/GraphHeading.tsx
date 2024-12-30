import React, { useState } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native"
import { Icon, Text } from "app/components"
import { colors } from "app/theme" // Assuming this is where your Text component is

interface GraphHeadingProps {
  title: string;
  tooltip: string;
}

const GraphHeading = ({ title, tooltip }: GraphHeadingProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={$headingContainer}>
      <Text>{title}</Text>
      <TouchableOpacity
        onPress={() => setShowTooltip(!showTooltip)}
        style={$infoButton}
      >
        <Icon icon='info' color={colors.palette.neutral800}/>
      </TouchableOpacity>
      {showTooltip && (
        <View style={$tooltip}>
          <Text style={$tooltipText}>{tooltip}</Text>
        </View>
      )}
    </View>
  );
};

const $headingContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
  position: "relative" as const,
  justifyContent: "space-between",
};

const $infoButton = {
  marginLeft: 8,
  padding: 4,
};

const $tooltip: ViewStyle = {
  position: "absolute" as const,
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#333333",
  padding: 8,
  borderRadius: 4,
  marginTop: 4,
  zIndex: 1,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const $tooltipText = {
  color: "#FFFFFF",
  fontSize: 12,
};

export default GraphHeading;