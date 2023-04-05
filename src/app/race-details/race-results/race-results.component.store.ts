import { inject, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, Observable } from "rxjs";
import { ErgastApiComponentStore } from "src/app/ergast-api/ergast-api.component.store";
import { ErgastApiResponse, ErgastApiVariables } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { RaceResult, RaceResultsResponse } from "../race-details.types";

interface RaceResultsApiVariables extends ErgastApiVariables {
    round: string;
}

interface RaceResultsComponentState extends Record<string, unknown> {
    round: string | null;
}

@Injectable()
export class RaceResultsComponentStore extends ErgastApiComponentStore<RaceResult, RaceResultsApiVariables, RaceResultsResponse, RaceResultsComponentState> {
    // region Dependency Injections

    private readonly activatedRoute = inject(ActivatedRoute);

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
    )

    // endregion Read

    // region Write

    readonly setRound = this.updater((state, round: string) => ({ ...state, round }));

    // endregion Write

    protected override getApiQuery({ limit, offset, round, season }: RaceResultsApiVariables): Observable<ErgastApiResponse<RaceResultsResponse>> {
        return this.raceDetailsApiService.getRaceResults(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<RaceResultsResponse>): RaceResult[] {
        return response.MRData.RaceTable.Races[0].Results;
    }
}