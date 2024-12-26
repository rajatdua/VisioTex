import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { detectApi } from "app/services/api/DetectService"
import { BoundingBox, BoundingBoxModel } from "app/models/BoundingBox"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { reportApi } from "app/services/api/ReportService"
import { ExecutionType, GoogleVisionModel } from "app/models/GoogleVision"
import { NumberReportModel } from "app/models/Report"
import { IInlierEntry } from "app/services/api"

export const ImageInfoModel = types.model("ImageInfo").props({
  uri: types.string,
  width: types.maybe(types.number),
  height: types.maybe(types.number)
});

export const ScanStoreModel = types
  .model("ScanStore")
  .props({
    imageUriArray: types.array(ImageInfoModel),
    currentSpineRegions: types.array(BoundingBoxModel),
    googleVisionAPI: types.array(GoogleVisionModel),
    currentCategoryCount: types.maybe(types.integer),
    numberReport: types.maybe(NumberReportModel)
  })
  .views((store) => ({
    get hasImages() {
      return store.imageUriArray.length > 0
    },
    get lastImage() {
      const last = store.imageUriArray[store.imageUriArray.length - 1];
      return last ? last.uri : null;
    },
    get lastImageDimensions() {
      const last = store.imageUriArray[store.imageUriArray.length - 1];
      return last ? { width: last.width, height: last.height } : null;
    },
    get imageCount() {
      return store.imageUriArray.length;
    },
    get outlierAndInlier() {
      if (!store.numberReport) return { outliers: [], inliers: [] }
      return {
        outliers: store.numberReport.outliers.map((outlier) => ({ isOutlier: true, bounding_box: outlier.bounding_box })) as BoundingBox[],
        inliers: Object.values(JSON.parse(JSON.stringify(store.numberReport.inliers)))
          .flatMap((group, index) => {
            const typedGroup = group as unknown as IInlierEntry[];
            return typedGroup.map((inlier) => ({ isOutlier: false, bounding_box: inlier.bounding_box, group: index }) as BoundingBox);
            }
          ),
      }
    }
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchBoundingBoxes() {
      const response = await detectApi.getBoundingBoxes(store.lastImage ?? '')
      if (response.kind === "ok") {
        const filtered = response.spine_regions.filter(region => region.confidence >= 0.8);
        const boundingBoxes = filtered.map((region) => {
          return BoundingBoxModel.create(region);
        });
        store.setProp("currentSpineRegions", boundingBoxes);
      } else {
        console.error(`Error fetching bounding boxes: ${JSON.stringify(response)}`)
      }
    },
    async fetchGoogleVisionAPI(executionType: ExecutionType = "text") {
      const response = await detectApi.getGoogleVisionAPI(store.lastImage ?? '', executionType)
      if (response.kind === "ok") {
        const books = response.books.slice(1).map((book) => {
          return GoogleVisionModel.create(book);
        });
        store.setProp("googleVisionAPI", books);
      } else {
        console.error(`Error fetching google vision ocr: ${JSON.stringify(response)}`)
      }
    },
    async fetchReport() {
      const response = await reportApi.getReport(store.googleVisionAPI, store.currentCategoryCount)
      if (response.kind === "ok") {
        store.setProp("numberReport", response.number);
      } else {
        console.error(`Error fetching report: ${JSON.stringify(response)}`)
      }
    },
    pushImage(uri: string, width?: number, height?: number) {
      store.imageUriArray.push({ uri, width, height });
    },
    popImage() {
      store.imageUriArray.pop();
    },
    clearScannedImages() {
      store.imageUriArray.clear();
    }
  }))

export interface ScanStore extends Instance<typeof ScanStoreModel> {}
export interface ScanStoreSnapshot extends SnapshotOut<typeof ScanStoreModel> {}
