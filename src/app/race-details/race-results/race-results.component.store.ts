import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import { RaceResult, RaceResultsResponse } from "../race-details.types";

@Injectable()
export class RaceResultsComponentStore extends RaceDetailsDataSourceStore<RaceResult, RaceResultsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    protected override getApiQuery({ limit, offset, round, season }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<RaceResultsResponse>> {
        return this.raceDetailsApiService.getRaceResults(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<RaceResultsResponse>): RaceResult[] {
        return response.MRData.RaceTable.Races[0].Results;
    }
}