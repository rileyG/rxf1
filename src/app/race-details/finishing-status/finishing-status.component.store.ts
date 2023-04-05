import { inject, Injectable } from "@angular/core";
import type { OnStateInit } from '@ngrx/component-store';
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import type { Observable } from 'rxjs';
import { filter, switchMap, tap } from "rxjs";
import { RaceDetailsApiService } from "../race-details-api.service";
import type { Status } from "../race-details.types";

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

/**
 * Component store for loading the counts for different finishing statuses for a given race.
 */
@Injectable()
export class FinishingStatusComponentStore extends ComponentStore<FinishingStatusComponentState> implements OnStateInit {
    // region Dependency Injections

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super(initialState);
    }

    // region Read

    /**
     * The number of accidents for a given round.
     */
    readonly accident$ = this.select((state) => state.accident);

    /**
     * Any API errors that occurred, or null if the last call was successful.
     */
    readonly error$ = this.select((state) => state.error);

    /**
     * The number of finishing cars for a given round.
     */
    readonly finished$ = this.select((state) => state.finished);

    /**
     * Flag indicating if data is being loaded.
     */
    readonly loading$ = this.select((state) => state.loading);

    /**
     * THe number of cars that finished +1 lap for a given race.
     */
    readonly plusOneLap$ = this.select((state) => state.plusOneLap);

    /**
     * The round that data should be loaded for.
     */
    private readonly round$ = this.select((state) => state.round).pipe(filter(Boolean));

    /**
     * The season that the round belongs to.
     */
    private readonly season$ = this.select((state) => state.season).pipe(filter(Boolean));

    /**
     * The variables required to make the API call.
     */
    private readonly apiVariables$ = this.select(
        this.round$,
        this.season$,
        (round, season) => ({ round, season })
    );

    // endregion Read

    // region Write

    /**
     * Update the state with a new round.
     */
    readonly setRound = this.updater((state, round: string | null) => ({ ...state, round }));

    /**
     * Update the state with a new season.
     */
    readonly setSeason = this.updater((state, season: string | null ) => ({ ...state, season }));

    // endregion Write

    // region Effect

    /**
     * Load the finishing data for the given round in the passed season.
     */
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
    ));

    // endregion Effect

    ngrxOnStateInit(): void {
        this.loadData(this.apiVariables$);
    }

    /**
     * Helper function for finding a given status, and returning the count associated with it.
     * 
     * This assumes 0 if no matching status is found.
     */
    private getFinishingStatusCount(statuses: Status[], toFind: string): number {
        const count = statuses.find((status) => status.status === toFind)?.count;

        return count != null ? Number.parseInt(count, 10) : 0;
    }
}