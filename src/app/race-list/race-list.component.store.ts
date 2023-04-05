import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import type { ErgastApiResponse, ErgastApiVariables } from "../ergast-api/ergast-api.types";
import { RaceListApiService } from "./race-list-api.service";
import type { Race, RaceListResponse } from "./race-list.types";

/**
 * Component store for loading race list data and preparing it as a suitable data source for a material table.
 */
@Injectable()
export class RaceListComponentStore extends ErgastApiComponentStore<Race, ErgastApiVariables, RaceListResponse, Record<string, never>> {
    // region Dependency Injections

    private readonly raceListApiService = inject(RaceListApiService);

    // endregion Dependency Injections

    constructor() {
        super({});
    }

    // region Read

    /**
     * The variables required to make the API call to load race data.
     */
    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.season$,
        (limit, offset, season) => ({ limit, offset, season }),
    );

    // endregion Read

    /**
     * Helper function for creating the API query to load a page of race data.
     */
    protected override getApiQuery({ season, limit, offset }: ErgastApiVariables): Observable<ErgastApiResponse<RaceListResponse>> {
        return this.raceListApiService.getRaceList(season, limit, offset);
    }

    /**
     * Helper function for extracting the race list data from the API response.
     */
    protected override getDataFromApiResponse(response: ErgastApiResponse<RaceListResponse>): Race[] {
        return response.MRData.RaceTable.Races;
    }
}