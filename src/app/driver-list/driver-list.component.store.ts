import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { DriverListApiService } from "./driver-list-api.service";
import type { Driver, DriverListResponse } from "./driver-list.types";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import type { ErgastApiResponse, ErgastApiVariables } from "../ergast-api/ergast-api.types";

/**
 * Component store for loading a list of drivers and preparing them as a suitable data source for a material table.
 */
@Injectable()
export class DriverListComponentStore extends ErgastApiComponentStore<Driver, ErgastApiVariables, DriverListResponse, Record<string, never>> {
    // region Dependency Injections

    private readonly driverListApiService = inject(DriverListApiService);

    // endregion Dependency Injections

    constructor() {
        super({});
    }

    // region Read

    // region Composite Selectors

    /**
     * The API variables required to load the driver list for a season.
     */
    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.season$,
        (limit, offset, season) => ({ limit, offset, season }),
    )

    // endregion Composite Selectors

    // endregion Read

    /**
     * Helper function for creating the API query to load the partial list of drivers.
     */
    protected override getApiQuery({ season, limit, offset }: ErgastApiVariables): Observable<ErgastApiResponse<DriverListResponse>> {
        return this.driverListApiService.getDriverList(season, limit, offset);
    }

    /**
     * Helper function for extracting the driver list from the API response.
     */
    protected override getDataFromApiResponse(response: ErgastApiResponse<DriverListResponse>): Driver[] {
        return response.MRData.DriverTable.Drivers;
    }
}