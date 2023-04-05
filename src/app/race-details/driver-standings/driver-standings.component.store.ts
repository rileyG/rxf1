import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { ErgastApiResponse } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceDetailsDataSourceApiVariables, RaceDetailsDataSourceStore } from "../race-details-data-source.store";
import type { DriverStanding, DriverStandingsResponse } from "../race-details.types";

/**
 * Component store for loading the driver standings for a race, and preparing the results as a suitable data source for a material table.
 */
@Injectable()
export class DriverStandingsComponentStore extends RaceDetailsDataSourceStore<DriverStanding, DriverStandingsResponse> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    /**
     * Helper function for creating the API query to get a portion of the drivers standings for a race.
     */
    protected override getApiQuery({ season, round, limit, offset }: RaceDetailsDataSourceApiVariables): Observable<ErgastApiResponse<DriverStandingsResponse>> {
        return this.raceDetailsApiService.getRaceDriverStandings(season, round, limit, offset);
    }

    /**
     * Helper function for extracting the drivers standings results from the API response.
     */
    protected override getDataFromApiResponse(response: ErgastApiResponse<DriverStandingsResponse>): DriverStanding[] {
        return response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }
}