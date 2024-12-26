import { GeneralApiProblem, getGeneralApiProblem } from "app/services/api/apiProblem"
import { ApiResponse } from "apisauce"
import { ApiReportResponse } from "app/services/api/api.types"
import { Api } from "app/services/api/api"
import { GoogleVision } from "app/models/GoogleVision"
import numberReport from "app/services/api/mock-responses/number-report"
import { NumberReportSnapshotIn } from "app/models/Report"


const REPORT_API_MOCK_RESPONSES = {
  getReport: { kind: "ok", number: numberReport, genre: null },
};

export class ReportService extends Api {
  async getReport(rawData: GoogleVision[], categoryCount: number|undefined): Promise<{ kind: "ok"; number: NumberReportSnapshotIn, genre: null } | GeneralApiProblem> {
    return this.handleRequest(REPORT_API_MOCK_RESPONSES, "getReport", async () => {

      const data = {
        report_type: 'all',
        category_count: categoryCount ?? 1,
        horizontal_epsilon: 50,
        vertical_spacing_factor: 1.5,
        raw_detected_text_data: rawData,
      }

      // make the api call
      const response: ApiResponse<ApiReportResponse> = await this.apisauce.post(
        `/report/generate-by-type-for-single`,
        data,
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
        const numberReport: NumberReportSnapshotIn = rawData?.number as NumberReportSnapshotIn;
        return { kind: "ok", number: numberReport, genre: null }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    }, false);
  }
}

export const reportApi = new ReportService()