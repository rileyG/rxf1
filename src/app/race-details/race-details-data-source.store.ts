import { Injectable } from "@angular/core";
import { filter } from "rxjs";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import { ErgastApiVariables, MRData } from "../ergast-api/ergast-api.types";

export interface RaceDetailsDataSourceApiVariables extends ErgastApiVariables {
    round: string;
}

interface RaceDetailsDataSourceState extends Record<string, unknown> {
    round: string | null;
}

@Injectable()
export abstract class RaceDetailsDataSourceStore<Data, ApiResponse extends MRData> extends ErgastApiComponentStore<Data, RaceDetailsDataSourceApiVariables, ApiResponse, RaceDetailsDataSourceState> {
    constructor() {
        super({ round: null });
    }

    // region Read

    protected readonly round$ = this.select((state) => state.round).pipe(filter(Boolean));

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
}