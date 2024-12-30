import React, { FC } from "react"
import { ImageStyle, ViewStyle, Image, View, TextStyle } from "react-native"
import { Button, Icon, Screen, Text } from "../components"
import { spacing } from "../theme"
import PagerView from 'react-native-pager-view';
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { delay } from "app/utils/delay"
import ScaledBoundingBoxes from "app/components-business/ScaledBoundingBoxes"
import { FullscreenViewer } from "app/components-business/FullscreenViewer"
import { Loading } from "app/components-compound/Loading"

interface PreStageScreenProps extends AppStackScreenProps<"PreStage"> {}
export const PreStageScreen: FC<PreStageScreenProps> =
  observer(function PreStageScreen(_props) {
    const [isLoading, setIsLoading] = React.useState(false)
    const { navigation } = _props;
    const { scanStore} = useStores()
    const [showBoundingBoxes, setShowBoundingBoxes] = React.useState(false);
    const [fullscreenVisible, setFullscreenVisible] = React.useState(false);

    function handleBack(){
      navigation.goBack();
    }

    async function proceedToBoundingBoxes(){
      // if (scanStore.currentSpineRegions.length === 0) {
        setIsLoading(true);
        await Promise.all([scanStore.fetchBoundingBoxes(), delay(550)])
        setIsLoading(false);
      // }
      setShowBoundingBoxes(true);
    }

    async function proceedToReport(){
      setIsLoading(true);
      await Promise.all([scanStore.fetchGoogleVisionAPI(), delay(550)])
      setIsLoading(false);
      navigation.navigate("Report");
    }

    function renderMainView() {
      return (
        <>
          <PagerView style={$imageCarousel} initialPage={0} orientation='horizontal'>
            {scanStore.imageUriArray.map((imageUri, idx) => {
              return <Image key={idx + 1} source={{ uri: imageUri.uri }} style={$imageThumbnail} />;
            })}
          </PagerView>
          <Text tx="preStageScreen.scrollRightInstruction"/>
          <View style={$bottomBarNavigation}>
            <Button
              preset="default"
              LeftAccessory={(props) => (
                <Icon containerStyle={props.style} style={$iconStyle} icon="back" />
              )}
              onPress={handleBack}
              tx='common.back'
            />
            <Button
              preset="default"
              RightAccessory={(props) => (
                <Icon containerStyle={props.style} style={$iconStyle} icon="caretRight" />
              )}
              onPress={proceedToBoundingBoxes}
              tx='common.proceed'
            />
          </View>
        </>
      )
    }

    function renderBoundingBoxesView(){
      return (
        <>
          <View style={$imageCarousel}>
            <ScaledBoundingBoxes
              imageUri={scanStore.lastImage ?? ''}
              boundingBoxes={scanStore.currentSpineRegions}
              originalImageWidth={scanStore.lastImageDimensions?.width ?? 0}
              originalImageHeight={scanStore.lastImageDimensions?.height ?? 0}
            />
            <Text tx='preStageScreen.disclaimer'/>
          </View>
          <Button
            preset="default"
            LeftAccessory={(props) => (
              <Icon containerStyle={props.style} style={$iconStyle} icon="expand" />
            )}
            onPress={() => setFullscreenVisible(true)}
            tx='common.fullScreen'
          />
          {/* Fullscreen Viewer */}
          <FullscreenViewer
            visible={fullscreenVisible}
            onClose={() => setFullscreenVisible(false)}
            imageUri={scanStore.lastImage ?? ''}
            boundingBoxes={scanStore.currentSpineRegions}
            originalImageWidth={scanStore.lastImageDimensions?.width ?? 0}
            originalImageHeight={scanStore.lastImageDimensions?.height ?? 0}
          />
          <View style={$bottomBarNavigation}>
            <Button
              preset="default"
              LeftAccessory={(props) => (
                <Icon containerStyle={props.style} style={$iconStyle} icon="caretLeft" />
              )}
              onPress={() => setShowBoundingBoxes(false)}
              tx='common.back'
            />
            <Button
              preset="default"
              RightAccessory={(props) => (
                <Icon containerStyle={props.style} style={$iconStyle} icon="caretRight" />
              )}
              onPress={proceedToReport}
              tx='preStageScreen.report'
            />
          </View>
        </>
      );
    }

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["bottom"]}>
        <Text preset="heading" tx="preStageScreen.title" style={$title} />
        <Text tx="preStageScreen.subtitle" style={$subtitle} />
        {isLoading ? <Loading/> : null}
        {showBoundingBoxes ? renderBoundingBoxesView() : renderMainView()}
      </Screen>
    );
  })

const $container: ViewStyle = {
  flex: 1,
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}
const $title: TextStyle = {
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
}
const $subtitle: TextStyle = {
  marginBottom: spacing.sm,
}
const $bottomBarNavigation: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.md
};

const $imageThumbnail: ImageStyle = {
  resizeMode: "contain"
};

const $imageCarousel: ViewStyle = {
  flex: 1,
  width: '100%',
  justifyContent: 'center'
};
const $iconStyle: ImageStyle = { width: 24, height: 24 }