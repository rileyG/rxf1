import { inject, Injectable } from "@angular/core";
import { ComponentStore, OnStateInit, tapResponse } from "@ngrx/component-store";
import { filter, Observable, switchMap, tap } from "rxjs";
import { RaceDetailsApiService } from "../race-details-api.service";
import { Status } from "../race-details.types";

interface FinishingStatusComponentState {
    accident: number | null;
    error: string | null;
    finished: number | null;
    loading: boolean;
    plusOneLap: number | null;
    round: string | null;
    season: string | null;
}

const initialState: FinishingStatusComponentState = {
    accident: null,
    error: null,
    finished: null,
    loading: false,
    plusOneLap: null,
    round: null,
    season: null,
}

@Injectable()
export class FinishingStatusComponentStore extends ComponentStore<FinishingStatusComponentState> implements OnStateInit {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super(initialState);
    }

    // region Read

    readonly accident$ = this.select((state) => state.accident);

    readonly error$ = this.select((state) => state.error);

    readonly finished$ = this.select((state) => state.finished);

    readonly loading$ = this.select((state) => state.loading);

    readonly plusOneLap$ = this.select((state) => state.plusOneLap);

    private readonly round$ = this.select((state) => state.round).pipe(filter(Boolean));

    private readonly season$ = this.select((state) => state.season).pipe(filter(Boolean));

    private readonly apiVariables$ = this.select(
        this.round$,
        this.season$,
        (round, season) => ({ round, season })
    );

    // endregion Read

    // region Write

    readonly setRound = this.updater((state, round: string | null) => ({ ...state, round }));

    readonly setSeason = this.updater((state, season: string | null ) => ({ ...state, season }));

    // endregion Write

    // region Effect

    private readonly loadData = this.effect((variables$: Observable<{ round: string, season: string }>) => variables$.pipe(
        tap(() => this.patchState({ error: null, loading: true })),
        switchMap(({ round, season }) => this.raceDetailsApiService.getRaceFinishingStatus(season, round).pipe(
            tapResponse(
                (response) => this.patchState({
                    accident: this.getFinishingStatusCount(response.MRData.StatusTable.Status, 'Accident'),
                    finished: this.getFinishingStatusCount(response.MRData.StatusTable.Status, 'Finished'),
                    loading: false,
                    plusOneLap: this.getFinishingStatusCount(response.MRData.StatusTable.Status, '+1 Lap')
                }),
                (error: Error) => this.patchState({ error: error.message, loading: false }),
            )
        ))
    ))

    // endregion Effect

    ngrxOnStateInit(): void {
        this.loadData(this.apiVariables$);
    }

    private getFinishingStatusCount(statuses: Status[], toFind: string): number | null {
        const count = statuses.find((status) => status.status === toFind)?.count;

        return count != null ? Number.parseInt(count, 10) : 0;
    }
}