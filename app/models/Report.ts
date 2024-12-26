import { Instance, SnapshotIn, types } from "mobx-state-tree"

// Box model for metadata
const BoxModel = types.model("Box", {
  min_x: types.number,
  max_x: types.number,
  min_y: types.number,
  max_y: types.number,
  center_x: types.number,
  center_y: types.number,
  height: types.number
});

// Metadata item model
const MetadataItemModel = types.model("MetadataItem", {
  box: BoxModel
});

// Title metadata model (key-value pairs where keys are strings)
const TitleMetadataModel = types.map(MetadataItemModel);

// Vertices model for raw data
const VerticesModel = types.array(types.string); // List of vertices as strings

// Raw item model
const RawItemModel = types.model("RawItem", {
  description: types.string,
  vertices: VerticesModel
});

// Title raw model (key-value pairs where keys are strings)
const TitleRawModel = types.map(RawItemModel);

// Outlier model
const OutlierModel = types.model("Outlier", {
  group_number: types.number,
  current_calculated_title: types.string,
  current_title_metadata: TitleMetadataModel,
  current_title_raw: TitleRawModel,
  bounding_box: types.array(types.integer)
});

// Inlier data model (for each inlier entry in the inliers)
const InlierEntryModel = types.model("InlierEntry", {
  group_number: types.number,
  current_calculated_title: types.string,
  current_title_metadata: TitleMetadataModel,
  current_title_raw: TitleRawModel,
  bounding_box: types.array(types.integer),
});

const InliersModel = types.map(types.array(InlierEntryModel));

export interface Inlier extends Instance<typeof InlierEntryModel> {}


export const NumberReportModel = types
  .model("NumberReport")
  .props({
    total_books: types.number,
    outliers_count: types.number,
    inliers_count: types.number,
    dominant_number: types.array(types.string), // List of dominant numbers as strings
    category_count: types.number,
    outliers: types.array(OutlierModel), // Array of outliers
    inliers: InliersModel, // Map of inliers keyed by dominant numbers
    misplacement_rate: types.number
  })
export interface NumberReport extends Instance<typeof NumberReportModel> {}

export interface NumberReportSnapshotIn extends SnapshotIn<typeof NumberReportModel> {}
