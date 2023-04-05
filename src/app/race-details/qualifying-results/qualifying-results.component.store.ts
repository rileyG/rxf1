import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import { QualifyingResult, QualifyingResultsResponse } from "../race-details.types";

@Injectable()
export class QualifyingResultsComponentStore extends RaceDetailsDataSourceStore<QualifyingResult, QualifyingResultsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    protected override getApiQuery({ season, round, limit, offset }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<QualifyingResultsResponse>> {
        return this.raceDetailsApiService.getRaceQualifyingResults(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<QualifyingResultsResponse>): QualifyingResult[] {
        return response.MRData.RaceTable.Races[0].QualifyingResults;
    }
}