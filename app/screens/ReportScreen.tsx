import React, { FC, useEffect, useState } from "react"
import { ViewStyle, TextStyle, View, ImageStyle, ScrollView } from "react-native"
import { values } from "mobx";
import { Button, Icon, Screen, Text } from "../components"
import { spacing } from "../theme"
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { delay } from "app/utils/delay"
import { FullscreenViewer } from "app/components-business/FullscreenViewer"
import { BoundingBox } from "app/models/BoundingBox"
import { Inlier, NumberReport } from "app/models/Report"
import { Loading } from "app/components-compound/Loading"
import CategoryBarChart from "app/components-business/CategoryBarChart"
import StackedBarChart from "app/components-business/StackedBarChart"
import GraphHeading from "app/components-compound/GraphHeading"

interface ReportScreenProps extends AppStackScreenProps<"Report"> {}

export const ReportScreen: FC<ReportScreenProps> = observer(function ReportScreen(_props) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const { navigation } = _props
  const { scanStore } = useStores()

  function handleBack() {
    navigation.goBack()
  }

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await Promise.all([scanStore.fetchReport(), delay(550)])
      setIsLoading(false)
    })()
  }, [scanStore])

  function renderStatistics() {
    const report = scanStore.numberReport
    if (!report) return null

    return (
      <View style={$statsContainer}>
        <View style={$statBox}>
          <Text style={$statValue}>{report.total_books}</Text>
          <Text style={$statLabel}>Total Books</Text>
        </View>
        <View style={$statBox}>
          <Text style={$statValue}>{report.outliers_count}</Text>
          <Text style={$statLabel}>Outliers</Text>
        </View>
        <View style={$statBox}>
          <Text style={$statValue}>{report.inliers_count}</Text>
          <Text style={$statLabel}>Inliers</Text>
        </View>
        <View style={$statBox}>
          <Text style={$statValue}>{(report.misplacement_rate * 100).toFixed(1)}%</Text>
          <Text style={$statLabel}>Misplacement Rate</Text>
        </View>
      </View>
    )
  }

  function renderBookDetails() {
    const report = scanStore.numberReport
    if (!report) return null

    return (
      <View style={$detailsContainer}>
        <Text preset="subheading">Book Details</Text>
        {report.inliers && Object.entries(values(report.inliers)).map(([category, books]) => {
          const typedBooks = books as Inlier[];
          return (
            <View key={category} style={$categoryContainer}>
              <Text style={$categoryTitle}>Category {parseInt(category) + 1}</Text>
              {typedBooks.map((book, index: number) => (
                <View key={index} style={$bookItem}>
                  <Text style={$bookTitle}>{book.current_calculated_title}</Text>
                </View>
              ))}
            </View>
          );
        })}

        {report.outliers && report.outliers.length > 0 && (
          <View style={$categoryContainer}>
            <Text style={$categoryTitle}>Outliers</Text>
            {report.outliers.map((book, index) => (
              <View key={index} style={$bookItem}>
                <Text style={$bookTitle}>{book.current_calculated_title}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  function renderImageSection() {
    if (!scanStore.lastImage) return null

    const boundingBoxes = [
      ...scanStore.outlierAndInlier.outliers,
      ...scanStore.outlierAndInlier.inliers,
    ] as BoundingBox[];

    return (
      <View style={$imageContainer}>
        <Text preset="subheading">Scan Results</Text>
        <Button
          text="View Details"
          onPress={() => setShowViewer(true)}
          style={$viewButton}
        />
        <FullscreenViewer
          visible={showViewer}
          onClose={() => setShowViewer(false)}
          imageUri={scanStore.lastImage}
          boundingBoxes={boundingBoxes}
          originalImageWidth={scanStore.lastImageDimensions?.width || 0}
          originalImageHeight={scanStore.lastImageDimensions?.height || 0}
        />
      </View>
    )
  }

  function renderGraphs(){
    const report = scanStore.numberReport
    if (!report) return null
    return (
      <View style={$graphContainer}>
        <Text preset="subheading">Graphical Representation</Text>
        <GraphHeading
          title="Inlier by Categories"
          tooltip="This bar chart shows the distribution of inliers across different categories. Each bar represents the count of items correctly identified within each category."
        />
        <CategoryBarChart report={scanStore.numberReport as NumberReport} />
        <GraphHeading
          title="Misplacement Rate"
          tooltip="This stacked bar shows the percentage of correctly placed items (green) versus misplaced items (orange). The misplacement rate indicates how many items were found in unexpected locations."
        />
        <StackedBarChart misplacementRate={report.misplacement_rate} />
      </View>
    );
  }

  function renderReport() {
    return (
      <ScrollView style={$mainContainer}>
        {renderStatistics()}
        {renderImageSection()}
        {renderGraphs()}
        {renderBookDetails()}
      </ScrollView>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["bottom"]}>
      <Text preset="heading" tx="reportScreen.title" style={$title} />
      {isLoading ? <Loading /> : (
        renderReport()
      )}
      <View style={$bottomBarNavigation}>
        <Button
          preset="default"
          LeftAccessory={(props) => (
            <Icon containerStyle={props.style} style={$iconStyle} icon="back" />
          )}
          onPress={handleBack}
          tx="common.back"
        />
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $mainContainer: ViewStyle = {
  flex: 1,
}

const $statsContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: spacing.lg,
}

const $statBox: ViewStyle = {
  width: "48%",
  backgroundColor: "#f5f5f5",
  padding: spacing.md,
  borderRadius: 8,
  marginBottom: spacing.sm,
}

const $statValue: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: spacing.xs,
}

const $statLabel: TextStyle = {
  fontSize: 14,
  color: "#666",
}

const $detailsContainer: ViewStyle = {
  marginBottom: spacing.lg,
}

const $categoryContainer: ViewStyle = {
  marginBottom: spacing.lg,
}

const $categoryTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: spacing.sm,
}

const $bookItem: ViewStyle = {
  backgroundColor: "#f5f5f5",
  padding: spacing.sm,
  borderRadius: 6,
  marginBottom: spacing.xs,
}

const $bookTitle: TextStyle = {
  fontSize: 14,
}

const $imageContainer: ViewStyle = {
  marginBottom: spacing.lg,
}

const $graphContainer: ViewStyle = {
  marginBottom: spacing.lg,
}

const $viewButton: ViewStyle = {
  marginBottom: spacing.md,
}

const $bottomBarNavigation: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.md,
}

const $iconStyle: ImageStyle = {
  width: 24,
  height: 24,
}