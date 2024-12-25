import React, { useState } from 'react';
import { View, Image, LayoutChangeEvent } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Instance } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import { BoundingBoxModel } from 'app/models/BoundingBox';

interface ImageLayout {
  width: number;
  height: number;
}

interface ScaledBoundingBoxesProps {
  imageUri: string;
  boundingBoxes: Instance<typeof BoundingBoxModel>[];
  originalImageWidth: number;
  originalImageHeight: number;
  containerHeight?: number;
}

export const ScaledBoundingBoxes: React.FC<ScaledBoundingBoxesProps> = observer(({
                                                                                   imageUri,
                                                                                   boundingBoxes,
                                                                                   originalImageWidth,
                                                                                   originalImageHeight,
                                                                                   containerHeight = 300
                                                                                 }) => {
  const [imageLayout, setImageLayout] = useState<ImageLayout>({
    width: 0,
    height: 0,
  });

  const calculateScaledCoordinates = (box: Instance<typeof BoundingBoxModel>) => {
    if (!imageLayout.width || !imageLayout.height) return null;

    const [x1, y1, x2, y2] = box.bounding_box;

    // Calculate scale factors
    const scaleX = imageLayout.width / originalImageWidth;
    const scaleY = imageLayout.height / originalImageHeight;

    return {
      x: x1 * scaleX,
      y: y1 * scaleY,
      width: (x2 - x1) * scaleX,
      height: (y2 - y1) * scaleY
    };
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageLayout({ width, height });
  };

  if (!imageUri) return null;

  return (
    <View style={{ position: 'relative' }}>
      <Image
        source={{ uri: imageUri }}
        style={{ width: '100%', height: containerHeight, resizeMode: 'contain' }}
        onLayout={handleLayout}
      />

      <Svg
        width="100%"
        height={containerHeight}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {boundingBoxes.map((box, index) => {
          const scaledCoords = calculateScaledCoordinates(box);
          if (!scaledCoords) return null;

          return (
            <Rect
              key={index}
              x={scaledCoords.x}
              y={scaledCoords.y}
              width={scaledCoords.width}
              height={scaledCoords.height}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          );
        })}
      </Svg>
    </View>
  );
});

export default ScaledBoundingBoxes;