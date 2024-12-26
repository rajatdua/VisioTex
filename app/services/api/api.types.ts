/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface SpineRegion {
  bounding_box: number[],
  confidence: number,
}

export interface ApiDetectResponse {
  spine_regions: SpineRegion[],
}

export interface GoogleVisionBooks {
  description: string,
  vertices: string[]
}

export interface ApiGoogleVisionResponse {
  books: GoogleVisionBooks[]
}

// Box structure used in metadata
export interface IBox {
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
  center_x: number;
  center_y: number;
  height: number;
}

// Metadata item (individual entry in current_title_metadata)
export interface IMetadataItem {
  box: IBox;
}

// Metadata (collection of items keyed by string)
export interface IMetadata {
  [key: string]: IMetadataItem;
}

// Raw item (individual entry in current_title_raw)
export interface IRawItem {
  description: string;
  vertices: string[]; // List of vertices as strings
}

// Raw data (collection of raw items keyed by string)
export interface IRawData {
  [key: string]: IRawItem;
}

// Outlier structure
export interface IOutlier {
  group_number: number;
  current_calculated_title: string;
  current_title_metadata: IMetadata;
  current_title_raw: IRawData;
}

// Inlier entry structure (used for each inlier)
export interface IInlierEntry {
  group_number: number;
  current_calculated_title: string;
  current_title_metadata: IMetadata;
  current_title_raw: IRawData;
  bounding_box: number[];
}

// Inliers structure (keyed by dominant numbers, each entry is an array of IInlierEntry)
export interface IInliers {
  [key: string]: IInlierEntry[];
}

// Number report structure
export interface NumberReport {
  total_books: number;
  outliers_count: number;
  inliers_count: number;
  dominant_number: string[]; // List of dominant numbers as strings
  category_count: number;
  outliers: IOutlier[]; // Array of outliers
  inliers: IInliers; // Map of inliers keyed by dominant numbers
  misplacement_rate: number;
}

// API response structure
export interface ApiReportResponse {
  number: NumberReport;
  genre: null;
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
