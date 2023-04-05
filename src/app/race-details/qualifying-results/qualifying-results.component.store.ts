import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import type { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import type { QualifyingResult, QualifyingResultsResponse } from "../race-details.types";

/**
 * Component store for loading the qualifying results for a given race, and preparing a suitable data source for a material table.
 */
@Injectable()
export class QualifyingResultsComponentStore extends RaceDetailsDataSourceStore<QualifyingResult, QualifyingResultsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    /**
     * Helper function for creating the API query to load the qualifying results data.
     */
    protected override getApiQuery({ season, round, limit, offset }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<QualifyingResultsResponse>> {
        return this.raceDetailsApiService.getRaceQualifyingResults(season, round, limit, offset);
    }

    /**
     * Helper function for extracting the qualifying results data from the API response.
     */
    protected override getDataFromApiResponse(response: ErgastApiResponse<QualifyingResultsResponse>): QualifyingResult[] {
        return response.MRData.RaceTable.Races[0].QualifyingResults;
    }
}