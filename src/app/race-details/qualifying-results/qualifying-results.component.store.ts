import { Injectable, inject } from "@angular/core";
import { filter, Observable } from "rxjs";
import { ErgastApiComponentStore } from "src/app/ergast-api/ergast-api.component.store";
import { ErgastApiResponse, ErgastApiVariables } from "src/app/ergast-api/ergast-api.types";
import { RaceDetailsApiService } from "../race-details-api.service";
import { QualifyingResult, QualifyingResultsResponse } from "../race-details.types";

export interface QualifyingResultsApiVariables extends ErgastApiVariables {
    round: string;
}

export interface QualifyingResultsComponentState extends Record<string, unknown> {
    round: string | null;
}

@Injectable()
export class QualifyingResultsComponentStore extends ErgastApiComponentStore<QualifyingResult, QualifyingResultsApiVariables, QualifyingResultsResponse, QualifyingResultsComponentState> {
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

    protected override getApiQuery({ season, round, limit, offset }: QualifyingResultsApiVariables): Observable<ErgastApiResponse<QualifyingResultsResponse>> {
        return this.raceDetailsApiService.getRaceQualifyingResults(season, round, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<QualifyingResultsResponse>): QualifyingResult[] {
        return response.MRData.RaceTable.Races[0].QualifyingResults;
    }
}