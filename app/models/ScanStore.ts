import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const ScanStoreModel = types
  .model("ScanStore")
  .props({
    imageUriArray: types.array(types.string),
  })
  .views((store) => ({
    get hasImages() {
      return store.imageUriArray.length > 0
    },
    get lastImage(){
      return store.imageUriArray[store.imageUriArray.length - 1] ?? null;
    },
    get imageCount() {
      return store.imageUriArray.length;
    }
  }))
  .actions((store) => ({
    pushImage(image: string) {
      store.imageUriArray.push(image);
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
