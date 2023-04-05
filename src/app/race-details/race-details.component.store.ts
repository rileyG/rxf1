import { inject, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ComponentStore, OnStateInit, tapResponse } from "@ngrx/component-store";
import { distinctUntilChanged, filter, map, Observable, switchMap, tap } from "rxjs";
import { Race } from "../race-list/race-list.types";
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

    readonly details$ = this.select((state) => state.details);

    readonly error$ = this.select((state) => state.error);

    readonly loading$ = this.select((state) => state.loading);

    readonly round$ = this.activatedRoute.params.pipe(
        map((params) => params['round']),
        filter(Boolean),
        distinctUntilChanged(),
    )

    readonly season$ = this.activatedRoute.params.pipe(
        map((params) => params['season']),
        filter(Boolean),
        distinctUntilChanged(),
    );

    private readonly apiVariables$ = this.select(
        this.round$,
        this.season$,
        (round, season) => ({ round, season })
    )

    // endregion Read

    // region Effect

    private readonly loadRaceDetails = this.effect((variables$: Observable<{ round: string, season: string }>) => variables$.pipe(
        tap(() => this.patchState({ error: null, loading: true })),
        switchMap(({ season, round }) => this.raceDetailsApiService.getRaceDetails(season, round).pipe(
            tapResponse(
                (response) => this.patchState({
                    details: response.MRData.RaceTable.Races[0],
                    loading: false,
                }),
                () => this.patchState({ loading: false })
            )
        ))
    ))

    // endregion Effect

    ngrxOnStateInit(): void {
        this.loadRaceDetails(this.apiVariables$);
    }
}