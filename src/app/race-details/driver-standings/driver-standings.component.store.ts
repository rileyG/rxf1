import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import { DriverStanding, DriverStandingsResponse } from "../race-details.types";

@Injectable()
export class DriverStandingsComponentStore extends RaceDetailsDataSourceStore<DriverStanding, DriverStandingsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    protected override getApiQuery({ season, round, limit, offset }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<DriverStandingsResponse>> {
        return this.raceDetailsApiService.getRaceDriverStandings(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<DriverStandingsResponse>): DriverStanding[] {
        return response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }
}