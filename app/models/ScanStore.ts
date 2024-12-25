import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { detectApi } from "app/services/api/DetectService"
import { BoundingBoxModel } from "app/models/BoundingBox"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"

export const ImageInfoModel = types.model("ImageInfo").props({
  uri: types.string,
  width: types.maybe(types.number),
  height: types.maybe(types.number)
});

export const ScanStoreModel = types
  .model("ScanStore")
  .props({
    imageUriArray: types.array(ImageInfoModel),
    // imageUriArray: types.array(types.string),
    currentSpineRegions: types.array(BoundingBoxModel),
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
