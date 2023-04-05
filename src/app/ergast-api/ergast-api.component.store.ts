import { DataSource } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { filter, Observable, switchMap, tap } from "rxjs";
import { ErgastApiVariables, ErgastApiResponse, MRData } from "./ergast-api.types";

export interface ErgastApiComponentState<Data> {
    data: Data[];
    error: string | null;
    limit: number;
    loading: boolean;
    offset: number;
    season: string | null;
    total: number;
}

function initializeState<Data>(): ErgastApiComponentState<Data> {
    return {
        data: [],
        error: null,
        limit: 10,
        loading: false,
        offset: 0,
        season: null,
        total: 0,
    }
}

/**
 * An abstract component store for managing loading F1 data from the Ergast Developer API in a way that can be used as a data source for a material table.
 * 
 * Extending classes should be sure to implement {@link apiVariables$}, {@link getApiQuery}, and {@link getDataFromApiResponse}. All loading will be handled automatically once the data source
 * is connected to the appropriate table.
 */
@Injectable()
export abstract class ErgastApiComponentStore<Data, ApiVariables extends ErgastApiVariables, ApiResponse extends MRData, State extends Record<string, unknown>> extends ComponentStore<ErgastApiComponentState<Data> & State> implements DataSource<Data> {
    // region Read

    /**
     * The data to display in the table.
     */
    readonly data$ = this.select((state) => state.data);

    /**
     * An error that occurred during an API call, or null if the current query was successful.
     */
    readonly error$ = this.select((state) => state.error);

    /**
     * The current number of results to show per data page.
     */
    readonly limit$ = this.select((state) => state.limit);

    /**
     * Flag indicating if any data is being loaded.
     */
    readonly loading$ = this.select((state) => state.loading);

    /**
     * The current page offset for loading data.
     */
    protected readonly offset$ = this.select((state) => state.offset);

    /**
     * The currently selected season that data is being displayed for.
     */
    protected readonly season$ = this.select((state) => state.season).pipe(filter(Boolean));

    /**
     * The total number of results that could be loaded for the current data query.
     */
    readonly total$ = this.select((state) => state.total);

    /**
     * The variables required to run the API query for the current data view.
     */
    protected abstract apiVariables$: Observable<ApiVariables>;

    // endregion Read

    // region Write

    private readonly setData = this.updater((state, response: ErgastApiResponse<ApiResponse>) => ({
        ...state,
        data: this.getDataFromApiResponse(response),
        loading: false,
        total: Number.parseInt(response.MRData.total, 10),
    }))

    /**
     * Update the state with new pagination variables.
     */
    readonly setPageVariables = this.updater((state, page: PageEvent) => ({
        ...state,
        limit: page.pageSize,
        offset: page.pageIndex * page.pageSize,
    }));

    /**
     * Update the state with a new season to display data for.
     */
    readonly setSeason = this.updater((state, season: string | null) => ({
        ...state,
        season,
    }));

    readonly setError = this.updater((state, error: string | null) => ({ ...state, error }));

    private readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }))

    // endregion Write

    // region Effect

    /**
     * Load data for the current API query, ensuring loading is properly indicated, and handling both successful and failure responses from the API.
     */
    protected readonly loadData = this.effect((variables$: Observable<ApiVariables>) => variables$.pipe(
        tap(() => {
            this.setError(null);
            this.setLoading(true);
        }),
        switchMap((variables) => this.getApiQuery(variables).pipe(
            tapResponse(
                (response) => this.setData(response),
                (error: Error) => {
                    this.setError(error.message);
                    this.setLoading(false)
                },
            )
        ))
    ))

    // endregion Effect

    constructor(initialState: State) {
        super({
            ...initializeState<Data>(),
            ...initialState,
        });
    }

    /**
     * Called when the table connects to the data source.
     */
    connect(): Observable<Data[]> {
        this.loadData(this.apiVariables$);
        return this.data$;
    }

    /**
     * Called when the table disconnects from the data source.
     */
    disconnect(): void {}

    /**
     * Helper function for creating the API call that loads the current page of data.
     */
    protected abstract getApiQuery(variables: ApiVariables): Observable<ErgastApiResponse<ApiResponse>>;

    /**
     * Helper function for extracting the required data from the API call response.
     */
    protected abstract getDataFromApiResponse(response: ErgastApiResponse<ApiResponse>): Data[];
}
