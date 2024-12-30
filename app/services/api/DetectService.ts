import { GeneralApiProblem, getGeneralApiProblem } from "app/services/api/apiProblem"
import { ApiResponse } from "apisauce"
import { ApiDetectResponse, ApiGoogleVisionResponse } from "app/services/api/api.types"
import { BoundingBoxSnapshotIn } from "app/models/BoundingBox"
import { Api } from "app/services/api/api"
import * as FileSystem from 'expo-file-system';
// import { randomUUID } from 'expo-crypto';
import bb from './mock-responses/bb';
import googleVision from './mock-responses/google-vision';
import { ExecutionType, GoogleVisionSnapshotIn } from "app/models/GoogleVision"


const DETECT_API_MOCK_RESPONSES = {
  getBoundingBoxes: {
    kind: "ok",
    spine_regions: bb,
  },
  getGoogleVisionAPI: { kind: "ok", books: googleVision, executionType: 'text' },
};

export class DetectService extends Api {
  async getBoundingBoxes(imageUri: string): Promise<{ kind: "ok"; spine_regions: BoundingBoxSnapshotIn[] } | GeneralApiProblem> {
    return this.handleRequest(DETECT_API_MOCK_RESPONSES, "getBoundingBoxes", async () => {
      // const data = new FormData()
      const fileUri = imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`;
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // data.append('file', {
      //   uri: fileUri,
      //   name: `image-${randomUUID()}.jpg`,
      //   type: 'image/jpeg',
      // } as any);
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (!fileExists) {
        if (__DEV__) {
          console.error(`Bad data: ${fileUri}`)
        }
        return { kind: "bad-data" }
      }

      // make the api call
      const response: ApiResponse<ApiDetectResponse> = await this.apisauce.post(
        `/detect/bb`,
        { image_base64: fileBase64 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        }
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawData = response.data

        // This is where we transform the data into the shape we expect for our MST model.
        const spineRegions: BoundingBoxSnapshotIn[] =
          rawData?.spine_regions.map((raw: any) => ({
            ...raw,
          })) ?? []

        return { kind: "ok", spine_regions: spineRegions }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    });
  }
  async getGoogleVisionAPI(imageUri: string, executionType: ExecutionType): Promise<{ kind: "ok"; books: GoogleVisionSnapshotIn[], executionType: ExecutionType } | GeneralApiProblem> {
    return this.handleRequest(DETECT_API_MOCK_RESPONSES, "getGoogleVisionAPI", async () => {
      // const data = new FormData()
      const fileUri = imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`;
      // data.append('file', {
      //   uri: fileUri,
      //   name: `image-${randomUUID()}.jpg`,
      //   type: 'image/jpeg',
      // } as any);
      // data.append('execution_type', executionType);
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (!fileExists) {
        if (__DEV__) {
          console.error(`Bad data: ${fileUri}`)
        }
        return { kind: "bad-data" }
      }

      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // make the api call
      const response: ApiResponse<ApiGoogleVisionResponse> = await this.apisauce.post(
        `/detect/books-v2`,
        { image_base64: fileBase64, execution_type: executionType },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        }
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawData = response.data
        // This is where we transform the data into the shape we expect for our MST model.
        const books: GoogleVisionSnapshotIn[] =
          rawData?.books.map((raw: any) => ({
            ...raw,
          })) ?? []

        return { kind: "ok", books, executionType }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    });
  }
}

export const detectApi = new DetectService()