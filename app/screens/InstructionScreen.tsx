import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { isRTL } from "../i18n"

export const InstructionScreen: FC<DemoTabScreenProps<"Instruction">> =
  function InstructionScreen(_props) {
  const { navigation } = _props;
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="instructionScreen.title" style={$title} />
        <Text tx="instructionScreen.tagLine" style={$tagline} />

        <Text preset="subheading" tx="instructionScreen.description" />
        <Text tx="instructionScreen.theFirstStep" style={$description} />
        <ListItem
          tx="instructionScreen.proceedToScan"
          leftIcon="scan"
          rightIcon={isRTL ? "caretLeft" : "caretRight"}
          onPress={() => navigation.navigate('Scan')}
        />
        <Text
          preset="subheading"
          tx="instructionScreen.whatToExpect"
          style={$sectionTitle}
        />
        <Text tx="instructionScreen.expectation" style={$description} />

        <Text
          preset="subheading"
          tx="instructionScreen.theLatestUpdate"
          style={$sectionTitle}
        />
        <Text tx="instructionScreen.theLatestUpdateDescription" style={$description} />
      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}