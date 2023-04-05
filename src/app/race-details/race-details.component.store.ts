import { inject, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import type { OnStateInit } from "@ngrx/component-store";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import type { Observable } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, tap } from "rxjs";
import type { Race } from "../race-list/race-list.types";
import { RaceDetailsApiService } from "./race-details-api.service";

interface RaceDetailsComponentState {
    error: string | null;
    loading: boolean;
    details: Race | null;
}

const initialState: RaceDetailsComponentState = {
    details: null,
    error: null,
    loading: false,
}

/**
 * Component store for loading the basic details for a race.
 */
@Injectable()
export class RaceDetailsComponentStore extends ComponentStore<RaceDetailsComponentState> implements OnStateInit {
    // region Dependency Injections

    private readonly activatedRoute = inject(ActivatedRoute);

    private readonly raceDetailsApiService = inject(RaceDetailsApiService);

    // endregion Dependency Injections

    constructor() {
        super(initialState);
    }

    // region Read

    /**
     * The race details, or null if they haven't been loaded yet.
     */
    readonly details$ = this.select((state) => state.details);

    /**
     * Any API errors that occurred, or null if the last API call was successful.
     */
    readonly error$ = this.select((state) => state.error);

    /**
     * Flag indicating if the race data is being loaded.
     */
    readonly loading$ = this.select((state) => state.loading);

    /**
     * The round that data should be loaded for, pulled from the current route parameters.
     */
    readonly round$ = this.activatedRoute.params.pipe(
        map((params) => params['round']),
        filter(Boolean),
        distinctUntilChanged(),
    )

    /**
     * The season the round belongs to, pulled from the current route parameters.
     */
    readonly season$ = this.activatedRoute.params.pipe(
        map((params) => params['season']),
        filter(Boolean),
        distinctUntilChanged(),
    );

    /**
     * The API variables required to load the race details.
     */
    private readonly apiVariables$ = this.select(
        this.round$,
        this.season$,
        (round, season) => ({ round, season })
    )

    // endregion Read

    // region Effect

    /**
     * Load the race details for the current round/season combination.
     */
    private readonly loadRaceDetails = this.effect((variables$: Observable<{ round: string, season: string }>) => variables$.pipe(
        tap(() => this.patchState({ error: null, loading: true })),
        switchMap(({ season, round }) => this.raceDetailsApiService.getRaceDetails(season, round).pipe(
            tapResponse(
                (response) => this.patchState({
                    details: response.MRData.RaceTable.Races[0],
                    loading: false,
                }),
                (error: Error) => this.patchState({ error: error.message, loading: false })
            )
        ))
    ))

    // endregion Effect

    ngrxOnStateInit(): void {
        this.loadRaceDetails(this.apiVariables$);
    }
}