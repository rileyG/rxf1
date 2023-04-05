import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import type { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import type { RaceResult, RaceResultsResponse } from "../race-details.types";

/**
 * Component store for loading the results for a given round.
 */
@Injectable()
export class RaceResultsComponentStore extends RaceDetailsDataSourceStore<RaceResult, RaceResultsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    /**
     * Helper function for creating the API query to laod a portion of the race results.
     */
    protected override getApiQuery({ limit, offset, round, season }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<RaceResultsResponse>> {
        return this.raceDetailsApiService.getRaceResults(season, round, limit, offset);
    }

    /**
     * Helper function for extracting the results data from the API response.
     */
    protected override getDataFromApiResponse(response: ErgastApiResponse<RaceResultsResponse>): RaceResult[] {
        return response.MRData.RaceTable.Races[0].Results;
    }
}