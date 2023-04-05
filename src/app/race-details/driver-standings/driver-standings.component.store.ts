import { inject, Injectable } from "@angular/core";
import { filter, Observable } from "rxjs";
import { ErgastApiComponentStore } from "src/app/ergast-api/ergast-api.component.store";
import { ErgastApiResponse, ErgastApiVariables } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { DriverStanding, DriverStandingsResponse } from "../race-details.types";

export interface DriverStandingsApiVariables extends ErgastApiVariables {
    round: string;
}

interface DriverStandingsComponentState extends Record<string, unknown> {
    round: string | null;
}

@Injectable()
export class DriverStandingsComponentStore extends ErgastApiComponentStore<DriverStanding, DriverStandingsApiVariables, DriverStandingsResponse, DriverStandingsComponentState> {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super({ round: null });
    }

    // region Read

    private readonly round$ = this.select((state) => state.round).pipe(filter(Boolean));

    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.round$,
        this.season$,
        (limit, offset, round, season) => ({ limit, offset, round, season })
    );

    // endregion Read

    // region Write

    readonly setRound = this.updater((state, round: string | null) => ({ ...state, round }));

    // endregion Write

    protected override getApiQuery({ season, round, limit, offset }: DriverStandingsApiVariables): Observable<ErgastApiResponse<DriverStandingsResponse>> {
        return this.raceDetailsApiService.getRaceDriverStandings(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<DriverStandingsResponse>): DriverStanding[] {
        return response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }
}