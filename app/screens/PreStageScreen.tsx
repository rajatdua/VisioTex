import React, { FC } from "react"
import { ImageStyle, ViewStyle, Image, View, TouchableOpacity } from "react-native"
import { Button, Icon, Screen } from "../components"
import { colors, spacing } from "../theme"
import PagerView from 'react-native-pager-view';
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"

interface PreStageScreenProps extends AppStackScreenProps<"PreStage"> {}
export const PreStageScreen: FC<PreStageScreenProps> =
  observer(function PreStageScreen(_props) {
    const { navigation } = _props;
    const { scanStore} = useStores()

    function handleBack(){
      navigation.goBack();
    }

    function proceedToBoundingBoxes(){
      navigation.navigate('Login');
    }

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["bottom"]}>
        <View style={$topBarNavigation}>
          <Button
            preset="default"
            LeftAccessory={(props) => (
              <Icon containerStyle={props.style} style={$iconStyle} icon="back" />
            )}
            onPress={handleBack}
            tx='common.back'
          />
        </View>
        <PagerView style={$imageCarousel} initialPage={0}>
          {scanStore.imageUriArray.map((imageUri, idx) => {
            return <Image key={idx + 1} source={{ uri: imageUri }} style={$imageThumbnail} />;
          })}
          <TouchableOpacity style={$buttons} onPress={proceedToBoundingBoxes}>
            <Icon icon="circle" size={30} />
          </TouchableOpacity>
        </PagerView>
      </Screen>
    );
  })

const $container: ViewStyle = {
  flex: 1,
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}
const $topBarNavigation: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-start",
  marginBottom: spacing.md
};

const $imageThumbnail: ImageStyle = {};

const $imageCarousel: ViewStyle = {
  flex: 1,
  width: '100%',
};
const $iconStyle: ImageStyle = { width: 30, height: 30 }


const $buttons: ViewStyle = {
  alignItems: "center",
  backgroundColor: colors.background,
  padding: spacing.xs,
  borderRadius: spacing.lg,
}