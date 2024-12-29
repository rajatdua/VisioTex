import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const BoundingBoxModel = types
  .model("BoundingBox")
  .props({
    bounding_box: types.array(types.integer),
    confidence: types.float,
    vertices: types.maybe(types.array(types.string)),
    isOutlier: types.maybe(types.boolean),
    group: types.maybe(types.number),
    title: types.maybe(types.string),
  })
export interface BoundingBox extends Instance<typeof BoundingBoxModel> {}

export interface BoundingBoxSnapshotIn extends SnapshotIn<typeof BoundingBoxModel> {}
