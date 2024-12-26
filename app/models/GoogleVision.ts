import { Instance, SnapshotIn, types } from "mobx-state-tree"

export type ExecutionType = 'text' | 'dense_text';

export const GoogleVisionModel = types
  .model("GoogleVision")
  .props({
    description: types.string,
    vertices: types.array(types.string),
  })
export interface GoogleVision extends Instance<typeof GoogleVisionModel> {}

export interface GoogleVisionSnapshotIn extends SnapshotIn<typeof GoogleVisionModel> {}
