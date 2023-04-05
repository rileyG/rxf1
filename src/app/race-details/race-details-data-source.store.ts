import { Injectable } from "@angular/core";
import { filter } from "rxjs";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import type { ErgastApiVariables, MRData } from "../ergast-api/ergast-api.types";

export interface RaceDetailsDataSourceApiVariables extends ErgastApiVariables {
    round: string;
}

interface RaceDetailsDataSourceState extends Record<string, unknown> {
    round: string | null;
}

/**
 * A generic component store for loading race details data and preparing it as a suitable data source for a material table.
 * 
 * Implementing classes should be sure to implement both {@link getApiQuery} and {@link getDataFromApiResponse}, or all API calls will fail.
 */
@Injectable()
export abstract class RaceDetailsDataSourceStore<Data, ApiResponse extends MRData> extends ErgastApiComponentStore<Data, RaceDetailsDataSourceApiVariables, ApiResponse, RaceDetailsDataSourceState> {
    constructor() {
        super({ round: null });
    }

    // region Read

    /**
     * The round that details should be loaded for.
     */
    protected readonly round$ = this.select((state) => state.round).pipe(filter(Boolean));

    /**
     * The API variables required to load the specific race details.
     */
    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.round$,
        this.season$,
        (limit, offset, round, season) => ({ limit, offset, round, season })
    );

    // endregion Read

    // region Write

    /**
     * Update the state with a new round to display data for.
     */
    readonly setRound = this.updater((state, round: string | null) => ({ ...state, round }));

    // endregion Write
}